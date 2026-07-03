import { describe, expect, it } from "vitest";
import {
  candidateFixtureOpportunity,
  CANDIDATE_OPPORTUNITY_STATUSES
} from "@opportunity-os/opportunity-candidates";
import {
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis
} from "@opportunity-os/opportunity-engine";
import { opportunityPipelineFixtureProvenance } from "@opportunity-os/opportunity-pipeline";
import {
  GENERATION_EVIDENCE_ASSEMBLY_STATUSES,
  opportunityGenerationFixtureAssembly,
  opportunityGenerationFixtureInput
} from "../index.js";

describe("Opportunity Generation upstream integration contracts", () => {
  it("consumes candidate, pipeline, and opportunity contracts without reshaping upstream identities", () => {
    expect(opportunityGenerationFixtureInput.candidate.candidateId).toBe(candidateFixtureOpportunity.candidateId);
    expect(opportunityGenerationFixtureInput.candidate.lifecycle.status).toBe(CANDIDATE_OPPORTUNITY_STATUSES.validationReady);
    expect(opportunityGenerationFixtureAssembly.provenance[0]).toBe(opportunityPipelineFixtureProvenance);
    expect(opportunityGenerationFixtureAssembly.evidence[0]).toBe(opportunityFixtureEvidence);
    expect(opportunityGenerationFixtureAssembly.hypotheses[0]).toBe(opportunityFixtureHypothesis);
  });

  it("keeps upstream integration deterministic and provider-independent", () => {
    expect(opportunityGenerationFixtureAssembly.status).toBe(GENERATION_EVIDENCE_ASSEMBLY_STATUSES.assembled);
    expect(opportunityGenerationFixtureAssembly.provenance).toHaveLength(1);
    expect(opportunityGenerationFixtureAssembly.evidence).toHaveLength(1);
    expect(opportunityGenerationFixtureAssembly.hypotheses).toHaveLength(1);
  });
});
