import type { StackExchangeQuestion } from "@opportunity-os/connectors-stack-exchange";
import type { RawContentEnvelope, RawContentPost } from "../content/index.js";
import type { RawContentIngestionMetadata } from "../ingestion/index.js";

export interface StackExchangeRawContentMappingInput {
  readonly question: StackExchangeQuestion;
  readonly ingestion: RawContentIngestionMetadata;
  readonly recordedAt: string;
}

export function mapStackExchangeQuestionToRawContent(
  input: StackExchangeRawContentMappingInput
): RawContentEnvelope<RawContentPost> {
  const source = {
    platform: "stack-exchange" as const,
    objectKind: "post" as const,
    objectId: input.question.id,
    url: input.question.permalink,
    collectedAt: input.recordedAt,
    publishedAt: input.question.createdAt,
    updatedAt: input.question.updatedAt,
    safeProviderMetadata: {
      kind: "safe-provider-metadata" as const,
      redacted: true as const,
      source: "stack-exchange" as const,
      fields: {
        site: input.question.site,
        score: input.question.score,
        answerCount: input.question.answerCount,
        attributionRequired: true
      }
    }
  };
  const provenance = {
    source,
    ingestion: input.ingestion,
    providerReference: {
      platform: "stack-exchange" as const,
      objectId: input.question.id,
      objectUrl: input.question.permalink
    },
    collectedThrough: "stack-exchange-provider-transport" as const,
    transformBoundary: "raw-content-contract" as const,
    recordedAt: input.recordedAt,
    safeMetadata: {
      attribution: "Stack Exchange",
      rawProviderPayloadStored: false
    }
  };
  const post: RawContentPost = {
    id: `stack-exchange-question-${input.question.id}`,
    title: input.question.title,
    bodyText: input.question.bodyText,
    author: {
      id: input.question.author.id ?? `stack-exchange-author-${input.question.id}`,
      handle: input.question.author.displayName,
      source
    },
    community: {
      id: input.question.site,
      name: input.question.site,
      source
    },
    permalink: input.question.permalink,
    metrics: {
      score: input.question.score,
      commentCount: input.question.answerCount
    },
    createdAt: input.question.createdAt,
    updatedAt: input.question.updatedAt,
    source,
    ingestion: input.ingestion,
    provenance,
    safeMetadata: {
      tags: input.question.tags.join(","),
      attribution: "Stack Exchange"
    }
  };
  return {
    kind: "post",
    version: "1.0.0",
    content: post,
    ingestion: input.ingestion,
    provenance,
    safeMetadata: {
      attribution: "Stack Exchange",
      rawProviderPayloadStored: false
    }
  };
}
