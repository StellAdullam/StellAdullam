import { describe, expect, it } from "bun:test";
import { bytesToHex, hexToBytes, isHex, stripHexPrefix } from "./hex";

describe("hex utilities", () => {
  it("converts Uint8Array to hex string", () => {
    const bytes = new Uint8Array([0, 15, 255, 128]);
    expect(bytesToHex(bytes)).toBe("000fff80");
  });

  it("converts hex string to Uint8Array", () => {
    const hex = "000fff80";
    const bytes = hexToBytes(hex);
    expect(Array.from(bytes)).toEqual([0, 15, 255, 128]);
  });

  it("handles optional 0x prefix", () => {
    expect(stripHexPrefix("0xdeadbeef")).toBe("deadbeef");
    expect(stripHexPrefix("0XCAFE")).toBe("CAFE");
    expect(stripHexPrefix("1234")).toBe("1234");

    const bytes = hexToBytes("0xdeadbeef");
    expect(Array.from(bytes)).toEqual([222, 173, 190, 239]);
  });

  it("validates hex strings with isHex", () => {
    expect(isHex("0xdeadbeef")).toBe(true);
    expect(isHex("deadbeef")).toBe(true);
    expect(isHex("12345")).toBe(false); // Odd length
    expect(isHex("xyz123")).toBe(false); // Non-hex char
  });

  it("throws on odd length or invalid bytes", () => {
    expect(() => hexToBytes("abc")).toThrow("even length");
    expect(() => hexToBytes("abzz")).toThrow("Invalid hexadecimal byte");
  });
});
