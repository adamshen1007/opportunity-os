import { describe, expect, it } from "vitest";
import {
  CANONICAL_TEXT_VERSION,
  NORMALIZATION_STAGES,
  type NormalizationInput,
  type NormalizationOutput
} from "../index.js";
import { rawContentFixturePostEnvelope } from "@opportunity-os/raw-content";

describe("normalization input and output contracts", () => {
  it("links raw content input to canonical text output with provenance preserved", () => {
    const input: NormalizationInput = {
      envelope: rawContentFixturePostEnvelope,
      requestedStages: NORMALIZATION_STAGES
    };

    const output: NormalizationOutput = {
      sourceEnvelope: rawContentFixturePostEnvelope,
      canonicalText: {
        id: "canonical_text_contract_1",
        version: CANONICAL_TEXT_VERSION,
        format: "plain-text",
        sourceKind: rawContentFixturePostEnvelope.kind,
        source: rawContentFixturePostEnvelope.content.source,
        text: "Fixture post for raw content contracts",
        segments: [
          {
            id: "segment_contract_1",
            order: 0,
            text: "Fixture post for raw content contracts",
            range: {
              start: 0,
              end: 38
            }
          }
        ],
        normalizedAt: "2026-07-02T00:00:00.000Z"
      },
      provenance: rawContentFixturePostEnvelope.provenance,
      stages: [
        {
          stage: "raw-content-input",
          status: "completed"
        },
        {
          stage: "canonical-text-model",
          status: "completed"
        }
      ]
    };

    expect(input.envelope.kind).toBe("post");
    expect(output.sourceEnvelope).toBe(input.envelope);
    expect(output.provenance.providerReference.objectId).toBe("reddit_post_fixture_001");
  });
});
