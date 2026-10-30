import { describe, expect, it } from "bun:test";
import { toCamelCase, toKebabCase, toPascalCase, toSnakeCase } from "./case";

describe("case utilities", () => {
  const input = "StellAdullam Real_estate-token";

  it("converts to camelCase", () => {
    expect(toCamelCase(input)).toBe("stellAdullamRealEstateToken");
    expect(toCamelCase("alreadyCamel")).toBe("alreadyCamel");
  });

  it("converts to snake_case", () => {
    expect(toSnakeCase(input)).toBe("stell_adullam_real_estate_token");
    expect(toSnakeCase("totalValuationXlm")).toBe("total_valuation_xlm");
  });

  it("converts to kebab-case", () => {
    expect(toKebabCase(input)).toBe("stell-adullam-real-estate-token");
    expect(toKebabCase("propertyDetailsCard")).toBe("property-details-card");
  });

  it("converts to PascalCase", () => {
    expect(toPascalCase(input)).toBe("StellAdullamRealEstateToken");
    expect(toPascalCase("token_contract_client")).toBe("TokenContractClient");
  });

  it("handles empty strings cleanly", () => {
    expect(toCamelCase("")).toBe("");
    expect(toSnakeCase("")).toBe("");
    expect(toKebabCase("")).toBe("");
    expect(toPascalCase("")).toBe("");
  });
});
