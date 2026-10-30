import { describe, expect, it } from "bun:test";
import {
  safeBasisPoints,
  safeDivide,
  safeDivideBigInt,
  safePercentage,
} from "./safe-math";

describe("safe-math utilities", () => {
  it("divides numbers safely and handles zero denominator", () => {
    expect(safeDivide(10, 2)).toBe(5);
    expect(safeDivide(10, 0)).toBe(0);
    expect(safeDivide(10, 0, -1)).toBe(-1);
    expect(safeDivide(10, NaN)).toBe(0);
  });

  it("divides BigInts safely and handles zero denominator", () => {
    expect(safeDivideBigInt(100n, 20n)).toBe(5n);
    expect(safeDivideBigInt(100n, 0n)).toBe(0n);
    expect(safeDivideBigInt(100n, 0n, 999n)).toBe(999n);
  });

  it("calculates safe percentages", () => {
    expect(safePercentage(25, 100)).toBe(25);
    expect(safePercentage(1, 4)).toBe(25);
    expect(safePercentage(50, 0)).toBe(0);
    expect(safePercentage(50, 0, 100)).toBe(100);
  });

  it("calculates basis points correctly", () => {
    expect(safeBasisPoints(1, 100)).toBe(100); // 1% = 100 bps
    expect(safeBasisPoints(5, 1000)).toBe(50); // 0.5% = 50 bps
    expect(safeBasisPoints(10, 0)).toBe(0);
  });
});
