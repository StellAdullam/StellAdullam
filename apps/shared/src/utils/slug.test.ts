import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("Slugify String Sanitizer", () => {
  it("converts property titles into URL-safe slugs", () => {
    expect(slugify("Metropolis Commercial Tower #42")).toBe(
      "metropolis-commercial-tower-42",
    );
    expect(slugify("StellAdullam Waterfront Plaza & Marina")).toBe(
      "stelladullam-waterfront-plaza-marina",
    );
  });

  it("normalizes accents and strips non-alphanumeric punctuation", () => {
    expect(slugify("Château Étoile Résidence")).toBe(
      "chateau-etoile-residence",
    );
    expect(slugify("   ---Leading and Trailing---   ")).toBe(
      "leading-and-trailing",
    );
  });

  it("handles empty or malformed inputs gracefully", () => {
    expect(slugify("")).toBe("");
    expect(slugify(null as any)).toBe("");
  });
});
