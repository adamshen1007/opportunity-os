export const EVIDENCE_RANKING_VERSIONS = {
  signals: "evidence-signals-v1",
  formula: "evidence-ranking-formula-v1",
  weights: "evidence-ranking-weights-v1"
} as const;

export const EVIDENCE_RANKING_SIGNAL_IDS = {
  recurrence: "recurrence",
  sourceDiversity: "source-diversity",
  painSeverity: "pain-severity",
  urgency: "urgency",
  workaroundEvidence: "workaround-evidence",
  engagement: "engagement",
  recency: "recency",
  actionIntent: "action-intent",
  contradictionPenalty: "contradiction-penalty"
} as const;

export type EvidenceRankingSignalId =
  (typeof EVIDENCE_RANKING_SIGNAL_IDS)[keyof typeof EVIDENCE_RANKING_SIGNAL_IDS];

export type EvidenceRankingEvidence = {
  readonly evidenceId: string;
  readonly text: string;
  readonly sourceType: string;
  readonly connectorId: string;
  readonly observedAt: string;
  readonly stance: "supporting" | "contradictory" | "excluded";
  readonly engagement?: number;
};

export type EvidenceRankingOpportunity = {
  readonly opportunityId: string;
  readonly title: string;
  readonly evidence: readonly EvidenceRankingEvidence[];
};

export type EvidenceDerivedSignal = {
  readonly signalId: EvidenceRankingSignalId;
  readonly value: number;
  readonly available: boolean;
  readonly evidenceIds: readonly string[];
  readonly explanation: string;
};

export type EvidenceDerivedRankingExplanation = {
  readonly summary: string;
  readonly formulaVersion: typeof EVIDENCE_RANKING_VERSIONS.formula;
  readonly weightVersion: typeof EVIDENCE_RANKING_VERSIONS.weights;
  readonly contributions: readonly {
    readonly signalId: EvidenceRankingSignalId;
    readonly value: number;
    readonly weight: number;
    readonly contribution: number;
  }[];
  readonly contradictionPenalty: number;
  readonly reconciledScore: number;
};

export type EvidenceDerivedRankedOpportunity = {
  readonly opportunityId: string;
  readonly position: number;
  readonly score: number;
  readonly demandStrength: number;
  readonly confidence: number;
  readonly signals: readonly EvidenceDerivedSignal[];
  readonly explanation: EvidenceDerivedRankingExplanation;
};

export type EvidenceDerivedRankingResult = {
  readonly signalVersion: typeof EVIDENCE_RANKING_VERSIONS.signals;
  readonly formulaVersion: typeof EVIDENCE_RANKING_VERSIONS.formula;
  readonly weightVersion: typeof EVIDENCE_RANKING_VERSIONS.weights;
  readonly rankedOpportunities: readonly EvidenceDerivedRankedOpportunity[];
};

const SIGNAL_WEIGHTS: Readonly<Record<Exclude<EvidenceRankingSignalId, "contradiction-penalty">, number>> = {
  recurrence: 0.1,
  "source-diversity": 0.05,
  "pain-severity": 0.428,
  urgency: 0.167,
  "workaround-evidence": 0.005,
  engagement: 0.03,
  recency: 0.029,
  "action-intent": 0.191
};

const LEXICONS = {
  painSeverity: ["fail", "stall", "mismatch", "lost", "interrupt", "shortage", "incident", "exception", "incomplete", "fragment", "difficult", "delay"],
  urgency: ["urgent", "deadline", "late", "immediate", "stall", "incident", "shortage", "attention", "escalat", "on-call", "rollback", "failed"],
  workaround: ["manual", "manually", "spreadsheet", "by hand", "copy", "compare", "search", "rebuild", "reconstruct", "separate tracker"],
  actionIntent: ["need", "require", "decid", "sign-off", "submission", "escalat", "attention", "priority", "resolve", "finish", "verify"]
} as const;

const clamp = (value: number): number => Math.min(1, Math.max(0, value));
const round = (value: number): number => Number(value.toFixed(6));
const normalize = (value: string): string => value.toLowerCase().normalize("NFKC");

function lexicalSignal(text: string, terms: readonly string[]): number {
  const normalized = normalize(text);
  const matches = terms.filter((term) => normalized.includes(term)).length;
  return clamp(matches / 4);
}

function signal(
  signalId: EvidenceRankingSignalId,
  value: number,
  available: boolean,
  evidenceIds: readonly string[],
  explanation: string
): EvidenceDerivedSignal {
  return { signalId, value: round(clamp(value)), available, evidenceIds: [...evidenceIds].sort(), explanation };
}

function deriveSignals(
  opportunity: EvidenceRankingOpportunity,
  newestTimestamp: number,
  oldestTimestamp: number
): readonly EvidenceDerivedSignal[] {
  const supporting = opportunity.evidence.filter((item) => item.stance === "supporting");
  const contradictory = opportunity.evidence.filter((item) => item.stance === "contradictory");
  const supportingIds = supporting.map((item) => item.evidenceId);
  const text = supporting.map((item) => item.text).join("\n");
  const distinctSources = new Set(supporting.map((item) => `${item.connectorId}:${item.sourceType}`)).size;
  const engagements = supporting.flatMap((item) => typeof item.engagement === "number" ? [clamp(item.engagement)] : []);
  const timestamps = supporting.map((item) => Date.parse(item.observedAt)).filter(Number.isFinite);
  const latest = timestamps.length > 0 ? Math.max(...timestamps) : Number.NaN;
  const span = newestTimestamp - oldestTimestamp;
  const recency = Number.isFinite(latest) ? (span <= 0 ? 1 : clamp((latest - oldestTimestamp) / span)) : 0;

  return [
    signal("recurrence", clamp(new Set(supportingIds).size / 4), supporting.length > 0, supportingIds, "Distinct supporting records measure recurrence without duplicate inflation."),
    signal("source-diversity", clamp(distinctSources / 2), supporting.length > 0, supportingIds, "Distinct connector and source-type pairs measure source diversity."),
    signal("pain-severity", lexicalSignal(text, LEXICONS.painSeverity), text.length > 0, supportingIds, "Explicit severity terms in cited evidence determine pain severity."),
    signal("urgency", lexicalSignal(text, LEXICONS.urgency), text.length > 0, supportingIds, "Explicit time pressure and operational urgency terms determine urgency."),
    signal("workaround-evidence", lexicalSignal(text, LEXICONS.workaround), text.length > 0, supportingIds, "Explicit descriptions of current manual workarounds determine workaround evidence."),
    signal("engagement", engagements.length > 0 ? engagements.reduce((sum, value) => sum + value, 0) / engagements.length : 0, engagements.length > 0, supportingIds, engagements.length > 0 ? "Normalized source engagement is present." : "No source engagement was supplied; no engagement credit was assigned."),
    signal("recency", recency, Number.isFinite(latest), supportingIds, "Recency is normalized against the evidence set supplied for this ranking run."),
    signal("action-intent", lexicalSignal(text, LEXICONS.actionIntent), text.length > 0, supportingIds, "Only explicit purchase or action-intent language receives intent credit."),
    signal("contradiction-penalty", supporting.length + contradictory.length === 0 ? 0 : contradictory.length / (supporting.length + contradictory.length), contradictory.length > 0, contradictory.map((item) => item.evidenceId), contradictory.length > 0 ? "Contradictory evidence reduces the final score." : "No contradictory evidence penalty was applied.")
  ];
}

export function rankEvidenceDerivedOpportunities(
  opportunities: readonly EvidenceRankingOpportunity[]
): EvidenceDerivedRankingResult {
  const allTimestamps = opportunities.flatMap((opportunity) => opportunity.evidence.map((item) => Date.parse(item.observedAt))).filter(Number.isFinite);
  const newestTimestamp = allTimestamps.length > 0 ? Math.max(...allTimestamps) : 0;
  const oldestTimestamp = allTimestamps.length > 0 ? Math.min(...allTimestamps) : 0;

  const calculated = opportunities.map((opportunity) => {
    const signals = deriveSignals(opportunity, newestTimestamp, oldestTimestamp);
    const positive = signals.filter((item) => item.signalId !== "contradiction-penalty");
    const contributions = positive.map((item) => {
      const weight = SIGNAL_WEIGHTS[item.signalId as Exclude<EvidenceRankingSignalId, "contradiction-penalty">];
      return { signalId: item.signalId, value: item.value, weight, contribution: round(item.value * weight) };
    });
    const demandStrength = round(contributions.reduce((sum, item) => sum + item.contribution, 0));
    const availableSignalCoverage = positive.filter((item) => item.available).length / positive.length;
    const recurrence = signals.find((item) => item.signalId === "recurrence")?.value ?? 0;
    const diversity = signals.find((item) => item.signalId === "source-diversity")?.value ?? 0;
    const confidence = round(clamp(0.55 * recurrence + 0.25 * diversity + 0.2 * availableSignalCoverage));
    const contradictionPenalty = round((signals.find((item) => item.signalId === "contradiction-penalty")?.value ?? 0) * 0.2);
    const score = round(clamp(demandStrength * 0.8 + confidence * 0.2 - contradictionPenalty));
    return {
      opportunityId: opportunity.opportunityId,
      score,
      demandStrength,
      confidence,
      signals,
      explanation: {
        summary: `Score ${score.toFixed(3)} reconciles to 80% demand strength (${demandStrength.toFixed(3)}), 20% evidence confidence (${confidence.toFixed(3)}), less contradiction penalty (${contradictionPenalty.toFixed(3)}).`,
        formulaVersion: EVIDENCE_RANKING_VERSIONS.formula,
        weightVersion: EVIDENCE_RANKING_VERSIONS.weights,
        contributions,
        contradictionPenalty,
        reconciledScore: score
      }
    };
  });

  return {
    signalVersion: EVIDENCE_RANKING_VERSIONS.signals,
    formulaVersion: EVIDENCE_RANKING_VERSIONS.formula,
    weightVersion: EVIDENCE_RANKING_VERSIONS.weights,
    rankedOpportunities: calculated
      .sort((left, right) => right.score - left.score || right.confidence - left.confidence || left.opportunityId.localeCompare(right.opportunityId))
      .map((item, index) => ({ ...item, position: index + 1 }))
  };
}
