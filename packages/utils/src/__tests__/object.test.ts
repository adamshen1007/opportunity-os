import { describe, expect, it } from "vitest";

import {
  getOwnValue,
  hasOwnKey,
  isObject,
  isRecord,
  omitKeys,
  pickKeys
} from "../index.js";

describe("object utilities", () => {
  it("checks generic object and record values safely", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject("value")).toBe(false);

    expect(isRecord({ key: "value" })).toBe(true);
    expect(isRecord([])).toBe(false);
    expect(isRecord(null)).toBe(false);
  });

  it("checks and reads own keys without throwing on nullish input", () => {
    const source = Object.create({ inherited: "ignore" }) as {
      own: string;
      inherited?: string;
    };
    source.own = "safe";

    expect(hasOwnKey(source, "own")).toBe(true);
    expect(hasOwnKey(source, "inherited")).toBe(false);
    expect(hasOwnKey(null, "own")).toBe(false);
    expect(hasOwnKey(undefined, "own")).toBe(false);

    expect(getOwnValue(source, "own")).toBe("safe");
    expect(getOwnValue(source, "inherited")).toBeUndefined();
    expect(getOwnValue(null, "own")).toBeUndefined();
  });

  it("selects keys without mutating the input", () => {
    const source = {
      keep: "yes",
      alsoKeep: 42,
      drop: "no"
    };

    const selected = pickKeys(source, ["keep", "alsoKeep"] as const);

    expect(selected).toEqual({ keep: "yes", alsoKeep: 42 });
    expect(selected).not.toBe(source);
    expect(source).toEqual({ keep: "yes", alsoKeep: 42, drop: "no" });
  });

  it("omits keys without mutating the input", () => {
    const source = {
      keep: "yes",
      drop: "no",
      alsoDrop: false
    };

    const selected = omitKeys(source, ["drop", "alsoDrop"] as const);

    expect(selected).toEqual({ keep: "yes" });
    expect(selected).not.toBe(source);
    expect(source).toEqual({ keep: "yes", drop: "no", alsoDrop: false });
  });

  it("handles nullish input for key selection helpers", () => {
    expect(pickKeys<{ missing?: string }, "missing">(null, ["missing"])).toEqual(
      {}
    );
    expect(
      pickKeys<{ missing?: string }, "missing">(undefined, ["missing"])
    ).toEqual({});
    expect(omitKeys<{ missing?: string }, "missing">(null, ["missing"])).toEqual(
      {}
    );
    expect(
      omitKeys<{ missing?: string }, "missing">(undefined, ["missing"])
    ).toEqual({});
  });
});
