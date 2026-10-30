import { describe, expect, it } from "bun:test";
import { getCurrencySymbol, formatWithCurrency } from "./currency-symbols";

describe("currency-symbols", () => {
  it("resolves common fiat currency symbols", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
    expect(getCurrencySymbol("eur")).toBe("€");
    expect(getCurrencySymbol("GBP")).toBe("£");
    expect(getCurrencySymbol("ngn")).toBe("₦");
    expect(getCurrencySymbol("JPY")).toBe("¥");
  });

  it("falls back to uppercase code for unlisted currency", () => {
    expect(getCurrencySymbol("CHF")).toBe("CHF");
  });

  it("formats amounts with appropriate currency placement", () => {
    expect(formatWithCurrency(1500.5, "USD")).toBe("$1,500.50");
    expect(formatWithCurrency(200.75, "EUR")).toBe("€200.75");
    expect(formatWithCurrency(100, "XLM")).toBe("100.00 XLM");
  });
});
