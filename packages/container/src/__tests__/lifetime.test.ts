import { describe, expect, expectTypeOf, it } from "vitest";
import {
  CONTAINER_LIFETIMES,
  type ContainerLifetime
} from "../index.js";

describe("container lifetime contracts", () => {
  it("defines stable dependency lifetimes", () => {
    expect(CONTAINER_LIFETIMES).toEqual([
      "singleton",
      "scoped",
      "transient"
    ]);

    expectTypeOf<ContainerLifetime>().toEqualTypeOf<
      "singleton" | "scoped" | "transient"
    >();
  });
});
