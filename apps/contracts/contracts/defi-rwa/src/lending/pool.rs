use soroban_sdk::{contracttype, Address, Env, String, Vec};

use super::interest::PRECISION;
use super::keys::{lending_bump, LendingKey};

/// Minimum borrow amount (50 USDC in 7-decimal Stroops) to prevent economically unviable dust debt
pub const MIN_BORROW_AMOUNT: i128 = 50 * 10_000_000;

/// Lending pool configuration and state
#[derive(Clone)]
#[contracttype]
pub struct LendingPool {
    /// Unique pool identifier
    pub id: String,
    /// Pool display name
    pub name: String,
    /// Asset symbol (e.g., "USDC")
    pub asset: String,
    /// Asset contract address
    pub asset_address: Address,
    /// Collateral factor (e.g., 75% = 750000000000000000)
    pub collateral_factor: i128,
    /// Liquidation threshold (e.g., 80% = 800000000000000000)
    pub liquidation_threshold: i128,
    /// Liquidation penalty (e.g., 5% = 50000000000000000)
    pub liquidation_penalty: i128,
    /// Reserve factor in basis points (e.g., 1000 = 10%)
    pub reserve_factor: u32,
    /// Whether pool is active
    pub is_active: bool,
    /// Pool creation timestamp
    pub created_at: u64,
}

impl LendingPool {
    /// Default maximum pool deposit cap (10,000,000 tokens in 7 decimals) to enforce risk boundaries.
    pub const DEFAULT_MAX_POOL_DEPOSIT: i128 = 10_000_000 * 10_000_000;

    /// Verifies that a proposed borrow amount satisfies minimum position size guardrails.
    pub fn validate_borrow_amount(&self, amount: i128) -> bool {
        amount >= MIN_BORROW_AMOUNT
    }

    /// Validates whether adding proposed deposit would exceed pool capacity.
    pub fn can_deposit(&self, current_deposits: i128, new_deposit: i128) -> bool {
        current_deposits
            .checked_add(new_deposit)
            .map(|sum| sum <= Self::DEFAULT_MAX_POOL_DEPOSIT)
            .unwrap_or(false)
    }
}

/// Pool storage helpers
pub struct PoolStorage;

#[allow(dead_code)]
impl PoolStorage {
    /// Store lending pool
    pub fn set(env: &Env, pool: &LendingPool) {
        let key = LendingKey::Pool(pool.id.clone());
        env.storage().persistent().set(&key, pool);
        env.storage().persistent().extend_ttl(
            &key,
            lending_bump::PERSISTENT_BUMP,
            lending_bump::PERSISTENT_BUMP,
        );
    }

    /// Get lending pool by ID
    pub fn get(env: &Env, pool_id: &String) -> Option<LendingPool> {
        let key = LendingKey::Pool(pool_id.clone());
        if env.storage().persistent().has(&key) {
            env.storage().persistent().extend_ttl(
                &key,
                lending_bump::PERSISTENT_BUMP,
                lending_bump::PERSISTENT_BUMP,
            );
            env.storage().persistent().get(&key)
        } else {
            None
        }
    }

    /// Check if pool exists
    pub fn exists(env: &Env, pool_id: &String) -> bool {
        let key = LendingKey::Pool(pool_id.clone());
        env.storage().persistent().has(&key)
    }

    /// Get total deposits for pool
    pub fn get_total_deposits(env: &Env, pool_id: &String) -> i128 {
        let key = LendingKey::PoolTotalDeposits(pool_id.clone());
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Set total deposits for pool
    pub fn set_total_deposits(env: &Env, pool_id: &String, amount: i128) {
        let key = LendingKey::PoolTotalDeposits(pool_id.clone());
        env.storage().persistent().set(&key, &amount);
        env.storage().persistent().extend_ttl(
            &key,
            lending_bump::PERSISTENT_BUMP,
            lending_bump::PERSISTENT_BUMP,
        );
    }

    /// Get total borrows for pool
    pub fn get_total_borrows(env: &Env, pool_id: &String) -> i128 {
        let key = LendingKey::PoolTotalBorrows(pool_id.clone());
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Set total borrows for pool
    pub fn set_total_borrows(env: &Env, pool_id: &String, amount: i128) {
        let key = LendingKey::PoolTotalBorrows(pool_id.clone());
        env.storage().persistent().set(&key, &amount);
        env.storage().persistent().extend_ttl(
            &key,
            lending_bump::PERSISTENT_BUMP,
            lending_bump::PERSISTENT_BUMP,
        );
    }

    /// Get pool reserves
    pub fn get_reserves(env: &Env, pool_id: &String) -> i128 {
        let key = LendingKey::PoolReserves(pool_id.clone());
        env.storage().persistent().get(&key).unwrap_or(0)
    }

    /// Add to pool reserves
    pub fn add_reserves(env: &Env, pool_id: &String, amount: i128) {
        let current = Self::get_reserves(env, pool_id);
        let key = LendingKey::PoolReserves(pool_id.clone());
        env.storage().persistent().set(&key, &(current + amount));
    }

    /// Calculate utilization rate
    pub fn calculate_utilization(total_deposits: i128, total_borrows: i128) -> i128 {
        if total_deposits == 0 {
            return 0;
        }
        (total_borrows * PRECISION) / total_deposits
    }

    /// Calculate available liquidity
    pub fn calculate_available_liquidity(total_deposits: i128, total_borrows: i128) -> i128 {
        if total_deposits <= total_borrows {
            return 0;
        }
        total_deposits - total_borrows
    }

    /// Get pool list
    pub fn get_list(env: &Env) -> Vec<String> {
        let key = LendingKey::PoolList;
        env.storage()
            .persistent()
            .get(&key)
            .unwrap_or(Vec::new(env))
    }

    /// Add pool to list
    pub fn add_to_list(env: &Env, pool_id: &String) {
        let key = LendingKey::PoolList;
        let mut list = Self::get_list(env);
        list.push_back(pool_id.clone());
        env.storage().persistent().set(&key, &list);
    }

    /// Check if pool is paused
    pub fn is_paused(env: &Env, pool_id: &String) -> bool {
        let key = LendingKey::PoolPaused(pool_id.clone());
        env.storage().instance().get(&key).unwrap_or(false)
    }

    /// Set pool pause status
    pub fn set_paused(env: &Env, pool_id: &String, paused: bool) {
        let key = LendingKey::PoolPaused(pool_id.clone());
        env.storage().instance().set(&key, &paused);
    }
}
