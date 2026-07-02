import { describe, expect, it } from "vitest";
import {
  STRUCTURED_OUTPUT_FIELD_KINDS,
  type StructuredOutputContract
} from "../index.js";

describe("structured output contracts", () => {
  it("define fields, required and optional fields, validation metadata, and schema versioning", () => {
    const contract: StructuredOutputContract = {
      schemaName: "FixtureStructuredOutput",
      schemaVersion: "1.0.0",
      fields: [
        {
          name: "summary",
          kind: STRUCTURED_OUTPUT_FIELD_KINDS.string,
          required: true,
          description: "A generic structured text field.",
          validationMetadata: {
            minLength: 1,
            maxLength: 280
          }
        },
        {
          name: "metadata",
          kind: STRUCTURED_OUTPUT_FIELD_KINDS.object,
          required: false,
          validationMetadata: {}
        }
      ],
      requiredFields: ["summary"],
      optionalFields: ["metadata"],
      validationMetadata: {
        allowAdditionalFields: false,
        issueCodes: ["missing_required_field", "unexpected_field"]
      }
    };

    expect(contract.schemaVersion).toBe("1.0.0");
    expect(contract.fields.map((field) => field.name)).toEqual(["summary", "metadata"]);
    expect(contract.requiredFields).toEqual(["summary"]);
    expect(contract.optionalFields).toEqual(["metadata"]);
  });
});
