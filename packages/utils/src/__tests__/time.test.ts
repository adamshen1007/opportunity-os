import { describe, expect, it } from "vitest";

import {
  createClock,
  createFixedClock,
  createSequenceClock,
  getIsoTimestamp,
  toIsoTimestamp
} from "../index.js";

describe("time utilities", () => {
  it("formats date, number, and string inputs as ISO timestamps", () => {
    const expected = "2026-06-29T00:00:00.000Z";

    expect(toIsoTimestamp(new Date(expected))).toBe(expected);
    expect(toIsoTimestamp(Date.parse(expected))).toBe(expected);
    expect(toIsoTimestamp(expected)).toBe(expected);
  });

  it("rejects invalid timestamp inputs with a clear error", () => {
    expect(() => toIsoTimestamp("not-a-date")).toThrow(
      "Timestamp input must represent a valid date."
    );
  });

  it("uses an injected fixed clock deterministically", () => {
    const fixedClock = createFixedClock("2026-06-29T10:00:00.000Z");

    expect(getIsoTimestamp(fixedClock)).toBe("2026-06-29T10:00:00.000Z");
    expect(getIsoTimestamp(fixedClock)).toBe("2026-06-29T10:00:00.000Z");
  });

  it("returns cloned dates from fixed clocks", () => {
    const fixedClock = createFixedClock("2026-06-29T10:00:00.000Z");
    const firstDate = fixedClock.now();

    firstDate.setUTCFullYear(2030);

    expect(fixedClock.now().toISOString()).toBe("2026-06-29T10:00:00.000Z");
  });

  it("supports custom injected clocks", () => {
    const customClock = createClock(() => "2026-06-29T11:00:00.000Z");

    expect(getIsoTimestamp(customClock)).toBe("2026-06-29T11:00:00.000Z");
  });

  it("supports deterministic sequence clocks without wall-clock timing", () => {
    const sequenceClock = createSequenceClock([
      "2026-06-29T12:00:00.000Z",
      "2026-06-29T12:00:01.000Z"
    ]);

    expect(getIsoTimestamp(sequenceClock)).toBe("2026-06-29T12:00:00.000Z");
    expect(getIsoTimestamp(sequenceClock)).toBe("2026-06-29T12:00:01.000Z");
    expect(getIsoTimestamp(sequenceClock)).toBe("2026-06-29T12:00:01.000Z");
  });

  it("rejects empty sequence clocks", () => {
    const sequenceClock = createSequenceClock([]);

    expect(() => sequenceClock.now()).toThrow(
      "Sequence clock requires at least one timestamp."
    );
  });
});
