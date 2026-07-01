import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CONNECTOR_CATEGORIES,
  CONNECTOR_STABILITY_STATUSES,
  type ConnectorCategory,
  type ConnectorMetadata,
  type ConnectorStabilityStatus
} from "../index.js";

describe("connector metadata contracts", () => {
  it("defines stable category and stability values", () => {
    expect(CONNECTOR_CATEGORIES).toEqual([
      "source",
      "destination",
      "bidirectional",
      "utility"
    ]);
    expect(CONNECTOR_STABILITY_STATUSES).toEqual([
      "experimental",
      "stable",
      "deprecated"
    ]);
  });

  it("describes a provider-neutral connector", () => {
    const metadata: ConnectorMetadata = {
      id: "generic-source",
      name: "Generic Source",
      version: "1.0.0",
      description: "Provider-neutral metadata fixture.",
      provider: "generic-provider",
      category: "source",
      tags: ["generic"],
      stability: "experimental"
    };

    expect(metadata.id).toBe("generic-source");
    expect(metadata.tags).toEqual(["generic"]);
  });

  it("exports literal unions from stable constants", () => {
    expectTypeOf<ConnectorCategory>().toEqualTypeOf<
      (typeof CONNECTOR_CATEGORIES)[number]
    >();
    expectTypeOf<ConnectorStabilityStatus>().toEqualTypeOf<
      (typeof CONNECTOR_STABILITY_STATUSES)[number]
    >();
  });
});
