import { isValidStellarAddress } from '@stelladullam/shared';

export interface UserAllowanceInfo {
  tokenAddress: string;
  spenderAddress: string;
  allowanceAmount: string;
  isApproved: boolean;
  isMaxAllowance: boolean;
}

export class TokenAllowanceService {
  /**
   * Evaluates token allowance status.
   */
  public evaluateAllowance(
    tokenAddress: string,
    spenderAddress: string,
    currentAllowance: number | string | bigint,
  ): UserAllowanceInfo {
    const rawVal = BigInt(currentAllowance.toString());
    const isApproved = rawVal > 0n;
    const maxThreshold = 1_000_000_000_000_000_000n; // arbitrary large number for max
    const isMaxAllowance = rawVal >= maxThreshold;

    return {
      tokenAddress,
      spenderAddress,
      allowanceAmount: rawVal.toString(),
      isApproved,
      isMaxAllowance,
    };
  }
}

export const tokenAllowanceService = new TokenAllowanceService();
