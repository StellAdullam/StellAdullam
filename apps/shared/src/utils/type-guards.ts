import type { PropertyInfo, LendingPool, BorrowPosition, TileState } from '../types';

/**
 * Checks if a value is a non-null object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Runtime type guard for PropertyInfo.
 */
export function isPropertyInfo(val: unknown): val is PropertyInfo {
  if (!isRecord(val)) return false;
  return (
    typeof val.id === 'string' &&
    typeof val.name === 'string' &&
    typeof val.valuation === 'number' &&
    typeof val.totalShares === 'number' &&
    typeof val.availableShares === 'number'
  );
}

/**
 * Runtime type guard for LendingPool.
 */
export function isLendingPool(val: unknown): val is LendingPool {
  if (!isRecord(val)) return false;
  return (
    typeof val.id === 'string' &&
    typeof val.assetSymbol === 'string' &&
    typeof val.totalLiquidity === 'string' &&
    typeof val.totalBorrowed === 'string' &&
    typeof val.supplyAPY === 'number' &&
    typeof val.borrowAPY === 'number'
  );
}

/**
 * Runtime type guard for BorrowPosition.
 */
export function isBorrowPosition(val: unknown): val is BorrowPosition {
  if (!isRecord(val)) return false;
  return (
    typeof val.id === 'string' &&
    typeof val.borrowerId === 'string' &&
    typeof val.poolId === 'string' &&
    typeof val.principal === 'string' &&
    typeof val.collateralAmount === 'string'
  );
}

/**
 * Runtime type guard for TileState.
 */
export function isTileState(val: unknown): val is TileState {
  if (!isRecord(val)) return false;
  return (
    typeof val.index === 'number' &&
    typeof val.x === 'number' &&
    typeof val.y === 'number' &&
    typeof val.improvementLevel === 'number'
  );
}
