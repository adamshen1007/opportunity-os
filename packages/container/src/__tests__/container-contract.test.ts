import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createDependencyToken,
  type ContainerContract,
  type DependencyResolver,
  type ServiceDescriptor
} from "../index.js";

describe("container resolution contracts", () => {
  it("defines resolver contracts without runtime resolution behavior", () => {
    const token = createDependencyToken<string>("test.resolver");
    const resolver: DependencyResolver = {
      has: (candidate) => candidate.id === token.id,
      resolve: <TValue>() => "resolved" as TValue,
      resolveOptional: <TValue>() => undefined as TValue | undefined
    };

    expect(resolver.has(token)).toBe(true);
    expect(resolver.resolve(token)).toBe("resolved");
    expect(resolver.resolveOptional(token)).toBeUndefined();
    expectTypeOf(resolver).toMatchTypeOf<DependencyResolver>();
  });

  it("defines container contracts as registration-aware resolvers", () => {
    const token = createDependencyToken<string>("test.container");
    const registrations: readonly ServiceDescriptor[] = [
      {
        kind: "value",
        token,
        lifetime: "singleton",
        value: "example"
      }
    ];
    const container: ContainerContract = {
      registrations,
      has: () => true,
      resolve: <TValue>() => "resolved" as TValue,
      resolveOptional: <TValue>() => "optional" as TValue
    };

    expect(container.registrations).toHaveLength(1);
    expect(container.has(token)).toBe(true);
    expect(container.resolve(token)).toBe("resolved");
    expect(container.resolveOptional(token)).toBe("optional");
    expectTypeOf(container).toMatchTypeOf<DependencyResolver>();
  });
});
