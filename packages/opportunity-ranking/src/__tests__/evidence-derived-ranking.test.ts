import { describe, expect, it } from "vitest";
import { EVIDENCE_RANKING_VERSIONS, rankEvidenceDerivedOpportunities } from "../index.js";

const evidence = (overrides: Partial<{
  evidenceId: string;
  text: string;
  sourceType: string;
  connectorId: string;
  observedAt: string;
  stance: "supporting" | "contradictory" | "excluded";
  engagement: number;
}> = {}) => ({
  evidenceId: overrides.evidenceId ?? "evidence-1",
  text: overrides.text ?? "Operators manually compare failed checks and need immediate attention.",
  sourceType: overrides.sourceType ?? "public-forum",
  connectorId: overrides.connectorId ?? "source-a",
  observedAt: overrides.observedAt ?? "2026-07-01T00:00:00.000Z",
  stance: overrides.stance ?? "supporting" as const,
  ...(overrides.engagement === undefined ? {} : { engagement: overrides.engagement })
});

describe("evidence-derived opportunity ranking", () => {
  it("derives opportunity-specific signals and reconciles every score", () => {
    const result = rankEvidenceDerivedOpportunities([
      { opportunityId: "strong", title: "Strong", evidence: [evidence(), evidence({ evidenceId: "evidence-2", connectorId: "source-b" })] },
      { opportunityId: "weak", title: "Weak", evidence: [evidence({ evidenceId: "evidence-3", text: "A workflow exists." })] }
    ]);

    expect(result.formulaVersion).toBe(EVIDENCE_RANKING_VERSIONS.formula);
    expect(result.rankedOpportunities.map((item) => item.opportunityId)).toEqual(["strong", "weak"]);
    for (const ranked of result.rankedOpportunities) {
      expect(ranked.explanation.reconciledScore).toBe(ranked.score);
      expect(ranked.demandStrength).not.toBe(ranked.confidence);
    }
  });

  it("lowers confidence when evidence signals are missing", () => {
    const complete = rankEvidenceDerivedOpportunities([{ opportunityId: "complete", title: "Complete", evidence: [evidence({ engagement: 0.8 })] }]);
    const missing = rankEvidenceDerivedOpportunities([{ opportunityId: "missing", title: "Missing", evidence: [] }]);
    expect(complete.rankedOpportunities[0]!.confidence).toBeGreaterThan(missing.rankedOpportunities[0]!.confidence);
  });

  it("applies contradiction penalties and deterministic tie breaking", () => {
    const support = evidence();
    const result = rankEvidenceDerivedOpportunities([
      { opportunityId: "b", title: "B", evidence: [support] },
      { opportunityId: "a", title: "A", evidence: [support] },
      { opportunityId: "contradicted", title: "Contradicted", evidence: [support, evidence({ evidenceId: "contra", stance: "contradictory" })] }
    ]);
    expect(result.rankedOpportunities.map((item) => item.opportunityId)).toEqual(["a", "b", "contradicted"]);
    expect(result.rankedOpportunities[2]!.explanation.contradictionPenalty).toBeGreaterThan(0);
  });
});
