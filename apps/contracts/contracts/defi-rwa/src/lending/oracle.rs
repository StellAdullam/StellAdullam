use sep_40_oracle::{Asset, PriceData, PriceFeedClient};
use soroban_sdk::{Address, Env};

use super::keys::LendingKey;

/// Default maximum age for price data (1 hour in seconds).
const DEFAULT_MAX_AGE: u64 = 3600;

/// Strict SEP-40 heartbeat staleness window (300 seconds ≈ 60 Stellar ledgers).
pub const DEFAULT_HEARTBEAT_SECONDS: u64 = 300;

/// Default maximum single-epoch price deviation in basis points (1500 bps = 15%).
pub const DEFAULT_MAX_DEVIATION_BPS: u32 = 1500;

/// Basis points denominator (100% = 10,000 bps).
const BPS_DENOMINATOR: i128 = 10_000;

/// Maximum allowable future timestamp drift (60 seconds) to protect against oracle clock manipulation.
const MAX_FUTURE_TIMESTAMP_DRIFT: u64 = 60;

/// Oracle price consumer with production-grade guardrails.
///
/// Every price-sensitive code path in the contract MUST go through
/// [`get_price`] (or the equivalent [`get_guarded_price`] alias) so that
/// staleness, validity, and floor checks are applied uniformly.
pub struct PriceOracle;

impl PriceOracle {
    // ─── Oracle Address ─────────────────────────────

    /// Set the address of the SEP-40 oracle contract.
    pub fn set_oracle_address(env: &Env, oracle_address: &Address) {
        env.storage()
            .instance()
            .set(&LendingKey::OracleAddress, oracle_address);
    }

    /// Retrieve the configured oracle address.
    pub fn get_oracle_address(env: &Env) -> Address {
        env.storage()
            .instance()
            .get(&LendingKey::OracleAddress)
            .expect("Oracle address not configured")
    }

    // ─── Configurable Guardrail Parameters ──────────

    /// Set the maximum acceptable age (seconds) for price data.
    ///
    /// Any price older than `max_age` seconds relative to the current ledger
    /// timestamp will be rejected as stale.
    pub fn set_max_age(env: &Env, max_age: u64) {
        env.storage()
            .instance()
            .set(&LendingKey::OracleMaxAge, &max_age);
    }

    /// Get the configured maximum age. Returns [`DEFAULT_MAX_AGE`] if not set.
    pub fn get_max_age(env: &Env) -> u64 {
        env.storage()
            .instance()
            .get(&LendingKey::OracleMaxAge)
            .unwrap_or(DEFAULT_MAX_AGE)
    }

    /// Set the strict SEP-40 heartbeat staleness window in seconds.
    ///
    /// Defaults to [`DEFAULT_HEARTBEAT_SECONDS`] (300 seconds ≈ 60 Stellar ledgers).
    pub fn set_heartbeat(env: &Env, heartbeat_secs: u64) {
        if heartbeat_secs == 0 {
            panic!("Heartbeat threshold must be greater than zero");
        }
        env.storage()
            .instance()
            .set(&LendingKey::OracleHeartbeat, &heartbeat_secs);
    }

    /// Get the configured SEP-40 heartbeat window. Returns [`DEFAULT_HEARTBEAT_SECONDS`] (300s) if not set.
    pub fn get_heartbeat(env: &Env) -> u64 {
        env.storage()
            .instance()
            .get(&LendingKey::OracleHeartbeat)
            .unwrap_or(DEFAULT_HEARTBEAT_SECONDS)
    }

    /// Set the maximum allowable single-epoch price deviation in basis points
    /// (e.g., `1500` = 15.00%) and enable the deviation circuit breaker.
    pub fn set_max_deviation_bps(env: &Env, max_deviation_bps: u32) {
        if max_deviation_bps == 0 || max_deviation_bps > 10_000 {
            panic!("Invalid max deviation bps");
        }
        env.storage()
            .instance()
            .set(&LendingKey::OracleMaxDeviationBps, &max_deviation_bps);
        env.storage()
            .instance()
            .set(&LendingKey::OracleDeviationGuardEnabled, &true);
    }

    /// Get the configured maximum single-epoch price deviation in basis points.
    /// Returns [`DEFAULT_MAX_DEVIATION_BPS`] (`1500` = 15%) if not set.
    pub fn get_max_deviation_bps(env: &Env) -> u32 {
        env.storage()
            .instance()
            .get(&LendingKey::OracleMaxDeviationBps)
            .unwrap_or(DEFAULT_MAX_DEVIATION_BPS)
    }

    /// Enable or disable the single-epoch price deviation circuit breaker on [`get_price`].
    pub fn set_deviation_guard_enabled(env: &Env, enabled: bool) {
        env.storage()
            .instance()
            .set(&LendingKey::OracleDeviationGuardEnabled, &enabled);
    }

    /// Return whether the single-epoch price deviation circuit breaker is enabled on [`get_price`].
    pub fn is_deviation_guard_enabled(env: &Env) -> bool {
        env.storage()
            .instance()
            .get(&LendingKey::OracleDeviationGuardEnabled)
            .unwrap_or(false)
    }

    /// Retrieve the last validated normalized price recorded for `asset`.
    pub fn get_last_recorded_price(env: &Env, asset: &Address) -> Option<i128> {
        env.storage()
            .persistent()
            .get(&LendingKey::OracleLastPrice(asset.clone()))
    }

    /// Set the minimum acceptable *normalized* price (floor).
    ///
    /// After decimal normalization the price must be ≥ `min_price`.
    /// Set to `0` to disable the floor (default behaviour).
    pub fn set_min_price(env: &Env, min_price: i128) {
        env.storage()
            .instance()
            .set(&LendingKey::OracleMinPrice, &min_price);
    }

    /// Get the configured minimum price floor. Returns `0` if not set.
    pub fn get_min_price(env: &Env) -> i128 {
        env.storage()
            .instance()
            .get(&LendingKey::OracleMinPrice)
            .unwrap_or(0_i128)
    }

    // ─── Guarded Price Fetch ────────────────────────

    /// Fetch the price for `asset` with full production guardrails:
    ///
    /// 1. Rejects missing prices (`None` from oracle).
    /// 2. Rejects zero or negative raw prices.
    /// 3. Rejects stale prices (age > configurable max age).
    /// 4. Normalizes decimals to 18-decimal precision using checked math.
    /// 5. Enforces the configurable minimum price floor after normalization.
    /// 6. When the deviation circuit breaker is enabled, rejects single-epoch
    ///    price movements exceeding [`get_max_deviation_bps`] (default 15%).
    pub fn get_price(env: &Env, asset: &Address) -> i128 {
        let max_age = Self::get_max_age(env);
        let enforce_deviation = Self::is_deviation_guard_enabled(env);
        Self::fetch_and_validate_price(env, asset, max_age, enforce_deviation)
    }

    /// Fetch the SEP-40 price for `asset` enforcing the strict 300-second
    /// (~60 Stellar ledgers) heartbeat check and the 15% single-epoch price
    /// deviation circuit breaker.
    pub fn get_price_with_heartbeat(env: &Env, asset: &Address) -> i128 {
        let heartbeat = Self::get_heartbeat(env);
        Self::fetch_and_validate_price(env, asset, heartbeat, true)
    }

    /// Validate that `new_price` does not deviate from `previous_price` by more
    /// than `max_deviation_bps` basis points within a single epoch.
    pub fn validate_price_deviation(previous_price: i128, new_price: i128, max_deviation_bps: u32) {
        if previous_price <= 0 {
            return;
        }
        let diff = (new_price - previous_price).abs();
        let deviation_bps = diff
            .checked_mul(BPS_DENOMINATOR)
            .expect("Price deviation multiplication overflow")
            / previous_price;
        if deviation_bps > max_deviation_bps as i128 {
            panic!("Circuit breaker: price deviation exceeds maximum threshold");
        }
    }

    /// Canonical safe entry point - alias for [`get_price`].
    ///
    /// Provided for readability at call sites that want to emphasise the
    /// guarded nature of the price fetch.
    pub fn get_guarded_price(env: &Env, asset: &Address) -> i128 {
        Self::get_price(env, asset)
    }

    /// Fetch raw [`PriceData`] from the oracle with basic availability check.
    ///
    /// This still rejects missing prices but does **not** apply staleness,
    /// validity, or floor checks. Use only for informational / diagnostic
    /// purposes - never in risk-sensitive code paths.
    pub fn get_raw_price_data(env: &Env, asset: &Address) -> PriceData {
        let oracle_address = Self::get_oracle_address(env);
        let price_feed_client = PriceFeedClient::new(env, &oracle_address);
        let asset_enum = Asset::Stellar(asset.clone());
        price_feed_client
            .lastprice(&asset_enum)
            .expect("Price not available for asset")
    }

    // ─── Internal Helpers ───────────────────────────

    fn fetch_and_validate_price(
        env: &Env,
        asset: &Address,
        max_staleness_secs: u64,
        enforce_deviation_guard: bool,
    ) -> i128 {
        let oracle_address = Self::get_oracle_address(env);
        let price_feed_client = PriceFeedClient::new(env, &oracle_address);

        // 1. Fetch price - reject if missing
        let asset_enum = Asset::Stellar(asset.clone());
        let price_data: PriceData = price_feed_client
            .lastprice(&asset_enum)
            .expect("Price not available for asset");

        // 2. Reject zero or negative raw price
        if price_data.price <= 0 {
            panic!("Invalid price: price must be positive");
        }

        // 3. Staleness and future timestamp check
        let current_time = env.ledger().timestamp();
        if price_data.timestamp > current_time
            && (price_data.timestamp - current_time) > MAX_FUTURE_TIMESTAMP_DRIFT
        {
            panic!("Price timestamp is in the future");
        }
        if current_time > price_data.timestamp
            && (current_time - price_data.timestamp) > max_staleness_secs
        {
            panic!("Price data is stale");
        }

        // 4. Decimal normalization (target = 18 decimals, overflow-safe)
        let oracle_decimals = price_feed_client.decimals();
        let normalized_price = Self::normalize_price(price_data.price, oracle_decimals);

        // 5. Minimum price floor
        let min_price = Self::get_min_price(env);
        if min_price > 0 && normalized_price < min_price {
            panic!("Price below minimum threshold");
        }

        // 6. Single-epoch price deviation circuit breaker (>15% default)
        if enforce_deviation_guard {
            let max_deviation_bps = Self::get_max_deviation_bps(env);
            if let Some(previous_price) = Self::get_last_recorded_price(env, asset) {
                Self::validate_price_deviation(previous_price, normalized_price, max_deviation_bps);
            }
            env.storage()
                .persistent()
                .set(&LendingKey::OracleLastPrice(asset.clone()), &normalized_price);
        }

        normalized_price
    }

    /// Normalize a price from `oracle_decimals` to 18-decimal precision.
    ///
    /// Uses checked arithmetic to prevent silent overflow.
    fn normalize_price(raw_price: i128, oracle_decimals: u32) -> i128 {
        let decimals_diff = 18_i32 - oracle_decimals as i32;
        if decimals_diff >= 0 {
            let scale_factor = 10_i128.pow(decimals_diff as u32);
            raw_price
                .checked_mul(scale_factor)
                .expect("Price scaling overflow")
        } else {
            let scale_factor = 10_i128.pow((-decimals_diff) as u32);
            raw_price
                .checked_div(scale_factor)
                .expect("Price scaling underflow")
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::PropertyTokenContract;
    use soroban_sdk::{
        contract, contractimpl,
        testutils::{Address as _, Ledger as _},
        Symbol,
    };

    const PRECISION: i128 = 1_000_000_000_000_000_000;

    #[contract]
    pub struct Sep40MockOracle;

    #[contractimpl]
    impl Sep40MockOracle {
        pub fn set_price(env: Env, asset: Address, price: i128, timestamp: u64) {
            let key = (Symbol::new(&env, "price"), asset);
            let data = PriceData { price, timestamp };
            env.storage().persistent().set(&key, &data);
        }

        pub fn lastprice(env: Env, asset: Asset) -> Option<PriceData> {
            match asset {
                Asset::Stellar(addr) => {
                    let key = (Symbol::new(&env, "price"), addr);
                    env.storage().persistent().get(&key)
                }
                Asset::Other(_) => None,
            }
        }

        pub fn decimals(_env: Env) -> u32 {
            18
        }
    }

    #[test]
    fn test_sep40_heartbeat_accepts_fresh_price_within_300s() {
        let env = Env::default();
        env.mock_all_auths();

        let mut li = env.ledger().get();
        li.timestamp = 10_000;
        env.ledger().set(li);

        let admin = Address::generate(&env);
        let contract_id = env.register(PropertyTokenContract, (&admin,));
        let oracle_id = env.register(Sep40MockOracle, ());
        let asset = Address::generate(&env);

        env.as_contract(&contract_id, || {
            PriceOracle::set_oracle_address(&env, &oracle_id);
            assert_eq!(PriceOracle::get_heartbeat(&env), DEFAULT_HEARTBEAT_SECONDS);
            assert_eq!(
                PriceOracle::get_max_deviation_bps(&env),
                DEFAULT_MAX_DEVIATION_BPS
            );
        });

        // Timestamp is 295 seconds old (within 300s / ~60 Stellar ledgers heartbeat)
        env.as_contract(&oracle_id, || {
            Sep40MockOracle::set_price(env.clone(), asset.clone(), PRECISION, 10_000 - 295);
        });

        let price = env.as_contract(&contract_id, || {
            PriceOracle::get_price_with_heartbeat(&env, &asset)
        });
        assert_eq!(price, PRECISION);
    }

    #[test]
    #[should_panic(expected = "Price data is stale")]
    fn test_sep40_heartbeat_rejects_stale_price_over_300s() {
        let env = Env::default();
        env.mock_all_auths();

        let mut li = env.ledger().get();
        li.timestamp = 10_000;
        env.ledger().set(li);

        let admin = Address::generate(&env);
        let contract_id = env.register(PropertyTokenContract, (&admin,));
        let oracle_id = env.register(Sep40MockOracle, ());
        let asset = Address::generate(&env);

        env.as_contract(&contract_id, || {
            PriceOracle::set_oracle_address(&env, &oracle_id);
        });

        // 301 seconds old (> 300s heartbeat window) -> must panic
        env.as_contract(&oracle_id, || {
            Sep40MockOracle::set_price(env.clone(), asset.clone(), PRECISION, 10_000 - 301);
        });

        env.as_contract(&contract_id, || {
            PriceOracle::get_price_with_heartbeat(&env, &asset);
        });
    }

    #[test]
    #[should_panic(expected = "Circuit breaker: price deviation exceeds maximum threshold")]
    fn test_sep40_circuit_breaker_rejects_single_epoch_spike_above_15_percent() {
        let env = Env::default();
        env.mock_all_auths();

        let mut li = env.ledger().get();
        li.timestamp = 10_000;
        env.ledger().set(li);

        let admin = Address::generate(&env);
        let contract_id = env.register(PropertyTokenContract, (&admin,));
        let oracle_id = env.register(Sep40MockOracle, ());
        let asset = Address::generate(&env);

        env.as_contract(&contract_id, || {
            PriceOracle::set_oracle_address(&env, &oracle_id);
        });

        // Initial epoch price: 1.00 USD
        env.as_contract(&oracle_id, || {
            Sep40MockOracle::set_price(env.clone(), asset.clone(), PRECISION, 10_000);
        });
        env.as_contract(&contract_id, || {
            let p0 = PriceOracle::get_price_with_heartbeat(&env, &asset);
            assert_eq!(p0, PRECISION);
        });

        // Next update: +20% spike in a single epoch (1.20 USD > 15% limit) -> must trip circuit breaker
        env.as_contract(&oracle_id, || {
            Sep40MockOracle::set_price(
                env.clone(),
                asset.clone(),
                (PRECISION * 120) / 100,
                10_000,
            );
        });
        env.as_contract(&contract_id, || {
            PriceOracle::get_price_with_heartbeat(&env, &asset);
        });
    }

    #[test]
    fn test_sep40_circuit_breaker_allows_movement_within_15_percent() {
        let env = Env::default();
        env.mock_all_auths();

        let mut li = env.ledger().get();
        li.timestamp = 10_000;
        env.ledger().set(li);

        let admin = Address::generate(&env);
        let contract_id = env.register(PropertyTokenContract, (&admin,));
        let oracle_id = env.register(Sep40MockOracle, ());
        let asset = Address::generate(&env);

        env.as_contract(&contract_id, || {
            PriceOracle::set_oracle_address(&env, &oracle_id);
        });

        // Initial price: 1.00 USD
        env.as_contract(&oracle_id, || {
            Sep40MockOracle::set_price(env.clone(), asset.clone(), PRECISION, 10_000);
        });
        env.as_contract(&contract_id, || {
            assert_eq!(PriceOracle::get_price_with_heartbeat(&env, &asset), PRECISION);
        });

        // +14% move (1.14 USD <= 15% max deviation) -> accepted and recorded as new baseline
        let next_price = (PRECISION * 114) / 100;
        env.as_contract(&oracle_id, || {
            Sep40MockOracle::set_price(env.clone(), asset.clone(), next_price, 10_000);
        });
        env.as_contract(&contract_id, || {
            assert_eq!(
                PriceOracle::get_price_with_heartbeat(&env, &asset),
                next_price
            );
            assert_eq!(
                PriceOracle::get_last_recorded_price(&env, &asset),
                Some(next_price)
            );
        });
    }
}
