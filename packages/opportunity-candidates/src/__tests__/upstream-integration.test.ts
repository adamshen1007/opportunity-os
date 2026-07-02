import { describe, expect, it } from "vitest";
import {
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis
} from "@opportunity-os/opportunity-engine";
import {
  OPPORTUNITY_PIPELINE_FIXTURE_IDS,
  opportunityPipelineFixtureCandidate
} from "@opportunity-os/opportunity-pipeline";
import {
  candidateFixtureOpportunity,
  candidateFixtureProvenance
} from "../index.js";

describe("candidate opportunity upstream integration contracts", () => {
  it("preserves upstream opportunity pipeline references", () => {
    expect(candidateFixtureProvenance.upstream.pipelineRunId).toBe(
      OPPORTUNITY_PIPELINE_FIXTURE_IDS.runId
    );
    expect(candidateFixtureProvenance.upstream.pipelineCandidateId).toBe(
      opportunityPipelineFixtureCandidate.candidateId
    );
  });

  it("preserves opportunity evidence and hypothesis references", () => {
    expect(candidateFixtureOpportunity.hypothesis).toBe(opportunityFixtureHypothesis);
    expect(candidateFixtureOpportunity.evidence).toEqual([opportunityFixtureEvidence]);
    expect(candidateFixtureProvenance.upstream.hypothesisIds).toEqual([
      opportunityFixtureHypothesis.hypothesisId
    ]);
  });
});
