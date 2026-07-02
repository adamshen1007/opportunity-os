import { describe, expect, it } from "vitest";
import {
  structuredAnalysisFixtureEvidence,
  structuredAnalysisFixtureProvenance
} from "@opportunity-os/analysis";
import { rawContentFixtureProvenance } from "@opportunity-os/raw-content";
import {
  OPPORTUNITY_RESULT_STATUSES,
  opportunityFixtureEvidence,
  opportunityFixtureHypothesis,
  opportunityFixtureResult,
  opportunityFixtureSource
} from "../index.js";

describe("opportunity engine upstream integration contracts", () => {
  it("preserves raw content and structured analysis provenance references", () => {
    expect(opportunityFixtureSource.provenance.rawContent).toEqual(rawContentFixtureProvenance);
    expect(opportunityFixtureSource.provenance.structuredAnalysis).toEqual(
      structuredAnalysisFixtureProvenance
    );
    expect(opportunityFixtureEvidence.structuredEvidence).toEqual(
      structuredAnalysisFixtureEvidence
    );
  });

  it("composes upstream evidence without executing generation behavior", () => {
    expect(opportunityFixtureHypothesis.evidence).toHaveLength(1);
    expect(opportunityFixtureResult.status).toBe(OPPORTUNITY_RESULT_STATUSES.success);
    if (opportunityFixtureResult.status !== OPPORTUNITY_RESULT_STATUSES.success) {
      throw new Error("Expected success result fixture.");
    }

    expect(opportunityFixtureResult.evidence[0]?.source.provenance.rawContent?.source.platform).toBe(
      "reddit"
    );
  });
});
