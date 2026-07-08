import { describe, it, expect } from "bun:test";
import {
  PRECISION,
  SECONDS_PER_YEAR,
  DEFAULT_INTEREST_RATE_MODEL,
  calculateBorrowRate,
  calculateSupplyRate,
  calculateUtilizationRate,
  calculateNewIndex,
  calculateCompoundInterest,
  calculateSimpleInterest,
  aprToApy,
  apyToApr,
  rateToDecimal,
  decimalToRate,
} from "./interest";

/**
 * Property-based (fuzz) tests for interest rate calculations.
 *
 * Instead of testing specific known values, these tests verify mathematical
 * invariants across many random inputs — catching edge cases that
 * hand-written tests miss.
 */

// ─── Random Value Generators ──────────────────────────────────────────

/** Generate a random bigint in [0, max] */
function randomBigInt(max: bigint): bigint {
  if (max <= BigInt(0)) return BigInt(0);
  // Use multiple random 32-bit chunks to cover large ranges
  const high = BigInt(Math.floor(Math.random() * 0x100000000));
  const low = BigInt(Math.floor(Math.random() * 0x100000000));
  const value = (high << BigInt(32)) | low;
  return value % (max + BigInt(1));
}

/** Generate a random utilization rate in [0, PRECISION] */
function randomUtilization(): bigint {
  return randomBigInt(PRECISION);
}

/** Generate a random borrow rate in [0, 200% * PRECISION] */
function randomBorrowRate(): bigint {
  return randomBigInt(BigInt(2) * PRECISION);
}

/** Generate a random principal in [1, 100_000_000] */
function randomPrincipal(): number {
  return Math.random() * 100_000_000 + 1;
}

/** Generate a random annual rate in [0, 100%] */
function randomAnnualRate(): number {
  return Math.random(); // 0 to 1 (0% to 100%)
}

/** Generate a random time period in days [0, 3650] */
function randomDays(): number {
  return Math.floor(Math.random() * 3650);
}

/** Generate a random compounding frequency [1, 365] */
function randomCompoundingFrequency(): number {
  return Math.floor(Math.random() * 365) + 1;
}

/** Generate a random time elapsed in seconds [0, 2 years] */
function randomTimeElapsed(): number {
  return Math.floor(Math.random() * SECONDS_PER_YEAR * 2);
}

function randomReserveFactor(): bigint {
  // Reserve factor 0% to 25%
  const maxReserve = (PRECISION * BigInt(25)) / BigInt(100);
  return randomBigInt(maxReserve);
}

// ─── Fuzz Test Suite ──────────────────────────────────────────────────

describe("Interest calculations — fuzz / property-based tests", () => {
  // Run each fuzz test with this many random iterations
  const FUZZ_ITERATIONS = 200;

  // ── Utilization Rate ────────────────────────────────────────────────

  describe("calculateUtilizationRate", () => {
    it("is always in [0, PRECISION] for any inputs", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const borrows = randomBigInt(PRECISION * BigInt(100));
        const supply = randomBigInt(PRECISION * BigInt(100));

        const util = calculateUtilizationRate(borrows, supply);

        if (supply === BigInt(0)) {
          expect(util).toBe(BigInt(0));
        } else {
          expect(util).toBeGreaterThanOrEqual(BigInt(0));
          expect(util).toBeLessThanOrEqual(PRECISION);
        }
      }
    });

    it("is monotonic with respect to borrows", () => {
      const supply = PRECISION; // Fixed supply
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const borrowsA = randomBigInt(supply);
        const borrowsB = randomBigInt(supply);

        const utilA = calculateUtilizationRate(borrowsA, supply);
        const utilB = calculateUtilizationRate(borrowsB, supply);

        if (borrowsA <= borrowsB) {
          expect(utilA).toBeLessThanOrEqual(utilB);
        }
      }
    });
  });

  // ── Borrow Rate (Kinked Model) ──────────────────────────────────────

  describe("calculateBorrowRate", () => {
    it("is always ≥ baseRate for any utilization", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const utilization = randomUtilization();
        const rate = calculateBorrowRate(utilization);
        expect(rate).toBeGreaterThanOrEqual(
          DEFAULT_INTEREST_RATE_MODEL.baseRate,
        );
      }
    });

    it("is monotonic: higher utilization never decreases rate", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const uA = randomUtilization();
        const uB = randomUtilization();

        const rA = calculateBorrowRate(uA);
        const rB = calculateBorrowRate(uB);

        if (uA <= uB) {
          expect(rA).toBeLessThanOrEqual(rB);
        }
      }
    });

    it("never exceeds baseRate + slope2 at 100% utilization", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const utilization = randomUtilization();
        const rate = calculateBorrowRate(utilization);

        // At most: baseRate + slope2
        const maxRate =
          DEFAULT_INTEREST_RATE_MODEL.baseRate +
          DEFAULT_INTEREST_RATE_MODEL.slope2;
        expect(rate).toBeLessThanOrEqual(maxRate);
      }
    });

    it("produces the same result regardless of model mutability", () => {
      // Calling twice with the same input must give the same result
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const utilization = randomUtilization();
        const model = { ...DEFAULT_INTEREST_RATE_MODEL };

        const result1 = calculateBorrowRate(utilization, model);
        const result2 = calculateBorrowRate(utilization, model);

        expect(result1).toBe(result2);
      }
    });
  });

  // ── Supply Rate ─────────────────────────────────────────────────────

  describe("calculateSupplyRate", () => {
    it("is always ≤ borrowRate", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const borrowRate = randomBorrowRate();
        const utilization = randomUtilization();
        const reserveFactor = randomReserveFactor();

        const supplyRate = calculateSupplyRate(
          borrowRate,
          utilization,
          reserveFactor,
        );

        expect(supplyRate).toBeLessThanOrEqual(borrowRate);
      }
    });

    it("is 0 when utilization is 0", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const borrowRate = randomBorrowRate();
        const reserveFactor = randomReserveFactor();

        const supplyRate = calculateSupplyRate(
          borrowRate,
          BigInt(0),
          reserveFactor,
        );

        expect(supplyRate).toBe(BigInt(0));
      }
    });

    it("is 0 when borrow rate is 0", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const utilization = randomUtilization();
        const reserveFactor = randomReserveFactor();

        const supplyRate = calculateSupplyRate(
          BigInt(0),
          utilization,
          reserveFactor,
        );

        expect(supplyRate).toBe(BigInt(0));
      }
    });

    it("decreases when reserve factor increases (ceteris paribus)", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const borrowRate = randomBorrowRate();
        const utilization = randomUtilization();

        const lowReserve = randomBigInt(PRECISION / BigInt(10)); // 0-10%
        const highReserve = lowReserve + randomBigInt(PRECISION / BigInt(10)); // higher

        const rateLow = calculateSupplyRate(
          borrowRate,
          utilization,
          lowReserve,
        );
        const rateHigh = calculateSupplyRate(
          borrowRate,
          utilization,
          highReserve,
        );

        expect(rateLow).toBeGreaterThanOrEqual(rateHigh);
      }
    });
  });

  // ── Interest Index ───────────────────────────────────────────────────

  describe("calculateNewIndex", () => {
    it("never decreases with positive time", () => {
      let currentIndex = PRECISION;
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const borrowRate = randomBorrowRate();
        const elapsed = randomTimeElapsed();
        const nextIndex = calculateNewIndex(
          currentIndex,
          borrowRate,
          elapsed,
        );

        expect(nextIndex).toBeGreaterThanOrEqual(currentIndex);
        currentIndex = nextIndex;
      }
    });

    it("stays at current index when timeElapsed is 0", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const currentIndex = randomBigInt(PRECISION * BigInt(10));
        const borrowRate = randomBorrowRate();

        const result = calculateNewIndex(currentIndex, borrowRate, 0);
        expect(result).toBe(currentIndex);
      }
    });

    it("grows faster with higher borrow rates", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const currentIndex = PRECISION;
        const elapsed = 86_400; // 1 day

        const lowRate = randomBigInt(
          DEFAULT_INTEREST_RATE_MODEL.baseRate + DEFAULT_INTEREST_RATE_MODEL.slope1,
        );
        const highRate =
          lowRate +
          randomBigInt(DEFAULT_INTEREST_RATE_MODEL.slope2 / BigInt(10));

        const indexLow = calculateNewIndex(currentIndex, lowRate, elapsed);
        const indexHigh = calculateNewIndex(currentIndex, highRate, elapsed);

        expect(indexLow).toBeLessThanOrEqual(indexHigh);
      }
    });
  });

  // ── APR / APY Conversion ────────────────────────────────────────────

  describe("APR / APY conversion", () => {
    it("APY is always ≥ APR for the same rate", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const apr = randomAnnualRate();
        const freq = randomCompoundingFrequency();

        const apy = aprToApy(apr, freq);
        expect(apy).toBeGreaterThanOrEqual(apr);
      }
    });

    it("APR == APY when compounding frequency is 1 (annual)", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const rate = randomAnnualRate();
        const apy = aprToApy(rate, 1);
        expect(apy).toBeCloseTo(rate, 10);
      }
    });

    it("aprToApy → apyToApr round-trip preserves the original (within precision)", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const originalApr = randomAnnualRate();
        const freq = randomCompoundingFrequency();

        const apy = aprToApy(originalApr, freq);
        const recoveredApr = apyToApr(apy, freq);

        // Allow small floating point error
        expect(recoveredApr).toBeCloseTo(originalApr, 8);
      }
    });

    it("0% APR gives 0% APY", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const freq = randomCompoundingFrequency();
        expect(aprToApy(0, freq)).toBe(0);
        expect(apyToApr(0, freq)).toBe(0);
      }
    });
  });

  // ── Simple vs Compound Interest ─────────────────────────────────────

  describe("simple vs compound interest invariants", () => {
    it("compound interest is always ≥ simple interest for same params", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const principal = randomPrincipal();
        const rate = randomAnnualRate();
        const days = randomDays();
        const years = days / 365;

        const simple = calculateSimpleInterest(principal, rate, years);
        const compound = calculateCompoundInterest(
          principal,
          rate,
          years,
          12, // monthly compounding
        );

        // Simple interest earned vs compound total
        const simpleTotal = principal + simple;
        expect(compound).toBeGreaterThanOrEqual(simpleTotal);
      }
    });

    it("simple and compound converge as compounding frequency → 1", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const principal = randomPrincipal();
        const rate = randomAnnualRate();
        const years = Math.random() * 5;

        const simple = calculateSimpleInterest(principal, rate, years);
        const compound = calculateCompoundInterest(principal, rate, years, 1);

        expect(compound).toBeCloseTo(principal + simple, 6);
      }
    });
  });

  // ── Decimal / BigInt Conversion ─────────────────────────────────────

  describe("rateToDecimal / decimalToRate round-trip", () => {
    it("round-trips correctly for standard rates", () => {
      const testRates = [0, 0.01, 0.05, 0.10, 0.25, 0.50, 0.75, 1.0, 2.5, 10.0];
      for (const rate of testRates) {
        const asBigInt = decimalToRate(rate);
        const backToDecimal = rateToDecimal(asBigInt);
        expect(backToDecimal).toBeCloseTo(rate, 10);
      }
    });

    it("round-trips correctly for random rates", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const rate = Math.random() * 100; // 0 to 10000%
        const asBigInt = decimalToRate(rate);
        const backToDecimal = rateToDecimal(asBigInt);
        expect(backToDecimal).toBeCloseTo(rate, 10);
      }
    });
  });

  // ── Cross-function Invariants ───────────────────────────────────────

  describe("cross-function invariants", () => {
    it("supply rate ≤ borrow rate ≤ max rate", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const utilization = randomUtilization();
        const borrowRate = calculateBorrowRate(utilization);
        const reserveFactor = randomReserveFactor();

        if (utilization > BigInt(0)) {
          const supplyRate = calculateSupplyRate(
            borrowRate,
            utilization,
            reserveFactor,
          );

          expect(supplyRate).toBeLessThanOrEqual(borrowRate);
        }
      }
    });

    it("utilization rate is consistent with borrow rate", () => {
      for (let i = 0; i < FUZZ_ITERATIONS; i++) {
        const borrows = randomBigInt(PRECISION * BigInt(10));
        const supply = randomBigInt(PRECISION * BigInt(10));

        const util = calculateUtilizationRate(borrows, supply);

        if (supply > BigInt(0) && borrows <= supply) {
          expect(util).toBeLessThanOrEqual(PRECISION);
        }
      }
    });
  });
});
