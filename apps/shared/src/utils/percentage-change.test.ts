import { describe, expect, it } from "bun:test";
import {
  calculateBpsChange,
  calculatePercentChange,
  formatPercentChange,
} from "./percentage-change";

describe("percentage-change utilities", () => {
  it("calculates percentage changes correctly", () => {
    expect(calculatePercentChange(100, 120)).toBe(20);
    expect(calculatePercentChange(100, 80)).toBe(-20);
    expect(calculatePercentChange(50, 50)).toBe(0);
    expect(calculatePercentChange(0, 50)).toBe(100);
  });

  it("calculates basis points deltas", () => {
    expect(calculateBpsChange(100, 105)).toBe(500); // +5% = +500 bps
    expect(calculateBpsChange(100, 99.5)).toBe(-50); // -0.5% = -50 bps
  });

  it("formats percentage changes with + and - signs", () => {
    expect(formatPercentChange(12.5)).toBe("+12.50%");
    expect(formatPercentChange(-4.2)).toBe("-4.20%");
    expect(formatPercentChange(0)).toBe("0.00%");
    expect(formatPercentChange(8.333, 1)).toBe("+8.3%");
  });
});
