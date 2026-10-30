import { describe, expect, it } from "vitest";
import { mapConcurrent } from "./promise-limiter";

describe("mapConcurrent Concurrency Limiter", () => {
  it("processes all tasks and preserves result index order", async () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = await mapConcurrent(
      input,
      async (n) => {
        return n * 2;
      },
      { concurrency: 3 },
    );

    expect(results).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
  });

  it("bounds active concurrent executions to limit", async () => {
    let active = 0;
    let maxObservedActive = 0;

    const input = Array.from({ length: 15 }, (_, i) => i);
    await mapConcurrent(
      input,
      async () => {
        active++;
        if (active > maxObservedActive) {
          maxObservedActive = active;
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
        active--;
      },
      { concurrency: 4 },
    );

    expect(maxObservedActive).toBeLessThanOrEqual(4);
  });
});
