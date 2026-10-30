import React, { useState } from "react";

export type FiatCurrency = "USD" | "EUR" | "GBP" | "NGN";

export interface CurrencyConverterPillProps {
  amountXlm: number;
  rates?: Record<FiatCurrency, number>; // Fiat price per 1 XLM
  defaultCurrency?: FiatCurrency;
  className?: string;
}

export const DEFAULT_FIAT_RATES: Record<
  FiatCurrency,
  { rate: number; symbol: string }
> = {
  USD: { rate: 0.125, symbol: "$" },
  EUR: { rate: 0.115, symbol: "€" },
  GBP: { rate: 0.098, symbol: "£" },
  NGN: { rate: 195.0, symbol: "₦" },
};

export const CurrencyConverterPill: React.FC<CurrencyConverterPillProps> = ({
  amountXlm,
  rates,
  defaultCurrency = "USD",
  className = "",
}) => {
  const [currency, setCurrency] = useState<FiatCurrency>(defaultCurrency);

  const currencies: FiatCurrency[] = ["USD", "EUR", "GBP", "NGN"];

  const cycleCurrency = () => {
    const currentIndex = currencies.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencies.length;
    setCurrency(currencies[nextIndex]);
  };

  const currentRate = rates?.[currency] ?? DEFAULT_FIAT_RATES[currency].rate;
  const symbol = DEFAULT_FIAT_RATES[currency].symbol;
  const converted = amountXlm * currentRate;

  return (
    <button
      type="button"
      onClick={cycleCurrency}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-700/60 bg-slate-900/60 hover:bg-slate-800/80 text-xs font-mono text-slate-300 transition-all ${className}`}
      title="Click to cycle between USD, EUR, GBP, and NGN fiat equivalents"
    >
      <span className="text-slate-400">≈</span>
      <span className="font-bold text-white">
        {symbol}
        {converted.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
      <span className="text-[10px] text-indigo-400 font-sans uppercase font-bold">
        {currency}
      </span>
    </button>
  );
};
