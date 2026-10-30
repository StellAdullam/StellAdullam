import { describe, expect, it } from "vitest";
import {
  isPropertyInfo,
  isLendingPool,
  isBorrowPosition,
  isTileState,
} from "./type-guards";

describe("Domain Type Guards", () => {
  it("validates PropertyInfo objects correctly", () => {
    const valid = {
      id: "1",
      name: "Penthouse",
      valuation: 500000,
      totalShares: 1000,
      availableShares: 200,
    };
    expect(isPropertyInfo(valid)).toBe(true);
    expect(isPropertyInfo({ id: "1" })).toBe(false);
    expect(isPropertyInfo(null)).toBe(false);
  });

  it("validates TileState objects correctly", () => {
    const valid = { index: 0, x: 0, y: 0, improvementLevel: 1 };
    expect(isTileState(valid)).toBe(true);
    expect(isTileState({ index: "0" })).toBe(false);
  });
});
