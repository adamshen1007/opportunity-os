import { describe, expect, it } from "vitest";
import {
  REDDIT_PROVIDER_FIXTURE_REQUEST,
  createRedditFakeTransport,
  createRedditProviderError,
  mapRedditTransportFailureToRetryDecision,
  parseRedditProviderResponse
} from "../index.js";

describe("reddit provider fake transport integration", () => {
  it("records request descriptions and returns deterministic fixture responses", async () => {
    const transport = createRedditFakeTransport();
    const result = await Promise.resolve(transport.send(REDDIT_PROVIDER_FIXTURE_REQUEST));

    expect(result.ok).toBe(true);
    expect(transport.getRequests()).toEqual([REDDIT_PROVIDER_FIXTURE_REQUEST]);
    if (!result.ok) return;

    const parsed = parseRedditProviderResponse(result.response.body);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.envelope.kind).toBe("posts");
    expect(parsed.envelope.metadata.pagination?.page.hasNextPage).toBe(true);
    expect(parsed.envelope.metadata.rateLimit?.limit).toBe(100);
  });

  it("supports safe result and error mapping without external calls", () => {
    const retry = mapRedditTransportFailureToRetryDecision({
      failure: {
        ok: false,
        safeMessage: "Fixture transport failure."
      },
      attempt: 1,
      maxAttempts: 2
    });
    const error = createRedditProviderError({
      code: "REDDIT_PROVIDER_TRANSPORT_FAILED",
      message: "Fixture transport failed safely.",
      correlationId: "corr_fake_transport",
      retry
    });

    expect(retry.decision).toBe("retry");
    expect(error.toJSON().retry).toEqual(retry);
  });
});
