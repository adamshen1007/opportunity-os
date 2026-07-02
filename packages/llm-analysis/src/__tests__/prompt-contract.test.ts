import { describe, expect, it } from "vitest";
import {
  PROMPT_SAFETY_CLASSIFICATIONS,
  PROMPT_TEMPLATE_VARIABLE_KINDS,
  STRUCTURED_OUTPUT_FIELD_KINDS,
  type PromptContract,
  type PromptId,
  type PromptInput,
  type PromptTemplate,
  type PromptVersion
} from "../index.js";

describe("prompt contracts", () => {
  it("define identity, version, purpose, input shape, output shape, and safety classification", () => {
    const prompt: PromptContract = {
      id: "prompt.fixture.analysis" as PromptId,
      name: "Fixture Analysis Prompt",
      version: "1.0.0" as PromptVersion,
      purpose: "Describe a generic analysis contract.",
      inputShape: {
        schemaName: "FixturePromptInput",
        schemaVersion: "1.0.0",
        requiredKeys: ["normalizedContent"],
        optionalKeys: ["embeddingReferences", "safeMetadata"]
      },
      outputShape: {
        schema: {
          schemaName: "FixturePromptOutput",
          schemaVersion: "1.0.0",
          fields: [
            {
              name: "summary",
              kind: STRUCTURED_OUTPUT_FIELD_KINDS.string,
              required: true,
              validationMetadata: {
                minLength: 1
              }
            }
          ],
          requiredFields: ["summary"],
          optionalFields: [],
          validationMetadata: {
            allowAdditionalFields: false,
            issueCodes: ["missing_required_field"]
          }
        }
      },
      safetyClassification: PROMPT_SAFETY_CLASSIFICATIONS.internal
    };

    expect(prompt.inputShape.requiredKeys).toEqual(["normalizedContent"]);
    expect(prompt.outputShape.schema.requiredFields).toEqual(["summary"]);
    expect(prompt.safetyClassification).toBe("internal");
  });

  it("define templates with variables, placeholders, safety metadata, and versioning", () => {
    const template: PromptTemplate = {
      promptId: "prompt.fixture.analysis" as PromptId,
      version: "1.0.0" as PromptVersion,
      templateId: "template.fixture.analysis",
      placeholders: ["canonical_text"],
      variables: [
        {
          name: "canonicalText",
          placeholder: "canonical_text",
          kind: PROMPT_TEMPLATE_VARIABLE_KINDS.text,
          required: true,
          safetyClassification: PROMPT_SAFETY_CLASSIFICATIONS.internal,
          description: "Canonical text supplied by normalization contracts."
        }
      ],
      safetyMetadata: {
        classification: PROMPT_SAFETY_CLASSIFICATIONS.internal,
        redactionRequired: true,
        allowedInputKeys: ["canonicalText"]
      }
    };

    expect(template.variables[0]?.kind).toBe("text");
    expect(template.safetyMetadata.redactionRequired).toBe(true);
  });

  it("allow prompt inputs to reference upstream foundation contracts without runtime behavior", () => {
    const input: PromptInput = {
      inputId: "input.fixture",
      references: {
        embeddingReferences: [],
        provenance: {
          source: {
            platform: "reddit",
            objectKind: "post",
            objectId: "source-1",
            collectedAt: "2026-01-01T00:00:00.000Z",
            safeProviderMetadata: {
              kind: "safe-provider-metadata",
              redacted: true,
              source: "reddit"
            }
          },
          ingestion: {
            ingestionId: "ingestion-1",
            collectedAt: "2026-01-01T00:00:00.000Z",
            correlationId: "correlation-1",
            connector: {
              connectorId: "connector-1",
              connectorName: "Fixture Connector",
              connectorVersion: "1.0.0"
            }
          },
          providerReference: {
            platform: "reddit",
            objectId: "source-1"
          },
          collectedThrough: "reddit-provider-transport",
          transformBoundary: "raw-content-contract",
          recordedAt: "2026-01-01T00:00:00.000Z"
        },
        safeMetadata: {
          title: "Fixture",
          label: "safe"
        }
      },
      variables: {
        canonicalText: "Synthetic normalized text."
      }
    };

    expect(input.references.embeddingReferences).toEqual([]);
    expect(input.references.provenance.source.objectKind).toBe("post");
  });
});
