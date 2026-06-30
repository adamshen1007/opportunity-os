import type { EventEnvelope } from "@opportunity-os/events";
import type { ApplicationContext } from "../context/index.js";

export type ApplicationEventDispatchInput<TPayload = unknown> = {
  readonly event: EventEnvelope<TPayload>;
  readonly context: ApplicationContext;
};

export type ApplicationEventDispatchResult = {
  readonly accepted: boolean;
};

export type ApplicationEventDispatchPort<TPayload = unknown> = {
  readonly dispatch: (
    input: ApplicationEventDispatchInput<TPayload>
  ) => ApplicationEventDispatchResult | Promise<ApplicationEventDispatchResult>;
};
