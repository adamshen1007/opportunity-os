import type { EvidenceCluster } from "@opportunity-os/opportunity-pipeline";

export type SynthesizedCitedClaim = {
  readonly text: string;
  readonly citationIds: readonly string[];
};

export type SynthesizedOpportunity = {
  readonly synthesisId: string;
  readonly clusterId: string;
  readonly clusterFingerprint: string;
  readonly ruleId: string;
  readonly title: string;
  readonly targetUser: SynthesizedCitedClaim;
  readonly pain: SynthesizedCitedClaim;
  readonly context: SynthesizedCitedClaim;
  readonly currentWorkaround: SynthesizedCitedClaim;
  readonly desiredOutcome: SynthesizedCitedClaim;
  readonly supportingEvidenceIds: readonly string[];
  readonly contradictoryEvidenceIds: readonly string[];
  readonly excludedEvidenceIds: readonly string[];
  readonly assumptions: readonly string[];
  readonly limitations: readonly string[];
  readonly exploratory: boolean;
};

export type OpportunitySynthesisRejection = {
  readonly clusterId: string;
  readonly reason: "no-supporting-evidence" | "insufficient-evidence-content";
  readonly safeMessage: string;
};

export type OpportunitySynthesisResult =
  | { readonly status: "synthesized"; readonly opportunity: SynthesizedOpportunity }
  | { readonly status: "rejected"; readonly rejection: OpportunitySynthesisRejection };

function citations(cluster: EvidenceCluster): readonly string[] {
  return cluster.supportingEvidence.map((evidence) => evidence.evidenceId).sort();
}

function cited(text: string, citationIds: readonly string[]): SynthesizedCitedClaim {
  return { text, citationIds };
}

export function synthesizeEvidenceCluster(cluster: EvidenceCluster): OpportunitySynthesisResult {
  const citationIds = citations(cluster);
  if (citationIds.length === 0) {
    return {
      status: "rejected",
      rejection: {
        clusterId: cluster.clusterId,
        reason: "no-supporting-evidence",
        safeMessage: "The cluster has no supporting evidence and cannot produce an opportunity."
      }
    };
  }
  if (cluster.supportingEvidence.every((evidence) => `${evidence.title} ${evidence.text}`.trim().length < 24)) {
    return {
      status: "rejected",
      rejection: {
        clusterId: cluster.clusterId,
        reason: "insufficient-evidence-content",
        safeMessage: "The cluster does not contain enough evidence content to synthesize an opportunity."
      }
    };
  }

  const limitations = [
    ...(cluster.exploratory ? ["This is a singleton evidence cluster and remains exploratory until corroborated."] : []),
    ...(cluster.contradictoryEvidence.length > 0 ? ["Contradictory evidence is present and must be reviewed before acting."] : []),
    "Demand count reflects distinct cited source records, not market size or willingness to pay."
  ];

  return {
    status: "synthesized",
    opportunity: {
      synthesisId: `synthesis-${cluster.fingerprint.slice(0, 20)}`,
      clusterId: cluster.clusterId,
      clusterFingerprint: cluster.fingerprint,
      ruleId: cluster.ruleId,
      title: cluster.label,
      targetUser: cited(cluster.synthesisProfile.targetUser, citationIds),
      pain: cited(cluster.synthesisProfile.pain, citationIds),
      context: cited(cluster.synthesisProfile.context, citationIds),
      currentWorkaround: cited(cluster.synthesisProfile.currentWorkaround, citationIds),
      desiredOutcome: cited(cluster.synthesisProfile.desiredOutcome, citationIds),
      supportingEvidenceIds: citationIds,
      contradictoryEvidenceIds: cluster.contradictoryEvidence.map((evidence) => evidence.evidenceId).sort(),
      excludedEvidenceIds: cluster.excludedEvidence.map((evidence) => evidence.evidenceId).sort(),
      assumptions: [
        "The cited evidence represents a recurring workflow rather than an isolated report.",
        "The desired outcome requires design-partner validation before implementation."
      ],
      limitations,
      exploratory: cluster.exploratory
    }
  };
}

export function synthesizeEvidenceClusters(clusters: readonly EvidenceCluster[]): readonly OpportunitySynthesisResult[] {
  return [...clusters].sort((left, right) => left.clusterId.localeCompare(right.clusterId)).map(synthesizeEvidenceCluster);
}
