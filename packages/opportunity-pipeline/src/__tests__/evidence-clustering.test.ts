import { describe, expect, it } from "vitest";
import { EVIDENCE_STANCES, clusterEvidence, type EvidenceClusteringInput } from "../index.js";

const evidence = (id: string, title: string, text: string, stance?: EvidenceClusteringInput["stance"]): EvidenceClusteringInput => ({
  evidenceId: id,
  title,
  text,
  sourceType: "fixture",
  sourceId: id,
  sourceUrl: `https://example.invalid/${id}`,
  observedAt: "2026-07-29T00:00:00.000Z",
  connectorId: "fixture-connector",
  rawContentId: `raw-${id}`,
  normalizedContentId: `normalized-${id}`,
  analysisRequestId: `analysis-${id}`,
  stance,
  provenance: { sourceId: id, safe: true }
});

describe("deterministic evidence clustering", () => {
  it("merges related evidence and separates unrelated evidence deterministically", () => {
    const inputs = [
      evidence("one", "Deployment failures need log review", "Release operators compare build logs manually."),
      evidence("two", "Rollback checks are scattered", "Teams verify rollback service versions in several dashboards."),
      evidence("three", "Interview notes are fragmented", "Researchers consolidate interview findings manually.")
    ];
    const forward = clusterEvidence(inputs);
    const reverse = clusterEvidence([...inputs].reverse());
    expect(forward).toEqual(reverse);
    expect(forward).toHaveLength(2);
    expect(forward.find((cluster) => cluster.ruleId === "release-diagnosis")?.demandCount).toBe(2);
    expect(forward.find((cluster) => cluster.ruleId === "research-synthesis")?.demandCount).toBe(1);
  });

  it("suppresses duplicate demand and preserves contradictory and excluded evidence", () => {
    const original = evidence("one", "Inventory exceptions need triage", "Stock exceptions are copied into spreadsheets.");
    const duplicate = { ...original, evidenceId: "duplicate" };
    const contradictory = evidence("contra", "Inventory triage is automated", "Stock exceptions require no manual review.", EVIDENCE_STANCES.contradictory);
    const excluded = evidence("excluded", "Inventory note", "Stock exception record is outside the approved period.", EVIDENCE_STANCES.excluded);
    const [cluster] = clusterEvidence([original, duplicate, contradictory, excluded]);
    expect(cluster?.demandCount).toBe(1);
    expect(cluster?.contradictoryEvidence.map((item) => item.evidenceId)).toEqual(["contra"]);
    expect(cluster?.excludedEvidence.map((item) => item.exclusionReason).sort()).toEqual(["duplicate", "explicitly-excluded"]);
  });

  it("produces a stable fingerprint with traceable source metadata", () => {
    const [cluster] = clusterEvidence([
      evidence("one", "Support escalation lacks context", "Agents repeat case diagnostics after escalation.")
    ]);
    expect(cluster?.fingerprint).toMatch(/^[a-f0-9]{64}$/u);
    expect(cluster?.exploratory).toBe(true);
    expect(cluster?.supportingEvidence[0]).toMatchObject({
      sourceUrl: "https://example.invalid/one",
      observedAt: "2026-07-29T00:00:00.000Z",
      connectorId: "fixture-connector",
      normalizedContentId: "normalized-one"
    });
  });
});
