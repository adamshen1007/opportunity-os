import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CONNECTOR_CAPABILITY_KINDS,
  type ConnectorCapability,
  type ConnectorCapabilityKind,
  type ConnectorCapabilitySet
} from "../index.js";

describe("connector capability contracts", () => {
  it("defines stable generic capability kinds", () => {
    expect(CONNECTOR_CAPABILITY_KINDS).toEqual([
      "read",
      "sync",
      "validate",
      "health",
      "discover"
    ]);
  });

  it("describes declarative capability metadata", () => {
    const capability: ConnectorCapability = {
      kind: "read",
      enabled: true,
      description: "Reads provider-neutral data.",
      metadata: {
        batch: true
      }
    };
    const set: ConnectorCapabilitySet = {
      capabilities: [capability]
    };

    expect(set.capabilities).toEqual([capability]);
  });

  it("exports capability kind as a literal union", () => {
    expectTypeOf<ConnectorCapabilityKind>().toEqualTypeOf<
      (typeof CONNECTOR_CAPABILITY_KINDS)[number]
    >();
  });
});
