import { describe, expect, it } from "vitest";
import { parseWithBigInt, stringifyWithBigInt } from "./bigint-json";

describe("BigInt JSON Utilities", () => {
  it("serializes BigInt values into JSON without throwing TypeError", () => {
    const data = {
      stroops: BigInt("100000000000000000000"),
      name: "Soroban Pool",
    };

    const json = stringifyWithBigInt(data);
    expect(json).toBe(
      '{"stroops":"100000000000000000000","name":"Soroban Pool"}',
    );
  });

  it("deserializes large integer strings back into native BigInt", () => {
    const json = '{"balance":"9007199254740992"}'; // MAX_SAFE_INTEGER + 1
    const result: any = parseWithBigInt(json);

    expect(typeof result.balance).toBe("bigint");
    expect(result.balance).toBe(BigInt("9007199254740992"));
  });

  it("leaves standard numbers untouched", () => {
    const json = '{"level":3,"active":true}';
    const result: any = parseWithBigInt(json);

    expect(result.level).toBe(3);
    expect(result.active).toBe(true);
  });
});
