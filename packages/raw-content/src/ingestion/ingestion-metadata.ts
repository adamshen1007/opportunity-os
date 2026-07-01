import type { CorrelationId } from "@opportunity-os/shared";
import type { RedditPaginationMetadata, RedditRateLimitMetadata } from "@opportunity-os/connectors-reddit";
import type { RawContentSafeMetadata, RawContentTimestamp } from "../source/index.js";

export type RawContentIngestionId = string;

export type RawContentConnectorMetadata = {
  readonly connectorId: string;
  readonly connectorName: string;
  readonly connectorVersion: string;
};

export type RawContentIngestionMetadata = {
  readonly ingestionId: RawContentIngestionId;
  readonly collectedAt: RawContentTimestamp;
  readonly correlationId: CorrelationId;
  readonly requestId?: string;
  readonly connector: RawContentConnectorMetadata;
  readonly pagination?: RedditPaginationMetadata;
  readonly rateLimit?: RedditRateLimitMetadata;
  readonly safeMetadata?: RawContentSafeMetadata;
};
