import { describe, expect, expectTypeOf, it } from "vitest";
import {
  createDependencyToken,
  type DependencyToken
} from "../index.js";

describe("dependency token contracts", () => {
  it("creates deterministic typed dependency tokens", () => {
    const token = createDependencyToken<string>(
      "test.string",
      "Generic string dependency"
    );

    expect(token).toEqual({
      id: "test.string",
      description: "Generic string dependency"
    });
    expectTypeOf(token).toEqualTypeOf<DependencyToken<string>>();
  });

  it("supports tokens without descriptions", () => {
    const token = createDependencyToken<number>("test.number");

    expect(token).toEqual({ id: "test.number" });
    expectTypeOf(token).toEqualTypeOf<DependencyToken<number>>();
  });
});
