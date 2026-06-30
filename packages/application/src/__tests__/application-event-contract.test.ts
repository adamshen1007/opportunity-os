import { describe, expect, expectTypeOf, it } from "vitest";
import type {
  EventEnvelope,
  EventPublishResult
} from "@opportunity-os/events";
import type {
  ApplicationEventDispatchPort,
  ApplicationEventPublisher,
  ApplicationEventPublisherPort
} from "../index.js";

describe("application event contracts", () => {
  it("defines event publisher ports without transport implementation", async () => {
    const publisher: ApplicationEventPublisher<{ readonly value: string }> = {
      publish: async () => ({ accepted: true })
    };

    await expect(
      publisher.publish({} as EventEnvelope<{ readonly value: string }>)
    ).resolves.toEqual({ accepted: true });
    expectTypeOf(publisher).toMatchTypeOf<
      ApplicationEventPublisherPort<{ readonly value: string }>
    >();
  });

  it("defines event dispatch boundaries without bus behavior", async () => {
    const dispatchPort: ApplicationEventDispatchPort = {
      dispatch: async () => ({ accepted: true })
    };

    const result = await dispatchPort.dispatch({
      event: {} as EventEnvelope,
      context: { correlationId: "correlation-id" }
    });

    expect(result).toEqual({ accepted: true });
    expectTypeOf(result).toEqualTypeOf<EventPublishResult>();
  });
});
