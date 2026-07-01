import { describe, expect, it } from "vitest";
import type {
  ConnectorConfig,
  ConnectorConfigInput,
  ConnectorSensitiveConfigField
} from "../index.js";

describe("connector configuration contracts", () => {
  it("uses explicit typed input", () => {
    const input: ConnectorConfigInput = {
      fields: [
        {
          key: "baseUrl",
          kind: "url",
          required: true,
          value: "https://example.invalid"
        }
      ]
    };
    const config: ConnectorConfig = {
      fields: input.fields
    };

    expect(config.fields).toEqual(input.fields);
  });

  it("models secret-like fields as sensitive", () => {
    const field: ConnectorSensitiveConfigField = {
      key: "apiKey",
      kind: "secret",
      required: true,
      sensitive: true
    };

    expect(field.sensitive).toBe(true);
    expect(field.kind).toBe("secret");
  });
});
