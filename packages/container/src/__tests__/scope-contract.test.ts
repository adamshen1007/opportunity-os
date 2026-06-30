import { describe, expect, expectTypeOf, it } from "vitest";
import {
  type ContainerScope,
  type ScopeFactory,
  type ScopeId,
  type ScopedContainer
} from "../index.js";

describe("scope contracts", () => {
  it("defines scope and scoped container contracts", () => {
    const scope: ContainerScope = {
      id: "scope.test",
      dispose: () => undefined
    };
    const scopedContainer: ScopedContainer = {
      scope,
      registrations: [],
      has: () => false,
      resolve: <TValue>() => {
        throw new Error("test contract does not implement resolution");
      },
      resolveOptional: <TValue>() => undefined
    };

    expect(scope.id).toBe("scope.test");
    expect(scopedContainer.scope).toBe(scope);
    expect(scopedContainer.registrations).toEqual([]);
    expectTypeOf(scope.id).toEqualTypeOf<ScopeId>();
    expectTypeOf(scopedContainer).toMatchTypeOf<ScopedContainer>();
  });

  it("defines scope factory contracts without creating a runtime container", () => {
    const factory: ScopeFactory = {
      createScope: (id) => ({
        id,
        dispose: () => undefined
      }),
      createScopedContainer: (scope) => ({
        scope,
        registrations: [],
        has: () => false,
        resolve: <TValue>() => {
          throw new Error("test contract does not implement resolution");
        },
        resolveOptional: <TValue>() => undefined
      })
    };

    const scope = factory.createScope("scope.factory");
    const scopedContainer = factory.createScopedContainer(scope);

    expect(scope.id).toBe("scope.factory");
    expect(scopedContainer.scope.id).toBe("scope.factory");
    expectTypeOf(factory).toMatchTypeOf<ScopeFactory>();
  });
});
