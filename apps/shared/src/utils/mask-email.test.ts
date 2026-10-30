import { describe, expect, it } from "bun:test";
import { maskEmail } from "./mask-email";

describe("maskEmail utility", () => {
  it("masks standard email usernames", () => {
    expect(maskEmail("investor@stelladullam.io")).toBe(
      "i******r@stelladullam.io",
    );
    expect(maskEmail("alice@example.com")).toBe("a***e@example.com");
  });

  it("handles short usernames correctly", () => {
    expect(maskEmail("ab@domain.com")).toBe("a*@domain.com");
    expect(maskEmail("a@domain.com")).toBe("a*@domain.com");
  });

  it("leaves invalid or non-email strings unchanged", () => {
    expect(maskEmail("invalid-string")).toBe("invalid-string");
    expect(maskEmail("@domain.com")).toBe("@domain.com");
  });
});
