export enum PropertyContractEventTopic {
  MINT = 'mint',
  TRANSFER = 'transfer',
  BURN = 'burn',
  VALUATION_UPDATED = 'valuation_updated',
  VERIFIED = 'verified',
}

export enum LendingContractEventTopic {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  BORROW = 'borrow',
  REPAY = 'repay',
  LIQUIDATE = 'liquidate',
  RESERVE_UPDATED = 'reserve_updated',
  PAUSED = 'paused',
  UNPAUSED = 'unpaused',
}

export enum GameContractEventTopic {
  FAUCET_CLAIMED = 'faucet_claimed',
  STARTER_CLAIMED = 'starter_claimed',
  IMPROVEMENT_UPGRADED = 'improvement_upgraded',
  RENTAL_CLAIMED = 'rental_claimed',
  ORDER_CREATED = 'order_created',
  ORDER_FULFILLED = 'order_fulfilled',
  ORDER_CANCELLED = 'order_cancelled',
}

export interface ContractEventFilterCriteria {
  type: 'contract';
  contractIds: string[];
  topics?: string[][];
}

/**
 * Builds a standardized Soroban RPC getEvents query filter.
 */
export function buildContractEventFilter(
  contractIds: string | string[],
  topics?: string[],
): ContractEventFilterCriteria {
  const ids = Array.isArray(contractIds) ? contractIds : [contractIds];
  const filter: ContractEventFilterCriteria = {
    type: 'contract',
    contractIds: ids,
  };

  if (topics && topics.length > 0) {
    filter.topics = [topics];
  }

  return filter;
}
