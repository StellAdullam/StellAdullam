import { describe, expect, it } from "vitest";
import { generateNonce, secureRandomString } from "./random";

describe("Secure Random Generation Utilities", () => {
  it("generates strings of exact requested length", () => {
    const str16 = secureRandomString(16);
    expect(str16.length).toBe(16);

    const str64 = secureRandomString(64);
    expect(str64.length).toBe(64);
  });

  it("produces unique random values on successive invocations", () => {
    const a = secureRandomString(32);
    const b = secureRandomString(32);
    expect(a).not.toBe(b);
  });

  it("generates nonces with configured prefix", () => {
    const nonce = generateNonce("soroban_");
    expect(nonce.startsWith("soroban_")).toBe(true);
    expect(nonce.length).toBe(32); // 8 prefix + 24 random
  });
});
