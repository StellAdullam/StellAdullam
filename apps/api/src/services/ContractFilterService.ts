/**
 * ContractFilterService
 * Utility service to construct typed Soroban RPC getEvents filter queries,
 * topic symbol hashes, and pagination filters for indexers and telemetry pipelines.
 */

export interface EventTopicFilterOptions {
  contractIds: string[];
  topics?: string[][];
  startLedger?: number;
  limit?: number;
}

export interface SorobanEventFilterPayload {
  filters: Array<{
    type: 'contract' | 'system' | 'diagnostic';
    contractIds: string[];
    topics?: string[][];
  }>;
  startLedger?: number;
  limit?: number;
}

export class ContractFilterService {
  /**
   * Constructs a typed getEvents filter request payload for Soroban RPC
   */
  public static buildEventFilter(options: EventTopicFilterOptions): SorobanEventFilterPayload {
    if (!options.contractIds || options.contractIds.length === 0) {
      throw new Error('At least one contract ID must be provided to build event filter.');
    }

    const payload: SorobanEventFilterPayload = {
      filters: [
        {
          type: 'contract',
          contractIds: options.contractIds,
          ...(options.topics && options.topics.length > 0 ? { topics: options.topics } : {}),
        },
      ],
    };

    if (options.startLedger !== undefined && options.startLedger > 0) {
      payload.startLedger = options.startLedger;
    }

    if (options.limit !== undefined && options.limit > 0) {
      payload.limit = Math.min(options.limit, 1000);
    }

    return payload;
  }

  /**
   * Builds topic filter for specific event actions (e.g. 'deposit', 'borrow')
   */
  public static buildActionTopicFilter(action: string, subtopics: string[] = []): string[] {
    const sanitizedAction = action.trim();
    if (!sanitizedAction) {
      throw new Error('Action name cannot be empty');
    }
    return [sanitizedAction, ...subtopics];
  }

  /**
   * Validates whether a Soroban contract address adheres to C... format
   */
  public static isValidContractId(id: string): boolean {
    return typeof id === 'string' && /^C[A-Z0-9]{55}$/.test(id);
  }
}
