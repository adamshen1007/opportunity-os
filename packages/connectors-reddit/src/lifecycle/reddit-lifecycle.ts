import type {
  ConnectorLifecyclePhase,
  ConnectorLifecycleState
} from "@opportunity-os/connectors";

export const REDDIT_LIFECYCLE_READINESS_STATES = [
  "metadata-ready",
  "config-ready",
  "host-context-ready",
  "operation-contracts-ready",
  "not-ready"
] as const;

export type RedditLifecycleStateName =
  (typeof REDDIT_LIFECYCLE_READINESS_STATES)[number];

export type RedditLifecycleState = ConnectorLifecycleState & {
  readonly redditState: RedditLifecycleStateName;
  readonly phase: ConnectorLifecyclePhase;
  readonly safeMessage: string;
};

export type RedditLifecycleReadiness = {
  readonly states: readonly RedditLifecycleState[];
};
