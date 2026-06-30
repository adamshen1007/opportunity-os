import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createDependencyToken,
  type ClassRegistration,
  type DependencyFactory,
  type FactoryRegistration,
  type FactoryResolutionContext,
  type ServiceConstructor,
  type ServiceDescriptor,
  type ValueRegistration
} from "../index.js";

describe("registration contracts", () => {
  class GenericService {
    readonly name = "generic";
  }

  it("defines class registration contracts", () => {
    const token = createDependencyToken<GenericService>("test.generic-service");
    const registration: ClassRegistration<GenericService> = {
      kind: "class",
      token,
      lifetime: "scoped",
      useClass: GenericService
    };

    expect(registration.kind).toBe("class");
    expect(registration.lifetime).toBe("scoped");
    expectTypeOf(GenericService).toMatchTypeOf<ServiceConstructor<GenericService>>();
    expectTypeOf(registration).toMatchTypeOf<ServiceDescriptor<GenericService>>();
  });

  it("defines factory registration contracts with explicit context", async () => {
    const token = createDependencyToken<string>("test.factory");
    const dependencyToken = createDependencyToken<string>("test.dependency");
    const create: DependencyFactory<string> = (context) =>
      `${context.resolve(dependencyToken)}-created`;
    const context: FactoryResolutionContext = {
      resolve: <TValue>() => "dependency" as TValue
    };
    const registration: FactoryRegistration<string> = {
      kind: "factory",
      token,
      lifetime: "transient",
      dependencies: [dependencyToken],
      create
    };

    expect(registration.create(context)).toBe("dependency-created");
    expectTypeOf(registration).toMatchTypeOf<ServiceDescriptor<string>>();
  });

  it("defines value registration contracts as singleton values", () => {
    const token = createDependencyToken<Readonly<{ enabled: boolean }>>(
      "test.value"
    );
    const registration: ValueRegistration<Readonly<{ enabled: boolean }>> = {
      kind: "value",
      token,
      lifetime: "singleton",
      value: Object.freeze({ enabled: true })
    };

    expect(registration.value.enabled).toBe(true);
    expectTypeOf(registration).toMatchTypeOf<ServiceDescriptor<Readonly<{ enabled: boolean }>>>();
  });
});
