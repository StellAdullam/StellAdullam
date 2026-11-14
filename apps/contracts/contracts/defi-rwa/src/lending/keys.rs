use soroban_sdk::{contracttype, Address, String};

/// Storage key types for the lending module
#[derive(Clone)]
#[contracttype]
pub enum LendingKey {
    /// Lending pool configuration
    /// Storage: Persistent
    Pool(String),

    /// List of all pool IDs
    /// Storage: Persistent
    PoolList,

    /// Total number of pools
    /// Storage: Instance
    PoolCount,

    /// Deposit position for user in pool
    /// Storage: Persistent
    DepositPosition(Address, String),

    /// Borrow position for user in pool
    /// Storage: Persistent
    BorrowPosition(Address, String),

    /// User's deposit positions list
    /// Storage: Persistent
    UserDeposits(Address),

    /// User's borrow positions list
    /// Storage: Persistent
    UserBorrows(Address),

    /// Pool's total deposits
    /// Storage: Persistent
    PoolTotalDeposits(String),

    /// Pool's total borrows
    /// Storage: Persistent
    PoolTotalBorrows(String),

    /// Pool's accumulated interest index
    /// Storage: Persistent
    PoolInterestIndex(String),

    /// Last accrual timestamp
    /// Storage: Persistent
    PoolLastAccrual(String),

    /// Reserve balance for pool
    /// Storage: Persistent
    PoolReserves(String),

    /// Interest rate model parameters
    /// Storage: Instance
    InterestRateModel(String),

    /// Global lending configuration
    /// Storage: Instance
    LendingConfig,

    /// Pool pause status
    /// Storage: Instance
    PoolPaused(String),

    /// Contract administrator address
    /// Storage: Instance
    Admin,

    /// Oracle Address
    /// Storage: Instance
    OracleAddress,

    /// Maximum age (in seconds) before a price is considered stale
    /// Storage: Instance
    OracleMaxAge,

    /// Minimum acceptable normalized price (floor)
    /// Storage: Instance
    OracleMinPrice,

    /// Strict SEP-40 heartbeat threshold in seconds (default 300s / ~60 ledgers)
    /// Storage: Instance
    OracleHeartbeat,

    /// Maximum single-epoch price deviation in basis points (default 1500 = 15%)
    /// Storage: Instance
    OracleMaxDeviationBps,

    /// Whether the single-epoch price deviation circuit breaker is active on get_price
    /// Storage: Instance
    OracleDeviationGuardEnabled,

    /// Last validated normalized oracle price for an asset (for epoch deviation checks)
    /// Storage: Persistent
    OracleLastPrice(Address),
}

/// TTL bump amounts for lending storage
pub mod lending_bump {
    pub const INSTANCE_BUMP: u32 = 518400; // ~60 days
    pub const PERSISTENT_BUMP: u32 = 2592000; // ~300 days
}
