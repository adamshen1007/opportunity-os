import type {
  RawContentEnvelope,
  RawContentProvenance,
  RawContentSafeMetadata
} from "@opportunity-os/raw-content";
import type { CanonicalText } from "../text/index.js";
import type { NormalizationStageRecord } from "./normalization-stage.js";

export type NormalizationOutput<TEnvelope extends RawContentEnvelope = RawContentEnvelope> = {
  readonly sourceEnvelope: TEnvelope;
  readonly canonicalText: CanonicalText;
  readonly provenance: RawContentProvenance;
  readonly stages: readonly NormalizationStageRecord[];
  readonly safeMetadata?: RawContentSafeMetadata;
};
