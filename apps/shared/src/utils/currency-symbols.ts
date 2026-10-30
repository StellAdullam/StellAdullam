const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  BRL: "R$",
  JPY: "¥",
  CAD: "CA$",
  AUD: "A$",
  XLM: "XLM",
};

/**
 * Returns the standardized currency symbol for a given 3-letter currency code.
 * Falls back to the uppercase code itself if unmapped.
 */
export function getCurrencySymbol(code: string): string {
  if (!code) return "$";
  const upper = code.trim().toUpperCase();
  return CURRENCY_SYMBOLS[upper] || upper;
}

/**
 * Formats an amount with its currency symbol prefix/suffix.
 */
export function formatWithCurrency(
  amount: number,
  code: string = "USD",
): string {
  const symbol = getCurrencySymbol(code);
  const formattedNumber = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (symbol === "XLM") {
    return `${formattedNumber} XLM`;
  }

  return `${symbol}${formattedNumber}`;
}
