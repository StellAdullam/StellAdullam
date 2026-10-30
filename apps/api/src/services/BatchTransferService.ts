/**
 * Batch Transfer and Dividend Distribution Service
 * Splits bulk shareholder dividend payments into Stellar transaction-bounded operation batches.
 */

export interface Shareholder {
  address: string;
  shares: number;
}

export interface PayoutAllocation {
  address: string;
  amountStroops: number;
  amountXlm: string;
}

export interface BatchChunk {
  chunkIndex: number;
  allocations: PayoutAllocation[];
  chunkTotalStroops: number;
  chunkTotalXlm: string;
}

export class BatchTransferService {
  public static readonly MAX_OPERATIONS_PER_TRANSACTION = 100;
  public static readonly STROOPS_PER_XLM = 10_000_000;

  /**
   * Calculates proportional shareholder allocations for a total dividend pool in XLM.
   */
  public calculateAllocations(
    totalDividendXlm: number,
    shareholders: readonly Shareholder[],
  ): PayoutAllocation[] {
    const totalShares = shareholders.reduce((acc, s) => acc + s.shares, 0);
    if (totalShares <= 0 || totalDividendXlm <= 0) {
      return [];
    }

    const totalStroops = Math.floor(totalDividendXlm * BatchTransferService.STROOPS_PER_XLM);

    return shareholders.map((s) => {
      const shareFraction = s.shares / totalShares;
      const amountStroops = Math.floor(totalStroops * shareFraction);
      const amountXlm = (amountStroops / BatchTransferService.STROOPS_PER_XLM).toFixed(7);

      return {
        address: s.address,
        amountStroops,
        amountXlm,
      };
    });
  }

  /**
   * Chunks allocations into max 100-operation batches complying with Stellar ledger transaction limits.
   */
  public chunkBatches(
    allocations: readonly PayoutAllocation[],
    maxPerBatch: number = BatchTransferService.MAX_OPERATIONS_PER_TRANSACTION,
  ): BatchChunk[] {
    const chunks: BatchChunk[] = [];
    const limit = Math.max(1, maxPerBatch);

    for (let i = 0; i < allocations.length; i += limit) {
      const slice = allocations.slice(i, i + limit);
      const chunkTotalStroops = slice.reduce((sum, a) => sum + a.amountStroops, 0);
      const chunkTotalXlm = (chunkTotalStroops / BatchTransferService.STROOPS_PER_XLM).toFixed(7);

      chunks.push({
        chunkIndex: Math.floor(i / limit),
        allocations: slice,
        chunkTotalStroops,
        chunkTotalXlm,
      });
    }

    return chunks;
  }
}

export const batchTransferService = new BatchTransferService();
