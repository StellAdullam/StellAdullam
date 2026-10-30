/**
 * Stellar Expert explorer deep link helpers.
 */

export type StellarNetworkId = "testnet" | "public" | "futurenet";

export function getStellarExpertBaseUrl(
  network: StellarNetworkId = "testnet",
): string {
  switch (network) {
    case "public":
      return "https://stellar.expert/explorer/public";
    case "futurenet":
      return "https://stellar.expert/explorer/futurenet";
    case "testnet":
    default:
      return "https://stellar.expert/explorer/testnet";
  }
}

export function getStellarExpertTxUrl(
  txHash: string,
  network: StellarNetworkId = "testnet",
): string {
  return `${getStellarExpertBaseUrl(network)}/tx/${encodeURIComponent(txHash.trim())}`;
}

export function getStellarExpertAccountUrl(
  address: string,
  network: StellarNetworkId = "testnet",
): string {
  return `${getStellarExpertBaseUrl(network)}/account/${encodeURIComponent(address.trim())}`;
}

export function getStellarExpertContractUrl(
  contractId: string,
  network: StellarNetworkId = "testnet",
): string {
  return `${getStellarExpertBaseUrl(network)}/contract/${encodeURIComponent(contractId.trim())}`;
}
