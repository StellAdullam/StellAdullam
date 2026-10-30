import { describe, expect, it } from "vitest";
import { safeJsonParse, safeJsonStringify } from "./safe-json";

describe("Safe JSON Utilities", () => {
  it("parses valid JSON string into typed object", () => {
    const json = '{"title":"Metropolis Tower","level":3}';
    const result = safeJsonParse(json, { title: "", level: 0 });

    expect(result.title).toBe("Metropolis Tower");
    expect(result.level).toBe(3);
  });

  it("returns fallback gracefully on malformed JSON without throwing", () => {
    const malformed = '{"title": "Broken Json...';
    const fallback = { fallback: true };

    const result = safeJsonParse(malformed, fallback);
    expect(result).toBe(fallback);
  });

  it("applies validator predicate when supplied", () => {
    const json = '{"count": -5}';
    const isPositiveCount = (val: any): val is { count: number } =>
      typeof val?.count === "number" && val.count > 0;

    const result = safeJsonParse(json, { count: 1 }, isPositiveCount);
    expect(result.count).toBe(1); // Rejected by validator -> fallback returned
  });

  it("safely stringifies objects and handles circular structures gracefully", () => {
    const circular: any = { a: 1 };
    circular.self = circular;

    const result = safeJsonStringify(circular, '{"error":"circular"}');
    expect(result).toBe('{"error":"circular"}');
  });
});
