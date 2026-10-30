import { describe, expect, it } from "bun:test";
import { truncate, truncateMiddle, truncateWords } from "./truncate";

describe("truncate utilities", () => {
  it("truncates strings to max length with ellipsis", () => {
    expect(truncate("StellAdullam Real Estate", 15)).toBe("StellAdullam...");
    expect(truncate("Short", 10)).toBe("Short");
    expect(truncate("Hello World", 8, "…")).toBe("Hello W…");
  });

  it("truncates middle of string with custom boundaries", () => {
    const hash = "0x1234567890abcdef1234567890abcdef";
    expect(truncateMiddle(hash, 6, 4)).toBe("0x1234...cdef");
    expect(truncateMiddle("short", 4, 4)).toBe("short");
  });

  it("truncates text by word count", () => {
    const sentence = "The quick brown fox jumps over the lazy dog";
    expect(truncateWords(sentence, 4)).toBe("The quick brown fox...");
    expect(truncateWords("Two words", 5)).toBe("Two words");
    expect(truncateWords("", 3)).toBe("");
  });
});
