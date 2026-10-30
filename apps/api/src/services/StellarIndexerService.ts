import { rpc } from '@stellar/stellar-sdk';
import { logger } from './logger';
import { getDefiRwaContractId, getRealEstateTokenContractId } from '../config/contracts';

export interface IndexerParsedEvent {
  id: string;
  contractId: string;
  topic: string[];
  ledger: number;
  ledgerClosedAt: string;
  txHash: string;
  value: unknown;
}

export type EventHandler = (event: IndexerParsedEvent) => Promise<void> | void;

export class StellarIndexerService {
  private rpcServer: rpc.Server;
  private lastIndexedLedger: number = 0;
  private isRunning: boolean = false;
  private pollIntervalMs: number = 5000;
  private handlers: Map<string, EventHandler[]> = new Map();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    rpcUrl: string = process.env.STELLAR_RPC_URL ?? 'https://soroban-testnet.stellar.org',
  ) {
    this.rpcServer = new rpc.Server(rpcUrl, { allowHttp: rpcUrl.startsWith('http://') });
  }

  /**
   * Subscribe an asynchronous handler to a specific contract event topic.
   */
  public onEvent(topic: string, handler: EventHandler): void {
    const list = this.handlers.get(topic) ?? [];
    list.push(handler);
    this.handlers.set(topic, list);
  }

  /**
   * Start the real-time event indexing loop.
   */
  public async start(startLedger?: number): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    if (startLedger) {
      this.lastIndexedLedger = startLedger;
    } else if (this.lastIndexedLedger === 0) {
      try {
        const latest = await this.rpcServer.getLatestLedger();
        // Start 5 ledgers back to catch recent transactions
        this.lastIndexedLedger = Math.max(1, latest.sequence - 5);
      } catch (err) {
        logger.warn({ err }, 'Failed to fetch latest ledger for indexer init; starting at 1');
        this.lastIndexedLedger = 1;
      }
    }

    logger.info({ startLedger: this.lastIndexedLedger }, 'Stellar Soroban Indexer started');
    this.scheduleNextPoll();
  }

  /**
   * Gracefully stop the indexing loop.
   */
  public stop(): void {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    logger.info('Stellar Soroban Indexer stopped');
  }

  /**
   * Schedule the next polling cycle.
   */
  private scheduleNextPoll(): void {
    if (!this.isRunning) return;
    this.timer = setTimeout(async () => {
      await this.pollEvents();
      this.scheduleNextPoll();
    }, this.pollIntervalMs);
  }

  /**
   * Poll for new contract events from Soroban RPC.
   */
  public async pollEvents(): Promise<IndexerParsedEvent[]> {
    const parsedEvents: IndexerParsedEvent[] = [];
    const contractIds = [getRealEstateTokenContractId(), getDefiRwaContractId()].filter(Boolean);

    if (contractIds.length === 0) {
      return parsedEvents;
    }

    try {
      const response = await this.rpcServer.getEvents({
        startLedger: this.lastIndexedLedger,
        filters: [
          {
            type: 'contract',
            contractIds,
          },
        ],
        limit: 100,
      });

      if (!response.events || response.events.length === 0) {
        return parsedEvents;
      }

      for (const ev of response.events) {
        const parsed: IndexerParsedEvent = {
          id: ev.id,
          contractId: ev.contractId ? ev.contractId.toString() : '',
          topic: ev.topic.map((t) => t.toXDR('base64')),
          ledger: ev.ledger,
          ledgerClosedAt: ev.ledgerClosedAt,
          txHash: ev.txHash,
          value: ev.value.toXDR('base64'),
        };

        parsedEvents.push(parsed);

        // Update checkpoint
        if (ev.ledger >= this.lastIndexedLedger) {
          this.lastIndexedLedger = ev.ledger + 1;
        }

        // Dispatch to registered handlers
        for (const [topicKey, handlers] of this.handlers.entries()) {
          const matches = parsed.topic.some((t) => t.includes(topicKey));
          if (matches) {
            for (const h of handlers) {
              try {
                await h(parsed);
              } catch (dispatchErr) {
                logger.error(
                  { err: dispatchErr, eventId: ev.id },
                  'Error dispatching indexer event',
                );
              }
            }
          }
        }
      }
    } catch (error) {
      logger.warn(
        { error, ledger: this.lastIndexedLedger },
        'Soroban RPC getEvents query failed, will retry',
      );
    }

    return parsedEvents;
  }

  public getLastIndexedLedger(): number {
    return this.lastIndexedLedger;
  }
}

export const stellarIndexer = new StellarIndexerService();
