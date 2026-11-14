import { describe, expect, it } from "bun:test";
import { nativeToScVal } from "@stellar/stellar-sdk";
import {
  SorobanLoanPositionSchema,
  SorobanPropertyStateSchema,
  ValidationError,
  normalizeSorobanPayload,
  parseSorobanLoanPosition,
  parseSorobanPropertyState,
  safeParseSorobanLoanPosition,
  safeParseSorobanPropertyState,
} from "../../src";

const VALID_OWNER = "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN";
const VALID_APPROVED =
  "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFSHONUCEOASW7QC7OX2H";
const VALID_CONTRACT =
  "CCFPZOCU33AWX2NKX47XD6W5JNYFP7MU57DTQFB5XOOQSJLSSC4PMX25";

describe("Soroban Cross-Contract Zod Schemas & Parsers", () => {
  describe("SorobanPropertyStateSchema & parseSorobanPropertyState", () => {
    it("parses valid snake_case and camelCase PropertyState payloads", () => {
      const state = parseSorobanPropertyState({
        id: 42,
        x: 2,
        y: 2,
        owner: VALID_OWNER,
        level: 3,
        last_claimed_ledger: "125000",
        approved: VALID_APPROVED,
      });

      expect(state.id).toBe(42);
      expect(state.x).toBe(2);
      expect(state.y).toBe(2);
      expect(state.owner).toBe(VALID_OWNER);
      expect(state.level).toBe(3);
      expect(state.lastClaimedLedger).toBe(125000n);
      expect(state.approved).toBe(VALID_APPROVED);
    });

    it("decodes raw xdr.ScVal map payloads and defaults approved to null", () => {
      const scVal = nativeToScVal({
        id: 0,
        x: 0,
        y: 0,
        owner: VALID_OWNER,
        level: 0,
        last_claimed_ledger: 500n,
      });

      const state = parseSorobanPropertyState(scVal);
      expect(state.id).toBe(0);
      expect(state.lastClaimedLedger).toBe(500n);
      expect(state.approved).toBeNull();
    });

    it("normalizes Map instances into plain records", () => {
      const map = new Map<string, unknown>([
        ["id", 15],
        ["x", 15],
        ["y", 0],
        ["owner", VALID_OWNER],
        ["level", 1],
        ["lastClaimedLedger", 900],
      ]);

      const state = parseSorobanPropertyState(map);
      expect(state.id).toBe(15);
      expect(state.lastClaimedLedger).toBe(900n);
    });

    it("throws structured ValidationError with field paths on invalid PropertyState", () => {
      expect(() =>
        parseSorobanPropertyState({
          id: 999, // exceeds 399
          x: 25, // exceeds 19
          y: -1, // negative
          owner: "INVALID_ADDR",
          level: 9, // exceeds 3
          last_claimed_ledger: -10,
        }),
      ).toThrow(ValidationError);

      const safeResult = safeParseSorobanPropertyState({
        id: 1,
        x: 25,
        y: 0,
        owner: "BAD_OWNER",
        level: 5,
        lastClaimedLedger: "not-a-number",
      });

      expect(safeResult.success).toBe(false);
      expect(safeResult.error).toBeInstanceOf(ValidationError);
      const fields = safeResult.error?.fieldErrors.map((f) => f.field) ?? [];
      expect(fields).toContain("x");
      expect(fields).toContain("owner");
      expect(fields).toContain("level");
      expect(fields).toContain("lastClaimedLedger");
    });

    it("rejects non-object root payloads with root field path", () => {
      expect(() => normalizeSorobanPayload(null)).toThrow(ValidationError);
      expect(() => normalizeSorobanPayload(["array"])).toThrow(ValidationError);

      const res = safeParseSorobanPropertyState("invalid-primitive");
      expect(res.success).toBe(false);
      expect(res.error?.fieldErrors[0]?.field).toBe("root");
    });
  });

  describe("SorobanLoanPositionSchema & parseSorobanLoanPosition", () => {
    it("parses valid BorrowPosition payloads from defi-rwa with BigInt coercion", () => {
      const position = parseSorobanLoanPosition({
        pool_id: "USDC-POOL",
        borrower: VALID_OWNER,
        principal: "1000000000",
        index_at_borrow: 1_000_000_000_000_000_000n,
        collateral_amount: 2_500_000_000,
        collateral_asset: VALID_CONTRACT,
        borrowed_at: 1710000000,
      });

      expect(position.poolId).toBe("USDC-POOL");
      expect(position.borrower).toBe(VALID_OWNER);
      expect(position.principal).toBe(1_000_000_000n);
      expect(position.indexAtBorrow).toBe(1_000_000_000_000_000_000n);
      expect(position.collateralAmount).toBe(2_500_000_000n);
      expect(position.collateralAsset).toBe(VALID_CONTRACT);
      expect(position.borrowedAt).toBe(1710000000n);
    });

    it("throws structured ValidationError with informative field paths on invalid LoanPosition", () => {
      const result = safeParseSorobanLoanPosition({
        pool_id: "",
        borrower: "BAD_BORROWER",
        principal: 0, // must be strictly > 0
        index_at_borrow: "0",
        collateral_amount: -50,
        collateral_asset: "INVALID_CONTRACT",
        borrowed_at: -1,
      });

      expect(result.success).toBe(false);
      const fields = result.error?.fieldErrors.map((f) => f.field) ?? [];
      expect(fields).toContain("poolId");
      expect(fields).toContain("borrower");
      expect(fields).toContain("principal");
      expect(fields).toContain("indexAtBorrow");
      expect(fields).toContain("collateralAmount");
      expect(fields).toContain("collateralAsset");
    });

    it("supports direct Zod schema safeParse calls", () => {
      const propCheck = SorobanPropertyStateSchema.safeParse({
        id: 1,
        x: 1,
        y: 0,
        owner: VALID_OWNER,
        level: 2,
        lastClaimedLedger: 100n,
        approved: null,
      });
      expect(propCheck.success).toBe(true);

      const loanCheck = SorobanLoanPositionSchema.safeParse({
        poolId: "USDC-POOL",
        borrower: VALID_OWNER,
        principal: 500_000_000n,
        indexAtBorrow: 1_000_000_000_000_000_000n,
        collateralAmount: 1_000_000_000n,
        collateralAsset: VALID_CONTRACT,
        borrowedAt: 1700000000n,
      });
      expect(loanCheck.success).toBe(true);
    });
  });
});
