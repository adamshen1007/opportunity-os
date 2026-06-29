import type {
  CausationId,
  CorrelationId
} from "./event-metadata.js";

export type EventContext = {
  readonly correlationId: CorrelationId;
  readonly causationId?: CausationId;
  readonly requestId?: string;
};

export type EventContextInput = EventContext;

export function createEventContext(input: EventContextInput): EventContext {
  return {
    correlationId: input.correlationId,
    ...(input.causationId === undefined
      ? {}
      : { causationId: input.causationId }),
    ...(input.requestId === undefined ? {} : { requestId: input.requestId })
  };
}
