import { describe, expect, it } from "vitest";
import { STACK_EXCHANGE_FIXTURE_RESULT } from "@opportunity-os/connectors-stack-exchange";
import { mapStackExchangeQuestionToRawContent } from "../index.js";

describe("Stack Exchange to Raw Content mapping", () => {
  it("preserves attribution and provenance without raw provider payloads", () => {
    const question = STACK_EXCHANGE_FIXTURE_RESULT.items[0]!;
    const envelope = mapStackExchangeQuestionToRawContent({
      question,
      ingestion: {
        ingestionId: "ingestion-stack-exchange-fixture",
        collectedAt: "2026-07-12T00:00:00.000Z",
        correlationId: "correlation-stack-exchange-fixture" as never,
        connector: {
          connectorId: "stack-exchange",
          connectorName: "Stack Exchange",
          connectorVersion: "1.0.0"
        }
      },
      recordedAt: "2026-07-12T00:00:00.000Z"
    });
    expect(envelope.content.source.platform).toBe("stack-exchange");
    expect(envelope.content.permalink).toBe(question.permalink);
    expect(envelope.provenance).toMatchObject({
      collectedThrough: "stack-exchange-provider-transport",
      safeMetadata: { attribution: "Stack Exchange", rawProviderPayloadStored: false }
    });
    expect(JSON.stringify(envelope)).not.toMatch(/api[_-]?key|authorization|bearer|raw provider payload/iu);
  });
});
