# StellAdullam DeFi-RWA Lending Risk & Liquidation Mathematical Specification

This document provides the formal mathematical specification for the on-chain risk engine, dual-slope interest rate curve, compound interest index accrual, collateral valuation, and liquidation mechanics implemented in [`apps/contracts/contracts/defi-rwa`](../../apps/contracts/contracts/defi-rwa).

---

## 1. Fixed-Point Representation & Protocol Constants

All rate, utilization, health factor, and interest index calculations in `defi-rwa` use **18-decimal fixed-point arithmetic** (`i128`) to prevent floating-point non-determinism on the Soroban VM:

$$
\text{PRECISION} = 10^{18} = 1\_000\_000\_000\_000\_000\_000
$$

| Constant | Symbol | Value (`i128` / `u64`) | Human-Readable Equivalent | Source File |
| :--- | :---: | :---: | :---: | :--- |
| Fixed-Point Scale | $P$ | $10^{18}$ | $1.00$ ($100\%$) | `lending/interest.rs` |
| Seconds Per Year | $T_{\text{year}}$ | $31,536,000\text{ s}$ | $365\text{ days}$ | `lending/interest.rs` |
| Max Borrow APR Cap | $R_{\max}$ | $5 \times 10^{17}$ | $50.00\%\text{ APR}$ | `lending/interest.rs` |
| Minimum Borrow Floor | $B_{\min}$ | $50 \times 10^{7}\text{ stroops}$ | $50.00\text{ USDC}$ | `lending/pool.rs` |
| Default Pool Deposit Cap | $D_{\max}$ | $10^{7} \times 10^{7}\text{ stroops}$ | $10,000,000\text{ USDC}$ | `lending/pool.rs` |
| Minimum Origination Health Factor | $\text{HF}_{\min}$ | $1.5 \times 10^{18}$ | $1.50$ | `lib.rs` |
| Liquidation Threshold Health Factor | $\text{HF}_{\text{liq}}$ | $1.0 \times 10^{18}$ | $1.00$ | `lib.rs` |

---

## 2. Pool Utilization & Liquidity Accounting

For any lending pool with total underlying deposits $D_{\text{total}}$ and total active borrows $B_{\text{total}}$:

### 2.1 Available Liquidity

$$
L_{\text{avail}} = \max\left(0,\; D_{\text{total}} - B_{\text{total}}\right)
$$

### 2.2 Utilization Ratio ($U$)

Implemented in `PoolStorage::calculate_utilization(total_deposits, total_borrows)`:

$$
U = \begin{cases}
0 & \text{if } D_{\text{total}} = 0 \\[6pt]
\left\lfloor \dfrac{B_{\text{total}} \cdot P}{D_{\text{total}}} \right\rfloor & \text{if } D_{\text{total}} > 0
\end{cases}
$$

---

## 3. Dual-Slope Kinked Interest Rate Model

`InterestRateModel` (`lending/interest.rs`) defines a piecewise-linear (kinked) utilization curve parameterized by:

- $R_0$ (`base_rate`): Base borrow rate at $0\%$ utilization (default: $0.02 \times 10^{18} = 2\%$).
- $R_1$ (`slope1`): Incremental rate slope below the optimal kink (default: $0.04 \times 10^{18} = 4\%$).
- $R_2$ (`slope2`): Steep jump-rate slope above the optimal kink (default: $0.75 \times 10^{18} = 75\%$).
- $U_{\text{optimal}}$ (`optimal_utilization`): Target kink utilization threshold (default: $0.80 \times 10^{18} = 80\%$).

### 3.1 Uncapped Borrow Rate ($R_{\text{raw}}$)

$$
R_{\text{raw}}(U) = \begin{cases}
R_0 + \left\lfloor \dfrac{U \cdot R_1}{U_{\text{optimal}}} \right\rfloor & \text{if } U \le U_{\text{optimal}} \\[12pt]
(R_0 + R_1) + \left\lfloor \dfrac{(U - U_{\text{optimal}}) \cdot R_2}{P - U_{\text{optimal}}} \right\rfloor & \text{if } U > U_{\text{optimal}}
\end{cases}
$$

### 3.2 Hard-Capped Borrow Rate ($R_b$)

To prevent runaway debt spirals during temporary liquidity crunches, the protocol enforces a hard ceiling $R_{\max} = 50\%\text{ APR}$ (`MAX_BORROW_RATE`):

$$
R_b(U) = \min\left(R_{\text{raw}}(U),\; R_{\max}\right)
$$

### 3.3 Depositor Supply Rate ($R_s$)

Given protocol reserve factor $f_{\text{reserve}} \in [0, P)$:

$$
R_s(U) = \left\lfloor \frac{\left\lfloor \dfrac{R_b(U) \cdot U}{P} \right\rfloor \cdot (P - f_{\text{reserve}})}{P} \right\rfloor
$$

### 3.4 Numeric Reference Table (Default Parameters: $R_0 = 2\%$, $R_1 = 4\%$, $R_2 = 75\%$, $U_{\text{optimal}} = 80\%$, $f_{\text{reserve}} = 10\%$)

| Scenario | Utilization ($U$) | Regime | Raw Borrow APR ($R_{\text{raw}}$) | Effective Borrow APR ($R_b$) | Supply APR ($R_s$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Empty Pool | $0.00\%$ | Pre-Kink | $2.00\%$ | $2.00\%$ | $0.000\%$ |
| Low Utilization | $40.00\%$ | Pre-Kink | $4.00\%$ | $4.00\%$ | $1.440\%$ |
| Optimal Kink ($U = U_{\text{optimal}}$) | $80.00\%$ | At Kink | $6.00\%$ | $6.00\%$ | $4.320\%$ |
| Post-Kink Stress | $90.00\%$ | Post-Kink | $43.50\%$ | $43.50\%$ | $35.235\%$ |
| Cap Activation Point | $91.73\%$ | Post-Kink (Capped) | $50.00\%$ | $50.00\%$ | $41.280\%$ |
| Full Utilization | $100.00\%$ | Post-Kink (Capped) | $81.00\%$ | **$50.00\%$ (Capped)** | $45.000\%$ |

---

## 4. Per-Second Compound Interest Index Accrual

Rather than using a linear simple-interest approximation that under-accrues over multi-day intervals, `InterestStorage::calculate_new_index` compounds interest per second using **binary exponentiation by squaring** (`pow_precision`).

### 4.1 Per-Second Rate & Compound Factor

For elapsed seconds $\Delta t = t_{\text{now}} - t_{\text{last}} \ge 0$:

$$
r_{\text{sec}} = \left\lfloor \frac{R_b(U)}{T_{\text{year}}} \right\rfloor, \qquad B_{\text{sec}} = P + r_{\text{sec}}
$$

The compound growth factor $C(\Delta t)$ in fixed-point scale $P$ is computed in $O(\log_2 \Delta t)$ multiplications:

$$
C(\Delta t) = \text{pow\_precision}(B_{\text{sec}}, \Delta t) \approx P \cdot \left(1 + \frac{R_b(U)}{P \cdot T_{\text{year}}}\right)^{\Delta t}
$$

### 4.2 Updated Global Pool Interest Index ($I_t$)

$$
I_t = \left\lfloor \frac{I_{t-1} \cdot C(\Delta t)}{P} \right\rfloor, \qquad I_0 = P = 10^{18}
$$

### 4.3 Individual Position Debt & Deposit Interest

- **Current Borrower Debt (`PositionStorage::calculate_current_debt`):**

$$
D_{\text{current}} = \begin{cases}
D_{\text{principal}} & \text{if } I_{\text{borrow}} = 0 \\[6pt]
\left\lfloor \dfrac{D_{\text{principal}} \cdot I_t}{I_{\text{borrow}}} \right\rfloor & \text{if } I_{\text{borrow}} > 0
\end{cases}
$$

- **Accrued Depositor Yield (`PositionStorage::calculate_deposit_interest`):**

$$
Y_{\text{deposit}} = \begin{cases}
0 & \text{if } I_{\text{deposit}} = 0 \text{ or } I_t \le I_{\text{deposit}} \\[8pt]
\left\lfloor \dfrac{A_{\text{deposit}} \cdot \left(\left\lfloor \dfrac{I_t \cdot P}{I_{\text{deposit}}} \right\rfloor - P\right)}{P} \right\rfloor & \text{if } I_t > I_{\text{deposit}}
\end{cases}
$$

---

## 5. Collateral Valuation, Haircuts & Health Factor Bounds

### 5.1 SEP-40 Oracle Price Normalization (`PriceOracle::get_price`)

Given raw oracle price $p_{\text{raw}} > 0$ with oracle decimals $d_{\text{oracle}}$ and age $\Delta t_{\text{oracle}} = t_{\text{ledger}} - t_{\text{price}} \le \Delta t_{\max}$:

$$
p_{\text{norm}} = \begin{cases}
p_{\text{raw}} \cdot 10^{18 - d_{\text{oracle}}} & \text{if } d_{\text{oracle}} \le 18 \\[6pt]
\left\lfloor \dfrac{p_{\text{raw}}}{10^{d_{\text{oracle}} - 18}} \right\rfloor & \text{if } d_{\text{oracle}} > 18
\end{cases}
$$

### 5.2 Collateral Value & Risk Haircuts

For collateral quantity $Q_{\text{col}}$ with normalized price $p_{\text{norm}}$:

$$
V_{\text{collateral}} = \left\lfloor \frac{p_{\text{norm}} \cdot Q_{\text{col}}}{P} \right\rfloor
$$

Each `LendingPool` configures three risk parameters (scaled by $P = 10^{18}$):
1. **Collateral Factor ($\text{CF}$):** Maximum initial Loan-to-Value capacity (e.g., $75\% = 0.75 \times 10^{18}$).
2. **Liquidation Threshold ($\text{LT}$):** Maximum debt-to-collateral ratio before a position becomes liquidatable (e.g., $80\% = 0.80 \times 10^{18}$, satisfying $\text{CF} \le \text{LT} < P$).
3. **Liquidation Penalty ($\text{LP}$):** Discount/incentive bonus awarded to liquidators (e.g., $5\% = 0.05 \times 10^{18}$, satisfying $\text{LT} + \text{LP} \le P$).

### 5.3 Health Factor Formula (`PositionStorage::calculate_health_factor`)

$$
\text{HF} = \begin{cases}
\text{i128::MAX} & \text{if } D_{\text{current}} = 0 \\[8pt]
\left\lfloor \dfrac{V_{\text{collateral}} \cdot \text{LT}}{D_{\text{current}}} \right\rfloor & \text{if } D_{\text{current}} > 0
\end{cases}
$$

### 5.4 Protocol Health Factor Zones & Safety Bounds

| Health Factor Range ($\text{HF}$) | Fixed-Point Condition | Protocol State & Allowed Operations |
| :--- | :--- | :--- |
| $\text{HF} = \text{i128::MAX}$ | $D_{\text{current}} = 0$ | **Debt-Free:** Zero debt guard prevents division by zero. |
| $\text{HF} \ge 1.5 \times 10^{18}$ | $\text{HF} \ge \text{HF}_{\min}$ | **Safe / Origination Eligible:** New borrows (`borrow`) are permitted only when post-borrow $\text{HF} \ge 1.5$. |
| $1.2 \times 10^{18} < \text{HF} < 1.5 \times 10^{18}$ | $1.0P \le \text{HF} < 1.5P$ | **Buffer Zone:** Existing position remains solvent; additional borrowing is blocked unless more collateral is posted. |
| $1.0 \times 10^{18} \le \text{HF} \le 1.2 \times 10^{18}$ | $1.0P \le \text{HF} \le 1.2P$ | **Warning Zone:** Off-chain indexer dispatches HMAC-SHA256 webhook alerts for margin top-up or partial repayment. |
| $\text{HF} < 1.0 \times 10^{18}$ | $\text{HF} < P$ | **Liquidatable (`is_liquidatable == true`):** Position is underwater relative to $\text{LT}$; eligible for `liquidate`. |

---

## 6. Repayment & Liquidation Settlement Mechanics

### 6.1 Proportional Collateral Release on Partial/Full Repayment (`PositionStorage::apply_repayment`)

For repayment amount $A_{\text{repay}} > 0$ against current debt $D_{\text{current}} > 0$:

$$
A_{\text{effective}} = \min\left(A_{\text{repay}},\; D_{\text{current}}\right), \qquad D_{\text{remaining}} = D_{\text{current}} - A_{\text{effective}}
$$

$$
Q_{\text{released}} = \begin{cases}
Q_{\text{col}} & \text{if } D_{\text{remaining}} = 0 \\[6pt]
\left\lfloor \dfrac{Q_{\text{col}} \cdot A_{\text{effective}}}{D_{\text{current}}} \right\rfloor & \text{if } D_{\text{remaining}} > 0
\end{cases}
$$

When $D_{\text{remaining}} > 0$, the position's principal is re-baselined to $D_{\text{remaining}}$ and `index_at_borrow` is updated to the current pool index $I_t$.

### 6.2 Liquidation Execution (`DeFiRwaContract::liquidate`)

When $\text{HF} < P$ ($1.0 \times 10^{18}$):
1. Interest is accrued up to the current ledger timestamp (`accrue_interest_internal`).
2. Health factor $\text{HF} < P$ is verified on-chain.
3. The liquidator transfers $D_{\text{current}}$ of the pool's underlying asset to the contract, making the lending pool whole.
4. The borrower's locked collateral $Q_{\text{col}}$ is transferred from the contract to the liquidator, and the underwater `BorrowPosition` is removed from storage.

### 6.3 End-to-End Numeric Edge-Case Scenarios ($\text{LT} = 80\% = 0.8 \times 10^{18}$)

| Case | Collateral Value ($V_{\text{collateral}}$) | Current Debt ($D_{\text{current}}$) | Health Factor ($\text{HF} / 10^{18}$) | Can Borrow More? | Webhook Alert? | Liquidatable? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **1. Zero Debt** | $\$10,000$ | $\$0$ | $\text{i128::MAX}$ | Yes | No | No |
| **2. Fresh Origination** | $\$10,000$ | $\$5,000$ | $\dfrac{10,000 \times 0.80}{5,000} = \mathbf{1.60}$ | Yes ($\ge 1.50$) | No | No |
| **3. Max Origination Boundary** | $\$15,000$ | $\$8,000$ | $\dfrac{15,000 \times 0.80}{8,000} = \mathbf{1.50}$ | Boundary ($= 1.50$) | No | No |
| **4. Warning Zone (Price Drop)** | $\$7,000$ | $\$5,000$ | $\dfrac{7,000 \times 0.80}{5,000} = \mathbf{1.12}$ | No ($< 1.50$) | **Yes ($1.0 < \text{HF} \le 1.2$)** | No |
| **5. Liquidation Threshold** | $\$6,000$ | $\$5,000$ | $\dfrac{6,000 \times 0.80}{5,000} = \mathbf{0.96}$ | No | Critical | **Yes ($\text{HF} < 1.0$)** |
| **6. Deep Underwater Debt** | $\$4,500$ | $\$5,000$ | $\dfrac{4,500 \times 0.80}{5,000} = \mathbf{0.72}$ | No | Critical | **Yes ($\text{HF} < 1.0$)** |
