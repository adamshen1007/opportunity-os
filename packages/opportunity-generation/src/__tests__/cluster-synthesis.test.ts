import { describe, expect, it } from "vitest";
import { EVIDENCE_STANCES, clusterEvidence, type EvidenceClusteringInput } from "@opportunity-os/opportunity-pipeline";
import { synthesizeEvidenceCluster, synthesizeEvidenceClusters } from "../index.js";

const evidence = (id: string, stance?: EvidenceClusteringInput["stance"]): EvidenceClusteringInput => ({
  evidenceId: id,
  title: "Incident handoff loses context",
  text: "On-call responders reconstruct incident timelines and prior diagnostic actions manually.",
  sourceType: "fixture",
  sourceId: id,
  sourceUrl: `https://example.invalid/${id}`,
  observedAt: "2026-07-29T00:00:00.000Z",
  connectorId: "fixture",
  rawContentId: `raw-${id}`,
  normalizedContentId: `normalized-${id}`,
  analysisRequestId: `analysis-${id}`,
  stance,
  provenance: { sourceId: id }
});

describe("cluster-based opportunity synthesis", () => {
  it("creates at most one fully cited primary opportunity per qualified cluster", () => {
    const [cluster] = clusterEvidence([evidence("one"), evidence("two")]);
    const results = synthesizeEvidenceClusters(cluster ? [cluster] : []);
    expect(results).toHaveLength(1);
    expect(results[0]?.status).toBe("synthesized");
    if (results[0]?.status !== "synthesized") return;
    const opportunity = results[0].opportunity;
    for (const claim of [opportunity.targetUser, opportunity.pain, opportunity.context, opportunity.currentWorkaround, opportunity.desiredOutcome]) {
      expect(claim.citationIds).toEqual(["one", "two"]);
    }
    expect(opportunity.exploratory).toBe(false);
  });

  it("labels singleton clusters exploratory and preserves contradictions", () => {
    const clusters = clusterEvidence([evidence("support"), evidence("contra", EVIDENCE_STANCES.contradictory)]);
    const result = clusters[0] ? synthesizeEvidenceCluster(clusters[0]) : undefined;
    expect(result?.status).toBe("synthesized");
    if (result?.status !== "synthesized") return;
    expect(result.opportunity.exploratory).toBe(true);
    expect(result.opportunity.contradictoryEvidenceIds).toEqual(["contra"]);
    expect(result.opportunity.limitations.join(" ")).toContain("Contradictory evidence");
  });

  it("rejects clusters without supporting evidence", () => {
    const [cluster] = clusterEvidence([evidence("contra", EVIDENCE_STANCES.contradictory)]);
    expect(cluster && synthesizeEvidenceCluster(cluster)).toMatchObject({
      status: "rejected",
      rejection: { reason: "no-supporting-evidence" }
    });
  });
});
