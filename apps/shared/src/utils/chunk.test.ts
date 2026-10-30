import { describe, expect, it } from "vitest";
import { chunk } from "./chunk";

describe("Array Chunking Utility", () => {
  it("splits array into evenly distributed chunks", () => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const chunks = chunk(list, 3);

    expect(chunks.length).toBe(4);
    expect(chunks[0]).toEqual([1, 2, 3]);
    expect(chunks[1]).toEqual([4, 5, 6]);
    expect(chunks[2]).toEqual([7, 8, 9]);
    expect(chunks[3]).toEqual([10]);
  });

  it("handles empty arrays and single-item chunks gracefully", () => {
    expect(chunk([], 5)).toEqual([]);
    expect(chunk([1, 2], 1)).toEqual([[1], [2]]);
  });
});
