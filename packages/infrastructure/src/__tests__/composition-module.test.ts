import { describe, expect, it } from "vitest";
import type { InfrastructureCompositionModule } from "../index.js";

describe("infrastructure composition module contracts", () => {
  it("binds infrastructure modules to container composition input", () => {
    const compositionModule: InfrastructureCompositionModule = {
      id: "foundation",
      input: {
        infrastructureModules: [
          {
            id: "configuration",
            kind: "configuration"
          }
        ],
        containerModules: [
          {
            id: "configuration",
            registrations: []
          }
        ]
      },
      containerCompositionInput: {
        modules: [
          {
            id: "configuration",
            registrations: []
          }
        ]
      }
    };

    expect(compositionModule.input.infrastructureModules).toHaveLength(1);
    expect(compositionModule.containerCompositionInput.modules).toHaveLength(1);
  });
});
