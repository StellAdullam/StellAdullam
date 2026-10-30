import { describe, expect, it } from "bun:test";
import { abbreviateNumber } from "./number-abbreviate";

describe("abbreviateNumber", () => {
  it("preserves small numbers under 1000", () => {
    expect(abbreviateNumber(0)).toBe("0");
    expect(abbreviateNumber(450)).toBe("450");
  });

  it("abbreviates thousands with K", () => {
    expect(abbreviateNumber(1500)).toBe("1.5K");
    expect(abbreviateNumber(45000)).toBe("45K");
  });

  it("abbreviates millions with M", () => {
    expect(abbreviateNumber(1250000)).toBe("1.25M");
    expect(abbreviateNumber(10000000)).toBe("10M");
  });

  it("abbreviates billions with B", () => {
    expect(abbreviateNumber(2500000000)).toBe("2.5B");
  });

  it("handles negative figures accurately", () => {
    expect(abbreviateNumber(-5000)).toBe("-5K");
  });
});
