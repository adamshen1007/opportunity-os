import type { EventEnvelope } from "@opportunity-os/events";
import type { OpportunityId, OpportunitySafeMetadata } from "../opportunity/index.js";
import type { OpportunityResultStatus } from "../results/index.js";

export const OPPORTUNITY_EVENT_NAMES = {
  validated: "opportunity.validated",
  scored: "opportunity.scored",
  ranked: "opportunity.ranked",
  completed: "opportunity.completed",
  failed: "opportunity.failed"
} as const;

export type OpportunityEventName =
  (typeof OPPORTUNITY_EVENT_NAMES)[keyof typeof OPPORTUNITY_EVENT_NAMES];

export type OpportunityEventPayload = {
  readonly opportunityId: OpportunityId;
  readonly status: OpportunityResultStatus;
  readonly safeMetadata?: OpportunitySafeMetadata;
};

export type OpportunityEventEnvelope = EventEnvelope<OpportunityEventPayload>;
