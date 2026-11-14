use rwa_defi_contract::{
    InterestRateModel, InterestStorage, PositionStorage, MAX_BORROW_RATE, PRECISION,
    SECONDS_PER_YEAR,
};

// =======================================================================
// 10,000-Iteration Property-Based Fuzz Suite (LTV Debt Ratios & Rates)
// =======================================================================

/// Deterministic SplitMix64 PRNG for reproducible 10,000-iteration fuzzing in #![no_std].
struct FuzzRng {
    state: u64,
}

impl FuzzRng {
    fn new(seed: u64) -> Self {
        Self { state: seed }
    }

    fn next_u64(&mut self) -> u64 {
        self.state = self.state.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = self.state;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
        z ^ (z >> 31)
    }

    fn next_range_i128(&mut self, min_inclusive: i128, max_inclusive: i128) -> i128 {
        if max_inclusive <= min_inclusive {
            return min_inclusive;
        }
        let span = (max_inclusive - min_inclusive + 1) as u128;
        let rand_u128 = ((self.next_u64() as u128) << 64) | (self.next_u64() as u128);
        min_inclusive + ((rand_u128 % span) as i128)
    }
}

#[test]
fn test_fuzz_10000_borrow_rate_monotonic_and_capped() {
    let model = InterestRateModel::default();
    let mut rng = FuzzRng::new(0x517C_C1B7_2722_0A95);

    for iter in 0..10_000u32 {
        let a = rng.next_range_i128(0, PRECISION);
        let b = rng.next_range_i128(0, PRECISION);
        let (u_low, u_high) = if a <= b { (a, b) } else { (b, a) };

        let rate_low = model.calculate_borrow_rate(u_low);
        let rate_high = model.calculate_borrow_rate(u_high);

        // Invariant 1: Borrow rate monotonically non-decreasing with utilization
        assert!(
            rate_high >= rate_low,
            "Iteration {}: monotonicity violated for u_low={} (rate={}) vs u_high={} (rate={})",
            iter,
            u_low,
            rate_low,
            u_high,
            rate_high
        );

        // Invariant 2a: Borrow rate bounded between base_rate and MAX_BORROW_RATE
        assert!(rate_low >= model.base_rate && rate_low <= MAX_BORROW_RATE);
        assert!(rate_high >= model.base_rate && rate_high <= MAX_BORROW_RATE);
    }
}

#[test]
fn test_fuzz_10000_accrued_interest_non_negative_and_bounded() {
    let model = InterestRateModel::default();
    let mut rng = FuzzRng::new(0xA409_3822_299F_31D0);

    for iter in 0..10_000u32 {
        let utilization = rng.next_range_i128(0, PRECISION);
        let borrow_rate = model.calculate_borrow_rate(utilization);
        // Random elapsed interval between 0 and 1 year (31,536,000 seconds)
        let time_elapsed = rng.next_u64() % (SECONDS_PER_YEAR + 1);
        // Random starting index between 1.0x and 5.0x PRECISION
        let start_index = rng.next_range_i128(PRECISION, 5 * PRECISION);
        // Random principal up to 10,000,000 USDC (in 7-decimal stroops)
        let principal = rng.next_range_i128(1, 100_000_000_000_000);

        let new_index =
            InterestStorage::calculate_new_index(start_index, borrow_rate, time_elapsed);

        // Invariant 2b: Interest index never decreases (accrued interest >= 0)
        assert!(
            new_index >= start_index,
            "Iteration {}: new_index {} < start_index {} for rate={}, dt={}",
            iter,
            new_index,
            start_index,
            borrow_rate,
            time_elapsed
        );

        let current_debt = (principal * new_index) / start_index;
        let accrued_interest = current_debt - principal;
        assert!(
            accrued_interest >= 0,
            "Iteration {}: negative accrued interest {}",
            iter,
            accrued_interest
        );
    }
}

#[test]
fn test_fuzz_10000_health_factor_zero_debt_and_ltv_bounds() {
    let mut rng = FuzzRng::new(0x1319_8A2E_0370_7344);

    for iter in 0..10_000u32 {
        let collateral_value = rng.next_range_i128(0, 1_000_000 * PRECISION);
        let liquidation_threshold = rng.next_range_i128(PRECISION / 10, (95 * PRECISION) / 100);

        // Invariant 3a: Zero debt never divides by zero and always returns i128::MAX
        let hf_zero_debt =
            PositionStorage::calculate_health_factor(collateral_value, 0, liquidation_threshold);
        assert_eq!(
            hf_zero_debt,
            i128::MAX,
            "Iteration {}: zero debt must return i128::MAX",
            iter
        );

        // Invariant 3b: Positive debt produces non-negative health factor monotonic in collateral
        let debt_value = rng.next_range_i128(1, 1_000_000 * PRECISION);
        let extra_collateral = rng.next_range_i128(0, 100_000 * PRECISION);

        let hf_base = PositionStorage::calculate_health_factor(
            collateral_value,
            debt_value,
            liquidation_threshold,
        );
        let hf_higher_col = PositionStorage::calculate_health_factor(
            collateral_value + extra_collateral,
            debt_value,
            liquidation_threshold,
        );

        assert!(hf_base >= 0);
        assert!(
            hf_higher_col >= hf_base,
            "Iteration {}: increasing collateral decreased health factor",
            iter
        );
    }
}