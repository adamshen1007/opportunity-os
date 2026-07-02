import { describe, expect, it } from "vitest";
import { rawContentFixtureProvenance } from "@opportunity-os/raw-content";
import {
  OPPORTUNITY_EVIDENCE_KINDS,
  OPPORTUNITY_HYPOTHESIS_STATUSES,
  OPPORTUNITY_SOURCE_KINDS,
  OPPORTUNITY_STATUSES,
  type OpportunityEvidenceReference,
  type OpportunityEvidenceId,
  type OpportunityHypothesis,
  type OpportunityHypothesisId,
  type OpportunityId,
  type OpportunitySourceId,
  type OpportunitySourceReference,
  type OpportunityTimestamp,
  type OpportunityVersion
} from "../index.js";

const opportunityId = "opportunity_test_001" as OpportunityId;
const timestamp = "2026-07-02T00:00:00.000Z" as OpportunityTimestamp;
const version = "1" as OpportunityVersion;
const sourceId = "source_ref_001" as OpportunitySourceId;
const evidenceId = "evidence_001" as OpportunityEvidenceId;
const hypothesisId = "hypothesis_001" as OpportunityHypothesisId;

describe("opportunity core contracts", () => {
  it("exports stable primitive vocabularies", () => {
    expect(OPPORTUNITY_STATUSES).toEqual({
      draft: "draft",
      candidate: "candidate",
      validated: "validated",
      archived: "archived"
    });
    expect(OPPORTUNITY_SOURCE_KINDS.structuredAnalysis).toBe("structured-analysis");
  });

  it("models sources with provenance and safe metadata", () => {
    const source = {
      sourceId,
      kind: OPPORTUNITY_SOURCE_KINDS.rawContent,
      provenance: {
        rawContent: rawContentFixtureProvenance
      },
      safeMetadata: {
        sample: true
      }
    } satisfies OpportunitySourceReference;

    expect(source.provenance.rawContent?.source.platform).toBe("reddit");
    expect(source.safeMetadata?.sample).toBe(true);
  });

  it("models evidence with source and provenance references", () => {
    const source = {
      sourceId,
      kind: OPPORTUNITY_SOURCE_KINDS.rawContent,
      provenance: {
        rawContent: rawContentFixtureProvenance
      }
    } satisfies OpportunitySourceReference;

    const evidence = {
      evidenceId,
      opportunityId,
      kind: OPPORTUNITY_EVIDENCE_KINDS.sourceSignal,
      source,
      provenance: rawContentFixtureProvenance
    } satisfies OpportunityEvidenceReference;

    expect(evidence.source.kind).toBe("raw-content");
    expect(evidence.provenance.source.objectId).toBe("reddit_post_fixture_001");
  });

  it("models hypotheses without runtime generation behavior", () => {
    const source = {
      sourceId,
      kind: OPPORTUNITY_SOURCE_KINDS.rawContent,
      provenance: {
        rawContent: rawContentFixtureProvenance
      }
    } satisfies OpportunitySourceReference;
    const evidence = {
      evidenceId,
      kind: OPPORTUNITY_EVIDENCE_KINDS.sourceSignal,
      source,
      provenance: rawContentFixtureProvenance
    } satisfies OpportunityEvidenceReference;

    const hypothesis = {
      hypothesisId,
      opportunityId,
      status: OPPORTUNITY_HYPOTHESIS_STATUSES.proposed,
      statement: "A repeated source signal may indicate an unmet need.",
      assumptions: ["Evidence remains linked to provenance."],
      evidence: [evidence],
      provenance: rawContentFixtureProvenance,
      lifecycle: {
        createdAt: timestamp,
        version,
        status: OPPORTUNITY_STATUSES.candidate
      }
    } satisfies OpportunityHypothesis;

    expect(hypothesis.evidence).toHaveLength(1);
    expect(hypothesis.lifecycle.status).toBe("candidate");
  });
});
