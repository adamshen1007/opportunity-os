import type {
  RawContentEnvelope,
  RawContentSafeMetadata
} from "@opportunity-os/raw-content";
import type { NormalizationStage } from "./normalization-stage.js";

export type NormalizationInput<TEnvelope extends RawContentEnvelope = RawContentEnvelope> = {
  readonly envelope: TEnvelope;
  readonly requestedStages: readonly NormalizationStage[];
  readonly safeMetadata?: RawContentSafeMetadata;
};
