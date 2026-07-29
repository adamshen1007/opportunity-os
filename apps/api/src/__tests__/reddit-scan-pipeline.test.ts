import { describe, expect, it } from "vitest";
import {
  createLocalApiDispatcher,
  createInMemoryScanPersistenceStore,
  createOwnerScope,
  handleCreateRedditScanRequest,
  runOpportunityScanPipeline,
  type ApiScanResultDto
} from "../index.js";

const requestContext = {
  correlationId: "correlation-scan-test",
  requestId: "request-scan-test",
  method: "POST",
  path: "/scans/reddit",
  ownership: createOwnerScope("principal-reddit-test")
};

describe("Reddit end-to-end opportunity scan pipeline", () => {
  it("runs the default fixture path through all MVP stages", async () => {
    const result = await runOpportunityScanPipeline({
      subreddit: "opportunity",
      query: "manual review",
      limit: 5,
      mode: "fixture",
      correlationId: requestContext.correlationId,
      requestId: requestContext.requestId,
      requestedAt: "2026-07-07T00:00:00.000Z",
      env: {}
    });

    expect(result.mode).toBe("fixture");
    expect(result.stages.map((stage) => stage.name)).toEqual([
      "source",
      "raw-content",
      "normalization",
      "llm-analysis",
      "candidate-generation",
      "opportunity-generation",
      "ranking"
    ]);
    expect(result.opportunities.length).toBeGreaterThan(0);
    expect(result.opportunities[0]?.evidence[0]?.provenance).toMatchObject({
      sourcePlatform: "reddit",
      normalizedContentId: expect.stringContaining("normalized-"),
      analysisRequestId: expect.stringContaining("analysis-")
    });
    expect(result.opportunities[0]?.synthesis.targetUser.citationIds.length).toBeGreaterThan(0);
    expect(result.opportunities[0]?.provenance).toMatchObject({
      clusterId: expect.stringContaining("evidence-cluster-"),
      clusterFingerprint: expect.any(String),
      sourceItemIds: expect.arrayContaining(["post_fixture"])
    });
    expect(result.opportunities[0]?.provenance).toMatchObject({
      sourceItemId: "post_fixture",
      redditPostId: "post_fixture",
      rawContentId: "raw-post-post_fixture",
      rankingRunId: "mvp-scan-ranking-run"
    });
    expect(result.safeMetadata.evidenceClusterCount).toBe(result.opportunities.length);
  });

  it("keeps live mode env-gated and fails closed instead of relabeling fixtures as live", async () => {
    await expect(runOpportunityScanPipeline({
      subreddit: "opportunity",
      limit: 1,
      mode: "live",
      correlationId: requestContext.correlationId,
      requestedAt: "2026-07-07T00:00:00.000Z",
      env: {
        REDDIT_LIVE_TEST_ENABLED: "false",
        LLM_LIVE_ANALYSIS_ENABLED: "false"
      }
    })).rejects.toThrow("Live Reddit configuration is unavailable. No result was saved.");
  });

  it("does not leak unsafe provider, credential, or runtime details", async () => {
    const result = await runOpportunityScanPipeline({
      subreddit: "opportunity",
      limit: 1,
      mode: "fixture",
      correlationId: requestContext.correlationId,
      requestedAt: "2026-07-07T00:00:00.000Z",
      env: {
        OPENAI_API_KEY: "sk-unsafe-secret",
        REDDIT_PRODUCTION_CLIENT_SECRET: "unsafe-client-secret"
      }
    });
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("sk-unsafe-secret");
    expect(serialized).not.toContain("unsafe-client-secret");
    expect(serialized).not.toMatch(/authorization|bearer|access_token|refresh_token|stack trace|raw cause/iu);
  });

  it("exposes the scan through a safe API route and local dispatcher", async () => {
    const persistence = createInMemoryScanPersistenceStore();
    const routeResponse = await handleCreateRedditScanRequest({
      context: requestContext,
      body: {
        subreddit: "opportunity",
        query: "manual review",
        limit: 1
      }
    }, persistence);
    expect(routeResponse.ok).toBe(true);
    expect(routeResponse.ok ? routeResponse.data.opportunities.length : 0).toBe(1);
    if (routeResponse.ok) {
      await expect(persistence.resolveOpportunityRecordId(requestContext.ownership!, routeResponse.data.opportunities[0]!.opportunityId)).resolves.toBe(
        `${routeResponse.data.scanId}:${routeResponse.data.opportunities[0]!.provenance.generationOutputId}`
      );
    }

    const dispatch = createLocalApiDispatcher({
      serviceName: "opportunity-os-api-test",
      version: "test",
      environment: "local",
      clock: () => "2026-07-07T00:00:00.000Z"
    });
    const dispatched = await dispatch({
      method: "POST",
      path: "/scans/reddit",
      body: {
        subreddit: "opportunity",
        limit: 1
      },
      headers: {
        "x-correlation-id": requestContext.correlationId
      }
    });

    expect(dispatched.ok).toBe(true);
    expect(dispatched.ok ? dispatched.data : undefined).toMatchObject({
      source: {
        provider: "reddit",
        subreddit: "opportunity",
        itemCount: 1
      }
    });
  });

  it("returns validation errors for unsafe scan inputs", async () => {
    const response = await handleCreateRedditScanRequest({
      context: requestContext,
      body: {
        subreddit: "not valid!",
        limit: 999
      }
    });

    expect(response.ok).toBe(false);
    expect(response.ok ? undefined : response.error.details).toEqual(["subreddit:invalid", "limit:invalid"]);
  });

  it("runs a source-neutral Stack Exchange scan through the same pipeline", async () => {
    const dispatch = createLocalApiDispatcher({
      clock: () => "2026-07-07T00:00:00.000Z"
    });
    const response = await dispatch({
      method: "POST",
      path: "/scans",
      body: {
        source: "stack-exchange",
        site: "stackoverflow",
        query: "manual deployment",
        tags: ["deployment"],
        limit: 1,
        mode: "fixture"
      }
    });
    expect(response.ok).toBe(true);
    if (!response.ok) return;
    const data = response.data as ApiScanResultDto;
    expect(data).toMatchObject({
      mode: "fixture",
      source: {
        provider: "stack-exchange",
        site: "stackoverflow",
        attribution: "Stack Exchange",
        itemCount: 1
      }
    });
    expect(data.opportunities[0]?.evidence[0]).toMatchObject({
      sourceType: "stack-exchange",
      provenance: { sourcePlatform: "stack-exchange" }
    });
    expect(JSON.stringify(data)).not.toMatch(/api[_-]?key|authorization|bearer|raw provider/iu);
  });
});
