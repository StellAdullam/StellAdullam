import {
  Keypair,
  TransactionBuilder,
  Transaction,
  FeeBumpTransaction,
} from '@stellar/stellar-sdk';

export interface FeeBumpOptions {
  feeSourceSecret?: string;
  surgeMultiplier?: number;
  maxBaseFeeStroops?: number;
}

export class FeeBumpService {
  private networkPassphrase: string;

  constructor(
    networkPassphrase: string = process.env.STELLAR_NETWORK_PASSPHRASE ??
      'Test SDF Network ; September 2015',
  ) {
    this.networkPassphrase = networkPassphrase;
  }

  /**
   * Wraps an existing inner transaction in a FeeBumpTransaction signed by the feeSource.
   */
  public buildFeeBump(
    innerTxXdr: string,
    options?: FeeBumpOptions,
  ): { feeBumpXdr: string; totalFeeStroops: number } {
    const feeSourceSecret =
      options?.feeSourceSecret ?? process.env.STELLAR_ADMIN_SECRET;

    if (!feeSourceSecret) {
      throw new Error('Fee bump requires a configured feeSourceSecret');
    }

    const feeSource = Keypair.fromSecret(feeSourceSecret);
    const innerTx = new Transaction(innerTxXdr, this.networkPassphrase);

    const surgeMultiplier = options?.surgeMultiplier ?? 2.0;
    const baseFee = Number(innerTx.fee) || 100;
    const bumpedFee = Math.min(
      Math.ceil(baseFee * surgeMultiplier),
      options?.maxBaseFeeStroops ?? 10_000,
    );

    const feeBumpTx = TransactionBuilder.buildFeeBumpTransaction(
      feeSource,
      bumpedFee.toString(),
      innerTx,
      this.networkPassphrase,
    );

    feeBumpTx.sign(feeSource);

    return {
      feeBumpXdr: feeBumpTx.toXDR(),
      totalFeeStroops: bumpedFee,
    };
  }
}

export const feeBumpService = new FeeBumpService();
