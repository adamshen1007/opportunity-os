import { describe, expect, it } from "vitest";
import {
  embeddingFixtureChunkEmbedding
} from "@opportunity-os/embeddings";
import {
  normalizationFixtureOutput
} from "@opportunity-os/normalization";
import {
  rawContentFixtureProvenance
} from "@opportunity-os/raw-content";
import {
  llmAnalysisFixtureRequest,
  llmAnalysisFixtureResult
} from "../index.js";

describe("pipeline integration contracts", () => {
  it("references raw content provenance, normalized content, and embeddings without execution", () => {
    expect(llmAnalysisFixtureRequest.source.provenance).toBe(rawContentFixtureProvenance);
    expect(llmAnalysisFixtureRequest.source.normalizedContent).toBe(normalizationFixtureOutput);
    expect(llmAnalysisFixtureRequest.source.embeddingReferences).toEqual([
      embeddingFixtureChunkEmbedding.chunk
    ]);
  });

  it("keeps analysis result output connected to structured contracts", () => {
    expect(llmAnalysisFixtureResult.status).toBe("success");
    if (llmAnalysisFixtureResult.status === "success") {
      expect(llmAnalysisFixtureResult.response.output?.schemaName).toBe("FixtureAnalysisOutput");
      expect(llmAnalysisFixtureResult.response.metadata.validationIssues).toEqual([]);
    }
  });
});
