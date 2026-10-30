import { describe, expect, it } from "bun:test";
import { partition } from "./partition";

describe("partition utilities", () => {
  it("splits numbers into even and odd arrays", () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const [evens, odds] = partition(numbers, (n) => n % 2 === 0);

    expect(evens).toEqual([2, 4, 6]);
    expect(odds).toEqual([1, 3, 5]);
  });

  it("partitions properties by verification status", () => {
    const properties = [
      { id: 1, verified: true },
      { id: 2, verified: false },
      { id: 3, verified: true },
    ];

    const [verified, unverified] = partition(properties, (p) => p.verified);
    expect(verified.map((p) => p.id)).toEqual([1, 3]);
    expect(unverified.map((p) => p.id)).toEqual([2]);
  });

  it("handles empty input arrays", () => {
    const [a, b] = partition([], () => true);
    expect(a).toEqual([]);
    expect(b).toEqual([]);
  });
});
