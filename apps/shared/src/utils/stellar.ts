import {
  Keypair,
  Horizon,
  Networks,
  TransactionBuilder,
  Contract,
  StrKey,
  xdr,
  Operation as StellarOperation,
  Account,
  Transaction,
} from "@stellar/stellar-sdk";

export interface WalletSigner {
  publicKey: string;
  sign(transaction: string): Promise<string>;
}

export type NetworkType = "testnet" | "mainnet";
type TransactionStatus = "pending" | "success" | "error";

const RETRY_ATTEMPTS = 5;
const INITIAL_BACKOFF_MS = 100;
const MAX_BACKOFF_MS = 5000;

function toOperation(
  op: ReturnType<Contract["call"]> | StellarOperation,
): xdr.Operation {
  // The Stellar SDK types are correct here — single cast with comment
  return op as unknown as xdr.Operation;
}

export interface StellarServiceConfig {
  horizonUrl?: string;
  sorobanRpcUrl?: string;
  networkPassphrase?: string;
}

export class StellarService {
  protected server: Horizon.Server;
  protected networkPassphrase: string;
  protected sorobanRpcUrl: string;

  constructor(networkOrConfig: NetworkType | StellarServiceConfig = "testnet") {
    if (typeof networkOrConfig === "string") {
      const network = networkOrConfig;
      const horizonUrl =
        network === "testnet"
          ? "https://horizon-testnet.stellar.org"
          : "https://horizon.stellar.org";
      this.sorobanRpcUrl =
        network === "testnet"
          ? "https://soroban-testnet.stellar.org"
          : "https://rpc.mainnet.stellar.org";
      this.server = new Horizon.Server(horizonUrl);
      this.networkPassphrase =
        network === "testnet" ? Networks.TESTNET : Networks.PUBLIC;
    } else {
      const config = networkOrConfig;
      const horizonUrl = config.horizonUrl || "https://horizon-testnet.stellar.org";
      this.sorobanRpcUrl = config.sorobanRpcUrl || "https://soroban-testnet.stellar.org";
      this.server = new Horizon.Server(horizonUrl);
      this.networkPassphrase = config.networkPassphrase || Networks.TESTNET;
    }
  }

  async getAccountBalance(address: string): Promise<string> {
    try {
      this.validateAddress(address);
      const account = await this.server.accounts().accountId(address).call();
      const nativeBalance = account.balances.find(
        (b: { asset_type: string; balance?: string }) =>
          b.asset_type === "native",
      );
      return nativeBalance?.balance ?? "0";
    } catch (error) {
      throw new Error("Failed to get account balance", { cause: error });
    }
  }

  async submitTransaction(signedXdr: string): Promise<string> {
    try {
      const envelope = xdr.TransactionEnvelope.fromXDR(signedXdr, "base64");
      const transaction = new Transaction(envelope, this.networkPassphrase);
      const result = await this.server.submitTransaction(transaction);

      if (result.successful) {
        return result.hash;
      }
      const errorResult = result as { result_code?: string };
      throw new Error(
        `Transaction failed: ${errorResult.result_code || "Unknown error"}`,
      );
    } catch (error) {
      throw new Error("Failed to submit transaction", { cause: error });
    }
  }

  async getTransactionStatus(
    txHash: string,
    maxAttempts: number = RETRY_ATTEMPTS,
  ): Promise<TransactionStatus> {
    let backoffMs = INITIAL_BACKOFF_MS;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await this.server
          .transactions()
          .transaction(txHash)
          .call();

        return result.successful ? "success" : "error";
      } catch {
        // Retry logic: wait and try again
        if (attempt < maxAttempts - 1) {
          await this.delay(backoffMs);
          backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
        }
      }
    }

    return "pending";
  }

  async callContract(
    contractId: string,
    method: string,
    args: xdr.ScVal[] = [],
    sourceAccount: string,
  ): Promise<string> {
    try {
      this.validateAddress(sourceAccount);

      const contract = new Contract(contractId);
      const accountRecord = await this.server
        .accounts()
        .accountId(sourceAccount)
        .call();

      // Convert AccountRecord to Account
      const account = new Account(accountRecord.id, accountRecord.sequence);

      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(toOperation(contract.call(method, ...args)))
        .setTimeout(30)
        .build();

      // Note: Horizon Server doesn't support simulateTransaction
      // This would need to be called against a Soroban RPC endpoint
      // For now, return the transaction XDR to be simulated externally
      return transaction.toXDR();
    } catch (error) {
      throw new Error("Failed to call contract", { cause: error });
    }
  }

  async buildAndSignTransaction(
    source: string,
    operation: StellarOperation,
    signer: WalletSigner | Keypair,
  ): Promise<string> {
    try {
      this.validateAddress(source);

      const accountRecord = await this.server
        .accounts()
        .accountId(source)
        .call();

      // Convert AccountRecord to Account
      const account = new Account(accountRecord.id, accountRecord.sequence);

      const transaction = new TransactionBuilder(account, {
        fee: "100",
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(toOperation(operation))
        .setTimeout(30)
        .build();

      if (signer instanceof Keypair) {
        transaction.sign(signer);
      } else {
        const signedXdr = await (signer as WalletSigner).sign(
          transaction.toXDR(),
        );
        const envelope = xdr.TransactionEnvelope.fromXDR(signedXdr, "base64");
        const txEnv = envelope.v1();
        if (txEnv?.signatures) {
          Object.defineProperty(transaction, "signatures", {
            value: txEnv.signatures,
            enumerable: true,
          });
        }
      }

      return transaction.toXDR();
    } catch (error) {
      throw new Error("Failed to build transaction", { cause: error });
    }
  }

  createKeypair(): Keypair {
    return Keypair.random();
  }

  validateAddress(address: string): boolean {
    try {
      StrKey.decodeEd25519PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  validateContractId(contractId: string): boolean {
    return /^C[A-Z2-7]{55}$/.test(contractId);
  }

  assertValidAddress(address: string): void {
    if (!this.validateAddress(address)) {
      throw new Error(`Invalid Stellar address: ${address}`);
    }
  }

  assertValidContractId(contractId: string): void {
    if (!this.validateContractId(contractId)) {
      throw new Error(`Invalid Soroban contract ID: ${contractId}`);
    }
  }

  /** Helper: coerce unknown to Address (Stellar string) */
  asAddress(value: unknown): string {
    if (typeof value !== "string") {
      throw new Error("Expected Stellar address string");
    }
    return value;
  }

  /** Helper: coerce unknown to plain string */
  asString(value: unknown): string {
    if (typeof value !== "string") {
      throw new Error("Expected string argument");
    }
    return value;
  }

  /** Helper: coerce unknown to bigint */
  asBigInt(value: unknown): bigint {
    if (typeof value === "bigint") {
      return value;
    }
    if (typeof value === "number" && Number.isInteger(value)) {
      return BigInt(value);
    }
    if (typeof value === "string" && /^-?\d+$/.test(value)) {
      return BigInt(value);
    }
    throw new Error("Expected integer-compatible Soroban argument");
  }

  /** Helper: coerce unknown to number */
  asNumber(value: unknown): number {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string" && /^-?\d+$/.test(value)) {
      return Number.parseInt(value, 10);
    }
    throw new Error("Expected numeric argument");
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const stellarService = new StellarService();
