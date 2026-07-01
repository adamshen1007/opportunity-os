import { CONNECTOR_LIFECYCLE_PHASES } from "@opportunity-os/connectors";
import {
  type RedditLifecycleReadiness,
  type RedditLifecycleState
} from "../lifecycle/index.js";
import type { RedditValidationResult } from "../validation/index.js";

export function createRedditLifecycleReadiness(
  validation: RedditValidationResult
): RedditLifecycleReadiness {
  const ready = validation.ok;
  const safeMessage = ready
    ? "Reddit fixture runtime is ready."
    : "Reddit fixture runtime is not ready.";

  const states = CONNECTOR_LIFECYCLE_PHASES.map((phase): RedditLifecycleState => ({
    phase,
    ready,
    redditState: ready ? `${phaseToRedditState(phase)}` : "not-ready",
    safeMessage
  }));

  return { states };
}

function phaseToRedditState(
  phase: (typeof CONNECTOR_LIFECYCLE_PHASES)[number]
): Exclude<RedditLifecycleState["redditState"], "not-ready"> {
  switch (phase) {
    case "configure":
      return "config-ready";
    case "validate":
      return "metadata-ready";
    case "initialize":
      return "host-context-ready";
    case "health-check":
    case "execute-ready":
    case "shutdown":
      return "operation-contracts-ready";
  }
}
