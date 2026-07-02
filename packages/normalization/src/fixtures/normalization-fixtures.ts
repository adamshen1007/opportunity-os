import type {
  NormalizationEventEnvelope,
  NormalizationRequestedPayload
} from "../events/index.js";
import type { LanguageDetectionContract } from "../language/index.js";
import type { NormalizationInput, NormalizationOutput } from "../pipeline/index.js";
import type {
  MetadataPreservationContract,
  ProvenancePreservationContract
} from "../preservation/index.js";
import type { NormalizationResult } from "../results/index.js";
import type { CanonicalText } from "../text/index.js";
import type { TextChunkingContract } from "../chunking/index.js";
import {
  rawContentFixturePostEnvelope,
  rawContentFixtureProvenance
} from "@opportunity-os/raw-content";

export const NORMALIZATION_FIXTURE_TIMESTAMP = "2026-07-02T00:00:00.000Z" as const;

export const NORMALIZATION_FIXTURE_IDS = {
  canonicalTextId: "canonical_text_fixture_001",
  segmentId: "text_segment_fixture_001",
  chunkId: "text_chunk_fixture_001",
  correlationId: "corr_normalization_fixture_001",
  eventId: "event_normalization_fixture_001"
} as const;

export const normalizationFixtureCanonicalText: CanonicalText = {
  id: NORMALIZATION_FIXTURE_IDS.canonicalTextId,
  version: "1.0.0",
  format: "plain-text",
  sourceKind: "post",
  source: rawContentFixturePostEnvelope.content.source,
  text: "Fixture post for raw content contracts\n\nThis deterministic fixture contains only safe public text.",
  segments: [
    {
      id: NORMALIZATION_FIXTURE_IDS.segmentId,
      order: 0,
      text: "Fixture post for raw content contracts",
      range: {
        start: 0,
        end: 38
      },
      sourceRange: {
        start: 0,
        end: 38
      },
      safeMetadata: {
        fixture: true
      }
    }
  ],
  normalizedAt: NORMALIZATION_FIXTURE_TIMESTAMP,
  safeMetadata: {
    fixture: true,
    payloadStored: false
  }
};

export const normalizationFixtureInput: NormalizationInput = {
  envelope: rawContentFixturePostEnvelope,
  requestedStages: [
    "canonical-text-model",
    "markdown-cleaning",
    "html-cleaning",
    "unicode-normalization",
    "whitespace-normalization",
    "url-normalization",
    "language-detection",
    "text-chunking",
    "metadata-preservation",
    "provenance-preservation",
    "validation"
  ],
  safeMetadata: {
    fixture: true
  }
};

export const normalizationFixtureOutput: NormalizationOutput = {
  sourceEnvelope: rawContentFixturePostEnvelope,
  canonicalText: normalizationFixtureCanonicalText,
  provenance: rawContentFixtureProvenance,
  stages: [
    {
      stage: "canonical-text-model",
      status: "completed",
      safeMessage: "Canonical text fixture is available."
    },
    {
      stage: "validation",
      status: "completed",
      safeMessage: "Normalization fixture validation succeeded."
    }
  ],
  safeMetadata: {
    fixture: true
  }
};

export const normalizationFixtureLanguageDetection: LanguageDetectionContract = {
  stage: "language-detection",
  inputTextId: NORMALIZATION_FIXTURE_IDS.canonicalTextId,
  detectedLanguages: [
    {
      languageTag: "en",
      confidence: "high",
      method: "declared-metadata"
    }
  ],
  primaryLanguage: {
    languageTag: "en",
    confidence: "high",
    method: "declared-metadata"
  },
  safeMetadata: {
    fixture: true
  }
};

export const normalizationFixtureChunking: TextChunkingContract = {
  stage: "text-chunking",
  canonicalTextId: NORMALIZATION_FIXTURE_IDS.canonicalTextId,
  options: {
    strategy: "paragraph-boundary",
    maxCharacters: 2000,
    overlapCharacters: 0,
    preserveSegmentBoundaries: true
  },
  chunks: [
    {
      id: NORMALIZATION_FIXTURE_IDS.chunkId,
      canonicalTextId: NORMALIZATION_FIXTURE_IDS.canonicalTextId,
      order: 0,
      text: normalizationFixtureCanonicalText.text,
      range: {
        start: 0,
        end: normalizationFixtureCanonicalText.text.length
      },
      sourceSegmentIds: [NORMALIZATION_FIXTURE_IDS.segmentId],
      strategy: "paragraph-boundary",
      safeMetadata: {
        fixture: true
      }
    }
  ],
  safeMetadata: {
    fixture: true
  }
};

export const normalizationFixtureMetadataPreservation: MetadataPreservationContract = {
  stage: "metadata-preservation",
  records: [
    {
      policy: "preserve-safe-source-metadata",
      sourcePath: ["content", "source"],
      targetPath: ["canonicalText", "source"],
      preserved: true,
      safeMessage: "Safe source metadata preserved for fixture."
    },
    {
      policy: "drop-unsafe-provider-payload",
      sourcePath: ["provider", "rawPayload"],
      targetPath: [],
      preserved: false,
      safeMessage: "Raw provider payload is excluded from fixture output."
    }
  ],
  safeMetadata: {
    fixture: true
  }
};

export const normalizationFixtureProvenancePreservation: ProvenancePreservationContract = {
  stage: "provenance-preservation",
  sourceProvenance: rawContentFixtureProvenance,
  normalizedProvenance: {
    ...rawContentFixtureProvenance,
    normalizationBoundary: "normalization-contract"
  },
  records: [
    {
      policy: "append-normalization-boundary",
      preserved: true,
      safeMessage: "Normalization boundary recorded for fixture."
    }
  ],
  safeMetadata: {
    fixture: true
  }
};

export const normalizationFixtureResult: NormalizationResult = {
  ok: true,
  status: "success",
  output: normalizationFixtureOutput,
  issues: [],
  safeMetadata: {
    fixture: true
  }
};

export const normalizationFixtureRequestedEvent: NormalizationEventEnvelope<
  NormalizationRequestedPayload
> = {
  metadata: {
    eventId: NORMALIZATION_FIXTURE_IDS.eventId,
    eventName: "normalization.requested",
    category: "infrastructure",
    version: "v1",
    timestamp: NORMALIZATION_FIXTURE_TIMESTAMP,
    source: "@opportunity-os/normalization",
    correlationId: NORMALIZATION_FIXTURE_IDS.correlationId
  },
  payload: {
    input: normalizationFixtureInput,
    safeMetadata: {
      fixture: true
    }
  }
};
