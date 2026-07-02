import {
  STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS,
  structuredAnalysisFixtureConfidence,
  structuredAnalysisFixtureEvidence,
  structuredAnalysisFixtureProvenance,
  type StructuredAnalysisConfidence
} from "@opportunity-os/analysis";
import { rawContentFixtureProvenance } from "@opportunity-os/raw-content";
import {
  OPPORTUNITY_CONFIDENCE_LEVELS,
  type OpportunityConfidence
} from "../confidence/index.js";
import {
  OPPORTUNITY_ENGINE_ERROR_CATEGORIES,
  OPPORTUNITY_ENGINE_ERROR_CODES,
  type OpportunityEngineErrorSafeDetails
} from "../errors/index.js";
import {
  OPPORTUNITY_EVENT_NAMES,
  type OpportunityEventEnvelope
} from "../events/index.js";
import {
  OPPORTUNITY_EVIDENCE_KINDS,
  type OpportunityEvidenceId,
  type OpportunityEvidenceReference
} from "../evidence/index.js";
import {
  OPPORTUNITY_HYPOTHESIS_STATUSES,
  type OpportunityHypothesis,
  type OpportunityHypothesisId
} from "../hypothesis/index.js";
import {
  OPPORTUNITY_SOURCE_KINDS,
  OPPORTUNITY_STATUSES,
  type OpportunityId,
  type OpportunitySafeMetadata,
  type OpportunityTimestamp,
  type OpportunityVersion
} from "../opportunity/index.js";
import {
  type OpportunityRankPosition,
  type OpportunityRanking,
  OPPORTUNITY_RANKING_STATUSES
} from "../ranking/index.js";
import {
  OPPORTUNITY_RESULT_STATUSES,
  type OpportunityResult
} from "../results/index.js";
import {
  OPPORTUNITY_SCORE_DIMENSIONS,
  type OpportunityScore,
  type OpportunityScoreValue
} from "../scoring/index.js";
import {
  type OpportunitySourceId,
  type OpportunitySourceReference
} from "../source/index.js";
import {
  OPPORTUNITY_VALIDATION_ISSUE_CODES,
  type OpportunityValidationFailure,
  type OpportunityValidationSuccess
} from "../validation/index.js";

export const OPPORTUNITY_FIXTURE_TIMESTAMP =
  "2026-01-01T00:00:00.000Z" as OpportunityTimestamp;

export const OPPORTUNITY_FIXTURE_IDS = {
  opportunityId: "opportunity-fixture-1" as OpportunityId,
  sourceId: "opportunity-source-fixture-1" as OpportunitySourceId,
  evidenceId: "opportunity-evidence-fixture-1" as OpportunityEvidenceId,
  hypothesisId: "opportunity-hypothesis-fixture-1" as OpportunityHypothesisId
} as const;

export const opportunityFixtureSafeMetadata = {
  fixture: true,
  synthetic: true
} as const satisfies OpportunitySafeMetadata;

export const opportunityFixtureSource: OpportunitySourceReference = {
  sourceId: OPPORTUNITY_FIXTURE_IDS.sourceId,
  kind: OPPORTUNITY_SOURCE_KINDS.structuredAnalysis,
  structuredAnalysisId: structuredAnalysisFixtureProvenance.analysisId,
  provenance: {
    rawContent: rawContentFixtureProvenance,
    structuredAnalysis: structuredAnalysisFixtureProvenance
  },
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureEvidence: OpportunityEvidenceReference = {
  evidenceId: OPPORTUNITY_FIXTURE_IDS.evidenceId,
  opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
  kind: OPPORTUNITY_EVIDENCE_KINDS.structuredAnalysis,
  source: opportunityFixtureSource,
  structuredEvidence: structuredAnalysisFixtureEvidence,
  confidence: structuredAnalysisFixtureConfidence.fields[0] as StructuredAnalysisConfidence,
  provenance: rawContentFixtureProvenance,
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureHypothesis: OpportunityHypothesis = {
  hypothesisId: OPPORTUNITY_FIXTURE_IDS.hypothesisId,
  opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
  status: OPPORTUNITY_HYPOTHESIS_STATUSES.supported,
  statement: "Synthetic signal indicates a repeatable unmet need.",
  assumptions: ["Synthetic evidence remains linked to provenance."],
  evidence: [opportunityFixtureEvidence],
  confidence: {
    level: STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS.high,
    score: structuredAnalysisFixtureConfidence.overall.score
  },
  provenance: rawContentFixtureProvenance,
  lifecycle: {
    createdAt: OPPORTUNITY_FIXTURE_TIMESTAMP,
    updatedAt: OPPORTUNITY_FIXTURE_TIMESTAMP,
    version: "1" as OpportunityVersion,
    status: OPPORTUNITY_STATUSES.validated
  },
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureScore: OpportunityScore = {
  opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
  overall: 0.84 as OpportunityScoreValue,
  components: [
    {
      dimension: OPPORTUNITY_SCORE_DIMENSIONS.evidenceStrength,
      value: 0.84 as OpportunityScoreValue,
      rationale: "Synthetic evidence is present and traceable.",
      evidence: [opportunityFixtureEvidence],
      confidence: structuredAnalysisFixtureConfidence.fields[0] as StructuredAnalysisConfidence,
      safeMetadata: opportunityFixtureSafeMetadata
    }
  ],
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureConfidence: OpportunityConfidence = {
  opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
  level: OPPORTUNITY_CONFIDENCE_LEVELS.high,
  structuredAnalysis: {
    level: STRUCTURED_ANALYSIS_CONFIDENCE_LEVELS.high,
    score: structuredAnalysisFixtureConfidence.overall.score
  },
  evidence: [opportunityFixtureEvidence],
  rationale: "Synthetic evidence and score contracts align.",
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureRanking: OpportunityRanking = {
  opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
  status: OPPORTUNITY_RANKING_STATUSES.included,
  position: 1 as OpportunityRankPosition,
  input: {
    opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
    score: opportunityFixtureScore,
    confidence: opportunityFixtureConfidence,
    evidence: [opportunityFixtureEvidence],
    safeMetadata: opportunityFixtureSafeMetadata
  },
  explanation: "Synthetic ranking contract fixture.",
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureValidationSuccess: OpportunityValidationSuccess = {
  valid: true,
  input: {
    opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
    hypothesis: opportunityFixtureHypothesis,
    evidence: [opportunityFixtureEvidence],
    safeMetadata: opportunityFixtureSafeMetadata
  }
};

export const opportunityFixtureValidationFailure: OpportunityValidationFailure = {
  valid: false,
  issues: [
    {
      code: OPPORTUNITY_VALIDATION_ISSUE_CODES.missingEvidence,
      message: "Evidence is required.",
      safeMetadata: opportunityFixtureSafeMetadata
    }
  ]
};

export const opportunityFixtureError: OpportunityEngineErrorSafeDetails = {
  code: OPPORTUNITY_ENGINE_ERROR_CODES.validationFailed,
  category: OPPORTUNITY_ENGINE_ERROR_CATEGORIES.validation,
  message: "Opportunity validation failed safely.",
  correlationId: "correlation-fixture-1",
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureResult: OpportunityResult = {
  status: OPPORTUNITY_RESULT_STATUSES.success,
  opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
  hypothesis: opportunityFixtureHypothesis,
  evidence: [opportunityFixtureEvidence],
  score: opportunityFixtureScore,
  confidence: opportunityFixtureConfidence,
  ranking: opportunityFixtureRanking,
  safeMetadata: opportunityFixtureSafeMetadata
};

export const opportunityFixtureCompletedEvent: OpportunityEventEnvelope = {
  metadata: {
    eventId: "opportunity-event-fixture-1",
    eventName: OPPORTUNITY_EVENT_NAMES.completed,
    category: "infrastructure",
    version: "v1",
    timestamp: OPPORTUNITY_FIXTURE_TIMESTAMP,
    source: "@opportunity-os/opportunity-engine",
    correlationId: "correlation-fixture-1"
  },
  payload: {
    opportunityId: OPPORTUNITY_FIXTURE_IDS.opportunityId,
    status: OPPORTUNITY_RESULT_STATUSES.success,
    safeMetadata: opportunityFixtureSafeMetadata
  }
};
