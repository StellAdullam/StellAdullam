import { describe, expect, it } from "bun:test";
import { timeAgo, timeUntil } from "./time-ago";

describe("time-ago utilities", () => {
  const baseTime = 1700000000000;

  it("formats past times relative to base time", () => {
    expect(timeAgo(baseTime - 2000, baseTime)).toBe("just now");
    expect(timeAgo(baseTime - 45000, baseTime)).toBe("45s ago");
    expect(timeAgo(baseTime - 5 * 60 * 1000, baseTime)).toBe("5m ago");
    expect(timeAgo(baseTime - 3 * 3600 * 1000, baseTime)).toBe("3h ago");
    expect(timeAgo(baseTime - 4 * 86400 * 1000, baseTime)).toBe("4d ago");
    expect(timeAgo(baseTime - 65 * 86400 * 1000, baseTime)).toBe("2mo ago");
    expect(timeAgo(baseTime - 400 * 86400 * 1000, baseTime)).toBe("1y ago");
  });

  it("formats future times with timeUntil", () => {
    expect(timeUntil(baseTime - 1000, baseTime)).toBe("expired");
    expect(timeUntil(baseTime + 30000, baseTime)).toBe("in 30s");
    expect(timeUntil(baseTime + 10 * 60 * 1000, baseTime)).toBe("in 10m");
    expect(timeUntil(baseTime + 5 * 3600 * 1000, baseTime)).toBe("in 5h");
    expect(timeUntil(baseTime + 2 * 86400 * 1000, baseTime)).toBe("in 2d");
  });

  it("accepts Date objects directly", () => {
    const d1 = new Date(baseTime);
    const d2 = new Date(baseTime - 120000);
    expect(timeAgo(d2, d1)).toBe("2m ago");
  });
});
