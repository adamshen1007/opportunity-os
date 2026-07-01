import { describe, expect, it } from "vitest";
import {
  REDDIT_FAKE_HOST_CONTEXT,
  REDDIT_HTTP_METHODS,
  createRedditProviderRequestDescription
} from "../index.js";
import type {
  RedditApiClient,
  RedditApiClientContext,
  RedditHttpTransport,
  RedditTransportRequest,
  RedditTransportResponseMetadata
} from "../index.js";

describe("reddit provider transport and api client contracts", () => {
  it("defines transport requests with timeout, cancellation, body, and safe response metadata", async () => {
    const capturedRequests: RedditTransportRequest[] = [];
    const metadata: RedditTransportResponseMetadata = {
      status: 200,
      statusText: "OK",
      receivedAt: "2026-07-01T00:00:00.000Z",
      durationMs: 12,
      safeSource: "fixture-transport"
    };
    const transport: RedditHttpTransport = {
      send: <TBody = unknown>(request: RedditTransportRequest) => {
        capturedRequests.push(request);

        return {
          ok: true,
          response: {
            body: { ok: true } as TBody,
            metadata
          }
        };
      }
    };
    const request: RedditTransportRequest = {
      method: "POST",
      url: "https://provider.example/posts",
      headers: [{ name: "content-type", value: "application/json" }],
      body: { cursor: "cursor_001" },
      timeoutMs: 1000,
      cancellationSignal: {
        cancelled: false
      }
    };

    expect(REDDIT_HTTP_METHODS).toEqual(["GET", "POST", "PUT", "PATCH", "DELETE"]);
    await expect(Promise.resolve(transport.send(request))).resolves.toEqual({
      ok: true,
      response: {
        body: { ok: true },
        metadata
      }
    });
    expect(capturedRequests).toEqual([request]);
  });

  it("models api clients with explicit transport, auth context, runtime context, and logger", async () => {
    const transport: RedditHttpTransport = {
      send: <TBody = unknown>() => ({
        ok: true,
        response: {
          body: { items: [] } as TBody,
          metadata: {
            status: 200,
            safeSource: "fixture-transport"
          }
        }
      })
    };
    const context: RedditApiClientContext = {
      transport,
      auth: {
        status: "token-valid",
        token: {
          tokenType: "bearer",
          accessToken: { value: "raw-access-token", sensitive: true }
        }
      },
      runtimeContext: REDDIT_FAKE_HOST_CONTEXT
    };
    const client: RedditApiClient = {
      context,
      describe: createRedditProviderRequestDescription,
      execute: async (request) => ({
        ...(await transport.send(request.description)),
        description: request.description
      })
    };
    const description = client.describe({
      endpoint: "authors",
      baseUrl: "https://provider.example",
      auth: {
        scheme: "Bearer",
        token: { value: "raw-access-token", sensitive: true }
      },
      correlationId: "corr_api_client"
    });
    const result = await client.execute({ description });

    expect(result.ok).toBe(true);
    expect(result.description.endpoint).toBe("authors");
    expect(JSON.stringify(result)).not.toContain("raw-access-token");
  });
});
