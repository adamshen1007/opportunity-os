import { describe, expect, it } from "vitest";
import {
  CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES,
  CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES,
  CANDIDATE_OPPORTUNITY_STATUSES,
  OPPORTUNITY_CANDIDATES_FOUNDATION_PHASE,
  OPPORTUNITY_CANDIDATES_PACKAGE_NAME
} from "../index.js";
import type {
  CandidateOpportunity,
  CandidateOpportunityContract,
  CandidateOpportunityId,
  CandidateOpportunityLifecycle,
  CandidateOpportunityMetadata,
  CandidateOpportunityProvenance,
  CandidateOpportunityTimestamp,
  CandidateOpportunityVersion
} from "../index.js";
import type { OpportunityHypothesis } from "@opportunity-os/opportunity-engine";

const candidateId = "candidate-001" as CandidateOpportunityId;
const timestamp = "2026-07-02T00:00:00.000Z" as CandidateOpportunityTimestamp;
const version = "candidate-v1" as CandidateOpportunityVersion;

describe("Candidate Opportunity core contracts", () => {
  it("exposes the Candidate Opportunity package boundary", () => {
    expect(OPPORTUNITY_CANDIDATES_PACKAGE_NAME).toBe("@opportunity-os/opportunity-candidates");
    expect(OPPORTUNITY_CANDIDATES_FOUNDATION_PHASE).toBe("phase-2-milestone-23");
  });

  it("defines stable lifecycle and provenance vocabularies", () => {
    expect(CANDIDATE_OPPORTUNITY_STATUSES.validationReady).toBe("validation-ready");
    expect(CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES.evidenceIncomplete).toBe("evidence-incomplete");
    expect(CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES.opportunityPipeline).toBe("opportunity-pipeline");
  });

  it("composes provider-independent candidate contracts", () => {
    const lifecycle: CandidateOpportunityLifecycle = {
      state: CANDIDATE_OPPORTUNITY_LIFECYCLE_STATES.validationReady,
      status: CANDIDATE_OPPORTUNITY_STATUSES.validationReady,
      version,
      createdAt: timestamp
    };

    const metadata: CandidateOpportunityMetadata = {
      source: {
        pipelineId: "pipeline-001" as CandidateOpportunityMetadata["source"]["pipelineId"],
        runId: "run-001" as CandidateOpportunityMetadata["source"]["runId"]
      },
      version,
      createdAt: timestamp,
      safeMetadata: {
        fixture: true
      }
    };

    const provenance: CandidateOpportunityProvenance = {
      boundary: CANDIDATE_OPPORTUNITY_PROVENANCE_BOUNDARIES.opportunityPipeline,
      recordedAt: timestamp,
      pipelineProvenance: [],
      upstream: {
        pipelineRunId: "run-001" as CandidateOpportunityProvenance["upstream"]["pipelineRunId"],
        pipelineCandidateId: "pipeline-candidate-001" as CandidateOpportunityProvenance["upstream"]["pipelineCandidateId"],
        opportunitySources: [],
        opportunityEvidence: [],
        hypothesisIds: []
      }
    };

    const candidate = {
      candidateId,
      hypothesis: {
        hypothesisId: "hypothesis-001"
      } as OpportunityHypothesis,
      evidence: [],
      lifecycle,
      metadata,
      provenance
    } satisfies CandidateOpportunity;

    const contract: CandidateOpportunityContract = {
      input: {
        upstreamCandidateId: "pipeline-candidate-001" as CandidateOpportunityContract["input"]["upstreamCandidateId"]
      },
      candidate
    };

    expect(contract.candidate.candidateId).toBe(candidateId);
    expect(contract.candidate.provenance.pipelineProvenance).toHaveLength(0);
  });
});
