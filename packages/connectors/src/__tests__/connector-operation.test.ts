import { describe, expect, it } from "vitest";
import type { ConnectorOperationContract } from "../index.js";

describe("connector operation contracts", () => {
  it("supports generic input, output, pagination, and metadata", () => {
    const operation: ConnectorOperationContract<
      { readonly cursor?: string },
      readonly string[]
    > = {
      name: "list",
      input: {
        value: {
          cursor: "cursor-1"
        },
        pagination: {
          cursor: "cursor-1",
          hasMore: true,
          limit: 10
        },
        metadata: {
          startedAt: "2026-07-01T00:00:00.000Z",
          attempt: 1
        }
      },
      output: {
        value: ["item-1"],
        pagination: {
          nextCursor: "cursor-2",
          hasMore: false
        },
        metadata: {
          completedAt: "2026-07-01T00:00:01.000Z",
          durationMs: 1000
        }
      }
    };

    expect(operation.output?.pagination?.hasMore).toBe(false);
    expect(operation.input?.value.cursor).toBe("cursor-1");
  });
});
