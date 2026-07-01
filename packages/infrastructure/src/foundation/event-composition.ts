import type {
  EventConsumer,
  EventPublisher,
  EventSchema
} from "@opportunity-os/events";

export type EventCompositionContract<TPayload = unknown> = {
  readonly packageName: "@opportunity-os/events";
  readonly publisher?: EventPublisher<TPayload>;
  readonly consumers?: readonly EventConsumer<TPayload>[];
  readonly schemas?: readonly EventSchema<TPayload>[];
};
