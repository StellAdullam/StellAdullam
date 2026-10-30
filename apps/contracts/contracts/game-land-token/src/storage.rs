use soroban_sdk::{contracttype, Address, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Balance(Address),
    Allowance(Address, Address),
    FaucetClaimed(Address),
    IsTestnet,
    Treasury,
    Engine,
    Name,
    Symbol,
    Decimals,
}

pub fn get_balance(env: &Env, addr: &Address) -> i128 {
    env.storage()
        .persistent()
        .get(&DataKey::Balance(addr.clone()))
        .unwrap_or(0)
}

pub const BUMP_THRESHOLD: u32 = 17_280; // ~1 day in ledgers
pub const BUMP_AMOUNT: u32 = 518_400;   // ~30 days in ledgers

pub fn set_balance(env: &Env, addr: &Address, amount: i128) {
    let key = DataKey::Balance(addr.clone());
    env.storage().persistent().set(&key, &amount);
    env.storage().persistent().extend_ttl(&key, BUMP_THRESHOLD, BUMP_AMOUNT);
}

pub fn get_allowance(env: &Env, from: &Address, spender: &Address) -> i128 {
    env.storage()
        .persistent()
        .get(&DataKey::Allowance(from.clone(), spender.clone()))
        .unwrap_or(0)
}

pub fn set_allowance(env: &Env, from: &Address, spender: &Address, amount: i128) {
    env.storage()
        .persistent()
        .set(&DataKey::Allowance(from.clone(), spender.clone()), &amount);
}

pub fn has_claimed_faucet(env: &Env, addr: &Address) -> bool {
    env.storage()
        .persistent()
        .has(&DataKey::FaucetClaimed(addr.clone()))
}

pub fn set_faucet_claimed(env: &Env, addr: &Address) {
    let key = DataKey::FaucetClaimed(addr.clone());
    env.storage().persistent().set(&key, &true);
    env.storage().persistent().extend_ttl(&key, BUMP_THRESHOLD, BUMP_AMOUNT);
}

pub fn is_testnet(env: &Env) -> bool {
    env.storage()
        .instance()
        .get(&DataKey::IsTestnet)
        .unwrap_or(false)
}

pub fn set_testnet(env: &Env, val: bool) {
    env.storage().instance().set(&DataKey::IsTestnet, &val);
}

pub fn get_treasury(env: &Env) -> Option<Address> {
    env.storage().instance().get(&DataKey::Treasury)
}

pub fn set_treasury(env: &Env, addr: &Address) {
    env.storage().instance().set(&DataKey::Treasury, addr);
}

pub fn get_engine(env: &Env) -> Option<Address> {
    env.storage().instance().get(&DataKey::Engine)
}

pub fn set_engine(env: &Env, addr: &Address) {
    env.storage().instance().set(&DataKey::Engine, addr);
}
