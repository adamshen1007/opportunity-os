import { describe, expect, it } from "vitest";
import type {
  ConnectorRegistry,
  ConnectorRegistryListResult,
  ConnectorRegistryLookupResult,
  ConnectorRegistryRegistrationResult
} from "../index.js";

describe("connector registry contracts", () => {
  it("defines register, lookup, list, and validation shapes", () => {
    const registry: ConnectorRegistry = {
      register: () =>
        ({
          ok: false,
          error: "not available"
        }) satisfies ConnectorRegistryRegistrationResult,
      lookup: () =>
        ({
          ok: true,
          value: undefined
        }) satisfies ConnectorRegistryLookupResult,
      list: () =>
        ({
          ok: true,
          value: []
        }) satisfies ConnectorRegistryListResult,
      validate: () => ({
        ok: true,
        issues: []
      })
    };

    expect(typeof registry.register).toBe("function");
    expect(typeof registry.lookup).toBe("function");
    expect(typeof registry.list).toBe("function");
    expect(typeof registry.validate).toBe("function");
  });
});
