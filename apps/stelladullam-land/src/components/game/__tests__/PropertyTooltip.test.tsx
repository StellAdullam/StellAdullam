// @ts-expect-error: jsdom types not fully compatible with bun runtime
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});
globalThis.window = dom.window as any;
globalThis.document = dom.window.document as any;
globalThis.navigator = dom.window.navigator as any;
globalThis.HTMLElement = dom.window.HTMLElement as any;
globalThis.MutationObserver = dom.window.MutationObserver as any;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

import { describe, expect, it } from "bun:test";
import React from "react";
import { render } from "@testing-library/react";
import { PropertyTooltip } from "../PropertyTooltip";
import { GameProperty } from "../../../types/game.types";

const mockProperty: GameProperty = {
  id: "prop-2-5",
  name: "Skyline Heights Sector",
  description: "Test description",
  propertyType: "residential",
  location: {
    address: "District 2",
    city: "Neo Tokyo",
    country: "Japan",
    coordinates: { latitude: 35.6, longitude: 139.6 },
  },
  totalValue: "1000000",
  tokenAddress: "GCTESTXXXXX",
  totalShares: 1000,
  availableShares: 0,
  pricePerShare: "250",
  images: [],
  documents: [],
  verified: true,
  listedAt: "2026-05-27T00:00:00Z",
  owner: "GABC1234EFGH5678IJKL9012MNOP3456QRST7890UVWX1234YZ56",
  buildingLevel: 2,
  improveCost: 600,
  earnedIncome: 45,
  isListed: true,
};

describe("PropertyTooltip component", () => {
  it("renders nothing when visible is false or property is null", () => {
    const { container: c1 } = render(
      <PropertyTooltip
        property={mockProperty}
        position={{ x: 100, y: 100 }}
        visible={false}
      />,
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <PropertyTooltip
        property={null}
        position={{ x: 100, y: 100 }}
        visible={true}
      />,
    );
    expect(c2.firstChild).toBeNull();
  });

  it("renders property title, building tier, and listing price when visible", () => {
    const { getByText } = render(
      <PropertyTooltip
        property={mockProperty}
        position={{ x: 100, y: 100 }}
        visible={true}
      />,
    );

    expect(getByText("Skyline Heights Sector")).toBeDefined();
    expect(getByText("Commercial")).toBeDefined();
    expect(getByText("250 LAND")).toBeDefined();
  });
});
