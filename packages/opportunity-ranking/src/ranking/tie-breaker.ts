import type { OpportunityRankingUpstreamReference } from "./primitives.js";

export type OpportunityRankingTieBreakDecision = {
  readonly leftEntityId: string;
  readonly rightEntityId: string;
  readonly winnerEntityId: string;
  readonly reason: "entity-id-ascending" | "package-name-ascending" | "version-ascending";
  readonly explanation: string;
};

const compareText = (left: string | undefined, right: string | undefined): number =>
  (left ?? "").localeCompare(right ?? "");

export const compareOpportunityRankingReferences = (
  left: OpportunityRankingUpstreamReference,
  right: OpportunityRankingUpstreamReference
): number => {
  const entityComparison = compareText(left.entityId, right.entityId);
  if (entityComparison !== 0) {
    return entityComparison;
  }

  const packageComparison = compareText(left.packageName, right.packageName);
  if (packageComparison !== 0) {
    return packageComparison;
  }

  return compareText(left.version, right.version);
};

export const explainOpportunityRankingTieBreak = (
  left: OpportunityRankingUpstreamReference,
  right: OpportunityRankingUpstreamReference
): OpportunityRankingTieBreakDecision => {
  const entityComparison = compareText(left.entityId, right.entityId);
  const packageComparison = compareText(left.packageName, right.packageName);
  const winner = compareOpportunityRankingReferences(left, right) <= 0 ? left : right;
  const reason =
    entityComparison !== 0
      ? "entity-id-ascending"
      : packageComparison !== 0
        ? "package-name-ascending"
        : "version-ascending";

  return {
    leftEntityId: left.entityId,
    rightEntityId: right.entityId,
    winnerEntityId: winner.entityId,
    reason,
    explanation: `Tie resolved deterministically by ${reason}.`
  };
};
