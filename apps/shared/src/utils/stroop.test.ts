import { describe, expect, it } from "vitest";
import { stroopsToXlm, xlmToStroops } from "./stroop";

describe("Stroop / XLM Unit Converters", () => {
  it("converts Stroops to exact decimal XLM strings", () => {
    expect(stroopsToXlm(10_000_000n)).toBe("1.00");
    expect(stroopsToXlm(15_500_000n)).toBe("1.55");
    expect(stroopsToXlm(100n)).toBe("0.00001");
    expect(stroopsToXlm(0n)).toBe("0.00");
  });

  it("converts XLM strings to exact BigInt Stroop amounts without float rounding", () => {
    expect(xlmToStroops("1")).toBe(10_000_000n);
    expect(xlmToStroops("1.55")).toBe(15_500_000n);
    expect(xlmToStroops("0.00001")).toBe(100n);
    expect(xlmToStroops(100)).toBe(1_000_000_000n);
  });
});
