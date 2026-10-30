import { describe, expect, it } from "bun:test";
import { ceilTo, floorTo, roundTo } from "./round";

describe("round utilities", () => {
  it("rounds numbers to decimal places accurately", () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(1.005, 2)).toBe(1.01);
    expect(roundTo(10.5, 0)).toBe(11);
  });

  it("floors numbers to decimal places", () => {
    expect(floorTo(1.239, 2)).toBe(1.23);
    expect(floorTo(1.999, 1)).toBe(1.9);
  });

  it("ceils numbers to decimal places", () => {
    expect(ceilTo(1.231, 2)).toBe(1.24);
    expect(ceilTo(1.001, 1)).toBe(1.1);
  });

  it("handles non-finite values safely", () => {
    expect(roundTo(Infinity, 2)).toBe(Infinity);
    expect(isNaN(roundTo(NaN, 2))).toBe(true);
  });
});
