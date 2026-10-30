import { describe, expect, it } from "bun:test";
import { parseBoolean } from "./parse-boolean";

describe("parseBoolean utility", () => {
  it("parses truthy strings and numbers as true", () => {
    expect(parseBoolean("true")).toBe(true);
    expect(parseBoolean("TRUE")).toBe(true);
    expect(parseBoolean("1")).toBe(true);
    expect(parseBoolean("yes")).toBe(true);
    expect(parseBoolean("on")).toBe(true);
    expect(parseBoolean("enabled")).toBe(true);
    expect(parseBoolean(1)).toBe(true);
  });

  it("parses falsy strings and numbers as false", () => {
    expect(parseBoolean("false")).toBe(false);
    expect(parseBoolean("0")).toBe(false);
    expect(parseBoolean("no")).toBe(false);
    expect(parseBoolean("off")).toBe(false);
    expect(parseBoolean("disabled")).toBe(false);
    expect(parseBoolean(0)).toBe(false);
  });

  it("returns fallback for indeterminate values", () => {
    expect(parseBoolean(undefined, true)).toBe(true);
    expect(parseBoolean(null, false)).toBe(false);
    expect(parseBoolean("unknown", true)).toBe(true);
    expect(parseBoolean({}, false)).toBe(false);
  });
});
