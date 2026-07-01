import { describe, expect, it } from "vitest";
import {
  REDDIT_OPERATION_NAMES,
  REDDIT_FAKE_POST,
  REDDIT_FAKE_PAGINATION,
  REDDIT_FAKE_RATE_LIMIT
} from "../index.js";
import type { RedditOperationContract } from "../index.js";

describe("reddit operation contracts", () => {
  it("declares stable read operation names", () => {
    expect(REDDIT_OPERATION_NAMES).toEqual([
      "reddit.read.posts",
      "reddit.read.comments",
      "reddit.read.subreddits",
      "reddit.read.authors"
    ]);
  });

  it("uses Reddit data envelopes for outputs", () => {
    const operation: RedditOperationContract = {
      name: "reddit.read.posts",
      input: {
        value: {
          operationName: "reddit.read.posts",
          filters: {
            subredditName: "opportunity"
          }
        }
      },
      output: {
        value: {
          kind: "posts",
          items: [REDDIT_FAKE_POST],
          metadata: {
            pagination: REDDIT_FAKE_PAGINATION,
            rateLimit: REDDIT_FAKE_RATE_LIMIT
          }
        }
      }
    };

    expect(operation.output?.value.kind).toBe("posts");
    expect(operation.output?.value.items).toEqual([REDDIT_FAKE_POST]);
  });
});
