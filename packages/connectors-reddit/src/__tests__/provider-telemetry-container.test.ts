import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_API_CLIENT_TOKEN,
  REDDIT_PROVIDER_BINDING_CONTRACT,
  REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES,
  REDDIT_PROVIDER_TRANSPORT_TOKEN
} from "../index.js";
import type {
  RedditProviderModuleRegistration,
  RedditProviderTelemetryContract
} from "../index.js";

describe("reddit provider telemetry and container binding contracts", () => {
  it("defines safe telemetry events referencing shared logging and events", () => {
    const telemetry: RedditProviderTelemetryContract = {
      events: [
        {
          eventName: "reddit.provider.response.parsed",
          timestamp: "2026-07-01T00:00:00.000Z",
          correlationId: "corr_telemetry",
          requestId: "req_telemetry",
          safeMessage: "Provider response parsed safely.",
          payload: {
            itemCount: 1,
            endpoint: "posts"
          },
          logEntry: {
            correlationId: "corr_telemetry",
            requestId: "req_telemetry",
            eventName: "reddit.provider.response.parsed",
            message: "Provider response parsed safely.",
            severity: "info"
          },
          eventMetadata: {
            eventName: "reddit.provider.response.parsed",
            correlationId: "corr_telemetry",
            requestId: "req_telemetry",
            source: "reddit-provider"
          }
        }
      ]
    };
    const serialized = JSON.stringify(telemetry);

    expect(REDDIT_PROVIDER_TELEMETRY_EVENT_NAMES).toEqual([
      "reddit.provider.request.described",
      "reddit.provider.response.parsed",
      "reddit.provider.policy.mapped",
      "reddit.provider.auth.lifecycle.changed",
      "reddit.provider.error.mapped"
    ]);
    expect(serialized).not.toContain("token");
    expect(serialized).not.toContain("authorization");
  });

  it("defines container binding contracts without runtime resolution", () => {
    const moduleRegistration: RedditProviderModuleRegistration = {
      id: "reddit-provider-transport",
      description: "Reddit provider transport binding contract.",
      exports: [REDDIT_PROVIDER_TRANSPORT_TOKEN, REDDIT_PROVIDER_API_CLIENT_TOKEN],
      registrations: []
    };

    expect(REDDIT_PROVIDER_BINDING_CONTRACT).toEqual({
      transportToken: REDDIT_PROVIDER_TRANSPORT_TOKEN,
      apiClientToken: REDDIT_PROVIDER_API_CLIENT_TOKEN,
      registrations: []
    });
    expect(moduleRegistration.exports).toEqual([
      REDDIT_PROVIDER_TRANSPORT_TOKEN,
      REDDIT_PROVIDER_API_CLIENT_TOKEN
    ]);
  });
});
