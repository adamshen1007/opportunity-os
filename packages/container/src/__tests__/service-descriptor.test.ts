import { describe, expect, expectTypeOf, it } from "vitest";
import {
  SERVICE_REGISTRATION_KINDS,
  createDependencyToken,
  type FactoryRegistration,
  type ServiceDescriptor,
  type ServiceRegistration,
  type ServiceRegistrationKind,
  type ValueRegistration
} from "../index.js";

describe("service descriptor contracts", () => {
  it("defines stable registration kinds", () => {
    expect(SERVICE_REGISTRATION_KINDS).toEqual([
      "class",
      "factory",
      "value"
    ]);

    expectTypeOf<ServiceRegistrationKind>().toEqualTypeOf<
      "class" | "factory" | "value"
    >();
  });

  it("represents service descriptors without registering services", async () => {
    const token = createDependencyToken<string>("test.service");
    const valueRegistration: ValueRegistration<string> = {
      kind: "value",
      token,
      lifetime: "singleton",
      value: "ready"
    };
    const factoryRegistration: FactoryRegistration<string> = {
      kind: "factory",
      token,
      lifetime: "transient",
      create: () => "created"
    };

    expect(valueRegistration.value).toBe("ready");
    expect(factoryRegistration.create({
      resolve: <TValue>() => "dependency" as TValue
    })).toBe("created");
    expectTypeOf(valueRegistration).toMatchTypeOf<ServiceDescriptor<string>>();
    expectTypeOf(factoryRegistration).toMatchTypeOf<ServiceRegistration<string>>();
  });
});
