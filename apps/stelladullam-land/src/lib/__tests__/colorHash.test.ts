import { describe, expect, it } from "bun:test";
import { addressToHSL, addressToGlow } from "../colorHash";

describe("colorHash utility", () => {
  it("maps treasury and empty addresses to gold variable", () => {
    expect(addressToHSL("")).toBe("var(--land-gold)");
    expect(addressToHSL("GBTREASURY")).toBe("var(--land-gold)");
    expect(addressToHSL("treasury")).toBe("var(--land-gold)");
    expect(addressToHSL("system")).toBe("var(--land-gold)");
  });

  it("produces deterministic HSL color for the same player address", () => {
    const addr = "GABC1234EFGH5678IJKL9012MNOP3456QRST7890UVWX1234YZ56";
    const color1 = addressToHSL(addr);
    const color2 = addressToHSL(addr);

    expect(color1).toBe(color2);
    expect(color1.startsWith("hsl(")).toBe(true);
    expect(color1.endsWith("%)")).toBe(true);
  });

  it("produces different colors for different player addresses", () => {
    const addr1 = "GABC1234EFGH5678IJKL9012MNOP3456QRST7890UVWX1234YZ56";
    const addr2 = "GDEF5678ABCD1234MNOP9012EFGH3456IJKL7890QRST1234UV56";

    expect(addressToHSL(addr1)).not.toBe(addressToHSL(addr2));
  });

  it("returns appropriate glow variant", () => {
    expect(addressToGlow("")).toBe("var(--land-gold-glow)");
    expect(addressToGlow("GBTREASURY")).toBe("var(--land-gold-glow)");

    const playerAddr = "GABC1234EFGH5678IJKL9012MNOP3456QRST7890UVWX1234YZ56";
    const glow = addressToGlow(playerAddr);
    expect(glow.startsWith("hsla(")).toBe(true);
    expect(glow.includes("0.35")).toBe(true);
  });
});
