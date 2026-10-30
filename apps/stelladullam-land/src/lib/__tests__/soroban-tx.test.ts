import { describe, expect, it } from "bun:test";
import {
  propertyIdToU32,
  NETWORK_PASSPHRASE,
  PROPERTY_NFT_CONTRACT_ID,
  GAME_ENGINE_CONTRACT_ID,
  LAND_TOKEN_CONTRACT_ID,
} from "../soroban-tx";

describe("soroban-tx helpers", () => {
  it("converts prop-row-col id string to u32 index correctly", () => {
    // row * 20 + col
    expect(propertyIdToU32("prop-0-0")).toBe(0);
    expect(propertyIdToU32("prop-0-5")).toBe(5);
    expect(propertyIdToU32("prop-1-0")).toBe(20);
    expect(propertyIdToU32("prop-3-7")).toBe(67);
    expect(propertyIdToU32("prop-19-19")).toBe(399);
  });

  it("handles numeric strings directly", () => {
    expect(propertyIdToU32("0")).toBe(0);
    expect(propertyIdToU32("42")).toBe(42);
    expect(propertyIdToU32("399")).toBe(399);
  });

  it("throws for invalid property id format", () => {
    expect(() => propertyIdToU32("invalid-id")).toThrow();
    expect(() => propertyIdToU32("prop-invalid-col")).toThrow();
  });

  it("exports valid network passphrase and contract constants", () => {
    expect(NETWORK_PASSPHRASE).toContain("Test");
    expect(PROPERTY_NFT_CONTRACT_ID.startsWith("C")).toBe(true);
    expect(GAME_ENGINE_CONTRACT_ID.startsWith("C")).toBe(true);
    expect(LAND_TOKEN_CONTRACT_ID.startsWith("C")).toBe(true);
  });
});
