import type { OpportunityRankingFactorSet } from "../factors/index.js";
import type {
  OpportunityRankingMode,
  OpportunityRankingRequestId,
  OpportunityRankingSafeMetadata,
  OpportunityRankingTimestamp,
  OpportunityRankingUpstreamReference,
  OpportunityRankingVersion
} from "./primitives.js";
import type { OpportunityRankingSignalSet } from "../signals/index.js";
import type { OpportunityRankingWeightSet } from "../weights/index.js";

export type OpportunityRankingInputContext = {
  readonly requestedAt: OpportunityRankingTimestamp;
  readonly requestedBy: string;
  readonly mode: OpportunityRankingMode;
  readonly version: OpportunityRankingVersion;
  readonly safeMetadata?: OpportunityRankingSafeMetadata;
};

export type OpportunityRankingInput = {
  readonly requestId: OpportunityRankingRequestId;
  readonly generatedOpportunities: readonly OpportunityRankingUpstreamReference[];
  readonly generationOutputs: readonly OpportunityRankingUpstreamReference[];
  readonly candidates: readonly OpportunityRankingUpstreamReference[];
  readonly signals?: OpportunityRankingSignalSet;
  readonly factors?: OpportunityRankingFactorSet;
  readonly weights?: OpportunityRankingWeightSet;
  readonly context: OpportunityRankingInputContext;
};

export type OpportunityRankingInputContract = {
  readonly input: OpportunityRankingInput;
  readonly deterministic: true;
  readonly explicitInputsOnly: true;
  readonly providerIndependent: true;
  readonly explainable: true;
};
