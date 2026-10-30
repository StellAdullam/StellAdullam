import { describe, expect, it } from "bun:test";
import { groupBy } from "./group-by";

describe("groupBy utility", () => {
  it("groups items by string property", () => {
    const properties = [
      { id: 1, district: "residential" },
      { id: 2, district: "commercial" },
      { id: 3, district: "residential" },
    ];

    const grouped = groupBy(properties, (p) => p.district);

    expect(Object.keys(grouped)).toEqual(["residential", "commercial"]);
    expect(grouped.residential.length).toBe(2);
    expect(grouped.commercial.length).toBe(1);
  });

  it("groups numbers by parity", () => {
    const numbers = [1, 2, 3, 4, 5];
    const grouped = groupBy(numbers, (n) => (n % 2 === 0 ? "even" : "odd"));

    expect(grouped.even).toEqual([2, 4]);
    expect(grouped.odd).toEqual([1, 3, 5]);
  });

  it("handles empty arrays cleanly", () => {
    expect(groupBy([], () => "key")).toEqual({} as any);
  });
});
