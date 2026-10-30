import { describe, expect, it } from "vitest";
import {
  PropertyContractEventTopic,
  LendingContractEventTopic,
  GameContractEventTopic,
  buildContractEventFilter,
} from "./event-topics";

describe("Event Topics and Filters", () => {
  it("exposes typed contract event constants", () => {
    expect(PropertyContractEventTopic.MINT).toBe("mint");
    expect(LendingContractEventTopic.LIQUIDATE).toBe("liquidate");
    expect(GameContractEventTopic.IMPROVEMENT_UPGRADED).toBe(
      "improvement_upgraded",
    );
  });

  it("builds valid Soroban event filter criteria", () => {
    const filter = buildContractEventFilter("CABC123", ["mint", "transfer"]);
    expect(filter.type).toBe("contract");
    expect(filter.contractIds).toEqual(["CABC123"]);
    expect(filter.topics).toEqual([["mint", "transfer"]]);
  });
});
