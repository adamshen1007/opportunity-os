import { describe, expect, it } from "vitest";
import {
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis,
  OPPORTUNITY_FIXTURE_IDS
} from "@opportunity-os/opportunity-engine";
import {
  opportunityPipelineFixtureCandidate,
  opportunityPipelineFixtureEvidenceAggregation,
  opportunityPipelineFixtureHypothesisAssembly,
  opportunityPipelineFixtureProvenance
} from "../index.js";

describe("Opportunity Pipeline upstream integration contracts", () => {
  it("preserves Opportunity Engine evidence, hypothesis, and source references", () => {
    expect(opportunityPipelineFixtureEvidenceAggregation.evidence[0]?.evidenceId).toBe(
      opportunityFixtureEvidence.evidenceId
    );
    expect(opportunityPipelineFixtureHypothesisAssembly.hypotheses[0]?.hypothesisId).toBe(
      opportunityFixtureHypothesis.hypothesisId
    );
    expect(opportunityPipelineFixtureCandidate.opportunityId).toBe(
      OPPORTUNITY_FIXTURE_IDS.opportunityId
    );
  });

  it("preserves upstream provenance without raw provider payloads", () => {
    expect(opportunityPipelineFixtureProvenance.opportunityEvidence?.[0]?.evidenceId).toBe(
      opportunityFixtureEvidence.evidenceId
    );
    expect(opportunityPipelineFixtureProvenance.hypothesisIds).toContain(
      opportunityFixtureHypothesis.hypothesisId
    );
    expect(JSON.stringify(opportunityPipelineFixtureProvenance).toLowerCase()).not.toContain(
      "provider_response"
    );
  });
});
