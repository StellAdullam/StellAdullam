/**
 * High-precision Stroop / XLM unit conversion utilities.
 * 1 XLM = 10^7 Stroops (10,000,000 Stroops).
 */

export const STROOPS_IN_ONE_XLM = 10_000_000n;

export function stroopsToXlm(stroops: bigint | number | string): string {
  const val = typeof stroops === 'bigint' ? stroops : BigInt(Math.floor(Number(stroops)));
  const isNegative = val < 0n;
  const absVal = isNegative ? -val : val;

  const integerPart = absVal / STROOPS_IN_ONE_XLM;
  const fractionalPart = (absVal % STROOPS_IN_ONE_XLM).toString().padStart(7, '0');

  // Strip trailing zeros after the 2nd decimal place unless exact match
  const trimmedFraction = fractionalPart.replace(/0+$/, '').padEnd(2, '0');
  const sign = isNegative ? '-' : '';

  return `${sign}${integerPart.toString()}.${trimmedFraction}`;
}

export function xlmToStroops(xlmAmount: string | number): bigint {
  const str = xlmAmount.toString().trim();
  const [intPart, fracPart = ''] = str.split('.');

  const isNegative = intPart.startsWith('-');
  const cleanInt = isNegative ? intPart.slice(1) : intPart;

  const paddedFrac = fracPart.slice(0, 7).padEnd(7, '0');
  const total = BigInt(cleanInt || '0') * STROOPS_IN_ONE_XLM + BigInt(paddedFrac);

  return isNegative ? -total : total;
}
