import { describe, expect, it } from "vitest";
import {
  OPPORTUNITY_PIPELINE_FIXTURE_IDS,
  OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP,
  OPPORTUNITY_PIPELINE_RESULT_STATUSES,
  opportunityPipelineFixtureCandidate,
  opportunityPipelineFixtureCompletedEvent,
  opportunityPipelineFixtureEvidenceAggregation,
  opportunityPipelineFixtureHypothesisAssembly,
  opportunityPipelineFixtureResult,
  opportunityPipelineFixtureValidationSuccess
} from "../index.js";

const forbiddenFixtureFragments = [
  "access_token",
  "refresh_token",
  "client_secret",
  "authorization",
  "bearer ",
  "provider_response",
  "raw_provider",
  "prompt",
  "customer",
  "production"
];

describe("Opportunity Pipeline deterministic fixtures", () => {
  it("uses stable synthetic IDs and timestamps", () => {
    expect(OPPORTUNITY_PIPELINE_FIXTURE_IDS.pipelineId).toBe("opportunity-pipeline-fixture-1");
    expect(OPPORTUNITY_PIPELINE_FIXTURE_IDS.runId).toBe("opportunity-pipeline-run-fixture-1");
    expect(OPPORTUNITY_PIPELINE_FIXTURE_TIMESTAMP).toBe("2026-01-01T00:00:00.000Z");
  });

  it("provides synthetic assembly fixtures", () => {
    expect(opportunityPipelineFixtureEvidenceAggregation.evidence).toHaveLength(1);
    expect(opportunityPipelineFixtureHypothesisAssembly.hypotheses).toHaveLength(1);
    expect(opportunityPipelineFixtureCandidate.evidence).toHaveLength(1);
    expect(opportunityPipelineFixtureResult.status).toBe(OPPORTUNITY_PIPELINE_RESULT_STATUSES.success);
    expect(opportunityPipelineFixtureCompletedEvent.payload.status).toBe("success");
    expect(opportunityPipelineFixtureValidationSuccess.valid).toBe(true);
  });

  it("does not include provider payloads, prompts, secrets, or production examples", () => {
    const serializedFixtures = JSON.stringify({
      ids: OPPORTUNITY_PIPELINE_FIXTURE_IDS,
      aggregation: opportunityPipelineFixtureEvidenceAggregation,
      hypothesisAssembly: opportunityPipelineFixtureHypothesisAssembly,
      candidate: opportunityPipelineFixtureCandidate,
      result: opportunityPipelineFixtureResult,
      event: opportunityPipelineFixtureCompletedEvent
    }).toLowerCase();

    for (const fragment of forbiddenFixtureFragments) {
      expect(serializedFixtures).not.toContain(fragment);
    }
  });
});
