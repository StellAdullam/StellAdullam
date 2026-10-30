export const STROOPS_PER_XLM = 10_000_000n;
export const DEFAULT_BASE_FEE_STROOPS = 100; // Standard Stellar base fee (0.00001 XLM)

/**
 * Converts a raw Stroop amount (10^-7 XLM) into human-readable XLM decimal string.
 */
export function stroopsToXlm(stroops: number | bigint | string): string {
  const val = typeof stroops === 'bigint' ? stroops : BigInt(Math.floor(Number(stroops) || 0));
  const integerPart = val / STROOPS_PER_XLM;
  const remainder = val % STROOPS_PER_XLM;
  const fractionalPart = remainder.toString().padStart(7, '0').replace(/0+$/, '');

  return fractionalPart.length > 0 ? `${integerPart}.${fractionalPart}` : `${integerPart}`;
}

/**
 * Converts an XLM decimal amount into raw integer Stroops.
 */
export function xlmToStroops(xlm: number | string): bigint {
  const str = String(xlm).trim();
  const [intPart, fracPart = ''] = str.split('.');
  const normalizedFrac = fracPart.slice(0, 7).padEnd(7, '0');
  const combined = `${intPart}${normalizedFrac}`;
  return BigInt(combined);
}

/**
 * Computes recommended base fee based on operation count and optional surge multiplier.
 */
export function calculateRecommendedFee(
  operationCount: number = 1,
  surgeMultiplier: number = 1.0,
  baseFee: number = DEFAULT_BASE_FEE_STROOPS,
): number {
  const ops = Math.max(1, operationCount);
  const mult = Math.max(1.0, surgeMultiplier);
  return Math.ceil(baseFee * ops * mult);
}

/**
 * Estimates Soroban resource fees based on instructions and memory footprint.
 */
export function estimateSorobanResourceFee(
  cpuInstructions: number,
  memoryBytes: number,
): number {
  // Simplified Soroban testnet resource rate approximation
  const cpuFee = (cpuInstructions / 10_000) * 25;
  const memFee = (memoryBytes / 1_000) * 15;
  const baseResourceFee = 1_000; // Minimum invocation fee in stroops

  return Math.ceil(baseResourceFee + cpuFee + memFee);
}
