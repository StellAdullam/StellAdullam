import { scValToNative, xdr } from "@stellar/stellar-sdk";
import { z, type ZodIssue } from "zod";
import { ValidationError, type FieldError } from "../errors/types";
import { stellarAddressSchema } from "./common.schema";

/**
 * Schema for Stellar public account (`G...`) or Soroban contract (`C...`) addresses.
 */
export const sorobanAddressSchema = z
  .string()
  .length(56, "Soroban address must be 56 characters")
  .regex(
    /^[GC][A-Z2-7]{55}$/,
    "Invalid Stellar or Soroban contract address format",
  );

/**
 * Coerces a `bigint`, non-negative integer `number`, or decimal digit `string`
 * into a non-negative `bigint`.
 */
export const nonNegativeBigIntSchema = z
  .union([
    z.bigint(),
    z.number().int("Must be an integer"),
    z.string().regex(/^\d+$/, "Must be a non-negative integer string"),
  ])
  .transform((val: bigint | number | string): bigint => BigInt(val))
  .refine((val: bigint): boolean => val >= 0n, {
    message: "Value must be non-negative",
  });

/**
 * Coerces a `bigint`, positive integer `number`, or decimal digit `string`
 * into a strictly positive `bigint`.
 */
export const positiveBigIntSchema = z
  .union([
    z.bigint(),
    z.number().int("Must be an integer"),
    z.string().regex(/^\d+$/, "Must be a positive integer string"),
  ])
  .transform((val: bigint | number | string): bigint => BigInt(val))
  .refine((val: bigint): boolean => val > 0n, {
    message: "Value must be strictly greater than zero",
  });

/**
 * Strongly-typed domain model for a `game-engine` / `game-property-nft` parcel state.
 */
export interface SorobanPropertyState {
  id: number;
  x: number;
  y: number;
  owner: string;
  level: number;
  lastClaimedLedger: bigint;
  approved: string | null;
}

/**
 * Strongly-typed domain model for a `defi-rwa` on-chain loan/borrow position.
 */
export interface SorobanLoanPosition {
  poolId: string;
  borrower: string;
  principal: bigint;
  indexAtBorrow: bigint;
  collateralAmount: bigint;
  collateralAsset: string;
  borrowedAt: bigint;
}

const rawPropertyStateObjectSchema = z.object({
  id: z.number().int().min(0).max(399),
  x: z.number().int().min(0).max(19),
  y: z.number().int().min(0).max(19),
  owner: stellarAddressSchema,
  level: z.number().int().min(0).max(3),
  lastClaimedLedger: nonNegativeBigIntSchema,
  approved: stellarAddressSchema.nullable().default(null),
});

const rawLoanPositionObjectSchema = z.object({
  poolId: z.string().min(1, "Pool ID is required"),
  borrower: stellarAddressSchema,
  principal: positiveBigIntSchema,
  indexAtBorrow: positiveBigIntSchema,
  collateralAmount: positiveBigIntSchema,
  collateralAsset: sorobanAddressSchema,
  borrowedAt: nonNegativeBigIntSchema,
});

/**
 * Converts a raw Soroban `xdr.ScVal`, `Map`, or plain object with snake_case / camelCase
 * keys into a normalized camelCase record prior to schema validation.
 */
export function normalizeSorobanPayload(
  input: unknown,
): Record<string, unknown> {
  let decoded: unknown = input;

  if (input instanceof xdr.ScVal) {
    decoded = scValToNative(input) as unknown;
  }

  if (decoded instanceof Map) {
    const mapEntries: Record<string, unknown> = {};
    decoded.forEach((value: unknown, key: unknown): void => {
      mapEntries[String(key)] = value;
    });
    decoded = mapEntries;
  }

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    Array.isArray(decoded)
  ) {
    throw new ValidationError(
      "Invalid Soroban SCVal payload: expected struct/map",
      [
        {
          field: "root",
          message: "Expected a Soroban struct or map object",
          value: input,
        },
      ],
    );
  }

  const record = decoded as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...record };

  if (
    normalized["lastClaimedLedger"] === undefined &&
    normalized["last_claimed_ledger"] !== undefined
  ) {
    normalized["lastClaimedLedger"] = normalized["last_claimed_ledger"];
  }

  if (
    normalized["poolId"] === undefined &&
    normalized["pool_id"] !== undefined
  ) {
    normalized["poolId"] = normalized["pool_id"];
  }

  if (
    normalized["indexAtBorrow"] === undefined &&
    normalized["index_at_borrow"] !== undefined
  ) {
    normalized["indexAtBorrow"] = normalized["index_at_borrow"];
  }

  if (
    normalized["collateralAmount"] === undefined &&
    normalized["collateral_amount"] !== undefined
  ) {
    normalized["collateralAmount"] = normalized["collateral_amount"];
  }

  if (
    normalized["collateralAsset"] === undefined &&
    normalized["collateral_asset"] !== undefined
  ) {
    normalized["collateralAsset"] = normalized["collateral_asset"];
  }

  if (
    normalized["borrowedAt"] === undefined &&
    normalized["borrowed_at"] !== undefined
  ) {
    normalized["borrowedAt"] = normalized["borrowed_at"];
  }

  if (normalized["approved"] === undefined) {
    normalized["approved"] = null;
  }

  return normalized;
}

/**
 * Strict runtime Zod schema for `PropertyState` payloads returned by `game-engine`
 * and `game-property-nft`.
 */
export const SorobanPropertyStateSchema = rawPropertyStateObjectSchema;

/**
 * Strict runtime Zod schema for `BorrowPosition` payloads returned by `defi-rwa`.
 */
export const SorobanLoanPositionSchema = rawLoanPositionObjectSchema;

function formatZodIssuesToFieldErrors(issues: ZodIssue[]): FieldError[] {
  return issues.map(
    (issue: ZodIssue): FieldError => ({
      field: issue.path.length > 0 ? issue.path.join(".") : "root",
      message: issue.message,
    }),
  );
}

/**
 * Safely decodes and validates a Soroban `PropertyState` payload (raw `xdr.ScVal`,
 * `Map`, or plain object), throwing a structured `ValidationError` with field paths
 * on invalid inputs.
 */
export function parseSorobanPropertyState(
  input: unknown,
): SorobanPropertyState {
  const normalized = normalizeSorobanPayload(input);
  const result = SorobanPropertyStateSchema.safeParse(normalized);
  if (!result.success) {
    const fieldErrors = formatZodIssuesToFieldErrors(result.error.issues);
    throw ValidationError.fromFields(fieldErrors);
  }
  return result.data;
}

/**
 * Non-throwing variant of `parseSorobanPropertyState` returning a discriminated result.
 */
export function safeParseSorobanPropertyState(input: unknown): {
  success: boolean;
  data?: SorobanPropertyState;
  error?: ValidationError;
} {
  try {
    const data = parseSorobanPropertyState(input);
    return { success: true, data };
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return { success: false, error: err };
    }
    const fallbackError = new ValidationError(
      err instanceof Error
        ? err.message
        : "Failed to parse SorobanPropertyState",
      [{ field: "root", message: "Invalid SorobanPropertyState payload" }],
    );
    return { success: false, error: fallbackError };
  }
}

/**
 * Safely decodes and validates a Soroban `BorrowPosition` / loan position payload
 * (raw `xdr.ScVal`, `Map`, or plain object), throwing a structured `ValidationError`
 * with field paths on invalid inputs.
 */
export function parseSorobanLoanPosition(input: unknown): SorobanLoanPosition {
  const normalized = normalizeSorobanPayload(input);
  const result = SorobanLoanPositionSchema.safeParse(normalized);
  if (!result.success) {
    const fieldErrors = formatZodIssuesToFieldErrors(result.error.issues);
    throw ValidationError.fromFields(fieldErrors);
  }
  return result.data;
}

/**
 * Non-throwing variant of `parseSorobanLoanPosition` returning a discriminated result.
 */
export function safeParseSorobanLoanPosition(input: unknown): {
  success: boolean;
  data?: SorobanLoanPosition;
  error?: ValidationError;
} {
  try {
    const data = parseSorobanLoanPosition(input);
    return { success: true, data };
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return { success: false, error: err };
    }
    const fallbackError = new ValidationError(
      err instanceof Error
        ? err.message
        : "Failed to parse SorobanLoanPosition",
      [{ field: "root", message: "Invalid SorobanLoanPosition payload" }],
    );
    return { success: false, error: fallbackError };
  }
}
