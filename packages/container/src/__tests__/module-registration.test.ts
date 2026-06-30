import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createDependencyToken,
  type ModuleDefinition,
  type ModuleId,
  type ModuleRegistration
} from "../index.js";

describe("module registration contracts", () => {
  it("defines module definitions without composing modules", () => {
    const token = createDependencyToken<string>("test.module.export");
    const definition: ModuleDefinition = {
      id: "module.test",
      description: "Generic test module",
      dependencies: ["module.base"],
      exports: [token]
    };

    expect(definition.id).toBe("module.test");
    expect(definition.dependencies).toEqual(["module.base"]);
    expect(definition.exports).toEqual([token]);
    expectTypeOf(definition.id).toEqualTypeOf<ModuleId>();
  });

  it("defines module registrations as module metadata plus descriptors", () => {
    const token = createDependencyToken<string>("test.module.service");
    const registration: ModuleRegistration = {
      id: "module.registration",
      registrations: [
        {
          kind: "value",
          token,
          lifetime: "singleton",
          value: "registered"
        }
      ],
      exports: [token]
    };

    expect(registration.registrations).toHaveLength(1);
    expect(registration.exports).toEqual([token]);
    expectTypeOf(registration).toMatchTypeOf<ModuleDefinition>();
  });
});
