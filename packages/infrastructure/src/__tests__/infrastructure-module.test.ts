import { describe, expect, expectTypeOf, it } from "vitest";
import {
  INFRASTRUCTURE_MODULE_KINDS,
  type InfrastructureModule,
  type InfrastructureModuleDependency,
  type InfrastructureModuleKind
} from "../index.js";

describe("infrastructure module contracts", () => {
  it("defines stable infrastructure module kinds", () => {
    expect(INFRASTRUCTURE_MODULE_KINDS).toEqual([
      "configuration",
      "logging",
      "events",
      "database",
      "domain",
      "application",
      "container",
      "infrastructure"
    ]);
  });

  it("supports generic module dependencies without resolving them", () => {
    const dependency: InfrastructureModuleDependency = {
      id: "logging",
      optional: true
    };

    const module: InfrastructureModule = {
      id: "database",
      kind: "database",
      dependencies: [dependency],
      registrations: [],
      tags: ["foundation"]
    };

    expect(module.dependencies).toEqual([dependency]);
    expect(module.registrations).toEqual([]);
  });

  it("exposes module kind as the literal union from the stable constants", () => {
    expectTypeOf<InfrastructureModuleKind>().toEqualTypeOf<
      (typeof INFRASTRUCTURE_MODULE_KINDS)[number]
    >();
  });
});
