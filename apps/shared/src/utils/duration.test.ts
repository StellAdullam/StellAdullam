import { describe, expect, it } from "bun:test";
import { formatDuration, parseDuration } from "./duration";

describe("duration utilities", () => {
  it("formats seconds into human readable duration strings", () => {
    expect(formatDuration(0)).toBe("0s");
    expect(formatDuration(-10)).toBe("0s");
    expect(formatDuration(45)).toBe("45s");
    expect(formatDuration(300)).toBe("5m");
    expect(formatDuration(3665)).toBe("1h 1m 5s");
    expect(formatDuration(90000)).toBe("1d 1h");
  });

  it("parses duration strings into seconds", () => {
    expect(parseDuration("45s")).toBe(45);
    expect(parseDuration("5m")).toBe(300);
    expect(parseDuration("1h 30m")).toBe(5400);
    expect(parseDuration("1d 2h")).toBe(93600);
    expect(parseDuration("")).toBe(0);
  });
});
