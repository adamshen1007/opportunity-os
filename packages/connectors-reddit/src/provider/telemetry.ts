import type { EventEnvelope, EventMetadata } from "@opportunity-os/events";
import type { LogEntry } from "@opportunity-os/shared";

export const REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES = [
  "reddit.provider.request.described",
  "reddit.provider.response.parsed",
  "reddit.provider.policy.mapped",
  "reddit.provider.auth.lifecycle.changed",
  "reddit.provider.error.mapped"
] as const;

export type RedditProviderTelemetryEventName =
  (typeof REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES)[number];

export type RedditProviderTelemetryPayload = Readonly<
  Record<string, string | number | boolean | null>
>;

export type RedditProviderTelemetryEvent = {
  readonly eventName: RedditProviderTelemetryEventName;
  readonly timestamp: string;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly safeMessage: string;
  readonly payload?: RedditProviderTelemetryPayload;
  readonly logEntry?: Pick<
    LogEntry,
    "correlationId" | "eventName" | "message" | "requestId" | "severity"
  >;
  readonly eventMetadata?: Pick<EventMetadata, "eventName" | "correlationId" | "requestId" | "source">;
  readonly eventEnvelope?: Pick<EventEnvelope, "metadata">;
};

export type RedditProviderTelemetryContract = {
  readonly events: readonly RedditProviderTelemetryEvent[];
};
