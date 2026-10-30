import { describe, expect, it } from "bun:test";
import { getOrdinalSuffix, toOrdinal } from "./ordinal";

describe("ordinal utilities", () => {
  it("formats ordinal numbers correctly", () => {
    expect(toOrdinal(1)).toBe("1st");
    expect(toOrdinal(2)).toBe("2nd");
    expect(toOrdinal(3)).toBe("3rd");
    expect(toOrdinal(4)).toBe("4th");
    expect(toOrdinal(11)).toBe("11th");
    expect(toOrdinal(12)).toBe("12th");
    expect(toOrdinal(13)).toBe("13th");
    expect(toOrdinal(21)).toBe("21st");
    expect(toOrdinal(22)).toBe("22nd");
    expect(toOrdinal(23)).toBe("23rd");
    expect(toOrdinal(100)).toBe("100th");
    expect(toOrdinal(101)).toBe("101st");
  });

  it("computes ordinal suffixes correctly", () => {
    expect(getOrdinalSuffix(1)).toBe("st");
    expect(getOrdinalSuffix(2)).toBe("nd");
    expect(getOrdinalSuffix(3)).toBe("rd");
    expect(getOrdinalSuffix(15)).toBe("th");
  });
});
