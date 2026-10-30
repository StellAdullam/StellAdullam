export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'XLM';

export const FX_RATES_TO_USD: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.28,
  XLM: 0.12, // $0.12 USD per XLM
};

/**
 * Formats a numerical amount into a localized currency string.
 */
export function formatCurrencyAmount(
  amount: number,
  currency: SupportedCurrency = 'USD',
  locale: string = 'en-US',
): string {
  if (currency === 'XLM') {
    return `${amount.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} XLM`;
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Converts a base USD amount to a target currency using reference FX rates.
 */
export function convertUsdToCurrency(
  amountUsd: number,
  targetCurrency: SupportedCurrency,
): number {
  const rate = FX_RATES_TO_USD[targetCurrency] || 1.0;
  if (targetCurrency === 'XLM') {
    return Number((amountUsd / rate).toFixed(2));
  }
  return Number((amountUsd / rate).toFixed(2));
}
