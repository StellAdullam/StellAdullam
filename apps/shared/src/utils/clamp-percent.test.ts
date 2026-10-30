import { describe, expect, it } from "bun:test";
import { clampPercent, bpsToPercent, percentToBps } from "./clamp-percent";

describe("clamp-percent utilities", () => {
  it("clamps values cleanly between 0 and 100", () => {
    expect(clampPercent(45)).toBe(45);
    expect(clampPercent(-12)).toBe(0);
    expect(clampPercent(150)).toBe(100);
    expect(clampPercent(NaN)).toBe(0);
  });

  it("converts bps to percent accurately", () => {
    expect(bpsToPercent(100)).toBe(1);
    expect(bpsToPercent(250)).toBe(2.5);
    expect(bpsToPercent(35)).toBe(0.35);
  });

  it("converts percent to bps accurately", () => {
    expect(percentToBps(1)).toBe(100);
    expect(percentToBps(2.5)).toBe(250);
    expect(percentToBps(0.35)).toBe(35);
  });
});
