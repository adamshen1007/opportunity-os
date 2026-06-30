import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createInjectionToken,
  type ApplicationProvider,
  type ContainerContract,
  type FactoryProvider,
  type InjectionToken,
  type ValueProvider
} from "../index.js";

describe("application dependency injection contracts", () => {
  it("creates deterministic injection tokens without resolving dependencies", () => {
    const token = createInjectionToken<string>(
      "test.token",
      "Generic test token"
    );

    expect(token).toEqual({
      id: "test.token",
      description: "Generic test token"
    });
    expectTypeOf(token).toEqualTypeOf<InjectionToken<string>>();
  });

  it("defines provider and container shapes without a runtime container", async () => {
    const token = createInjectionToken<string>("test.token");
    const valueProvider: ValueProvider<string> = {
      kind: "value",
      token,
      value: "example"
    };
    const factoryProvider: FactoryProvider<string> = {
      kind: "factory",
      token,
      create: async () => "created"
    };
    const container: ContainerContract = {
      has: (candidate) => candidate.id === token.id,
      resolve: <TValue>() => "resolved" as TValue
    };

    expect(valueProvider.value).toBe("example");
    await expect(factoryProvider.create()).resolves.toBe("created");
    expect(container.has(token)).toBe(true);
    expect(container.resolve(token)).toBe("resolved");
    expectTypeOf(valueProvider).toMatchTypeOf<ApplicationProvider<string>>();
    expectTypeOf(factoryProvider).toMatchTypeOf<ApplicationProvider<string>>();
  });
});
