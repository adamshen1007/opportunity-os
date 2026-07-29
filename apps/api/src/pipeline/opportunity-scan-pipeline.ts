import {
  REDDIT_FAKE_HOST_CONTEXT,
  createRedditLiveProviderConfigFromEnv,
  createRedditLiveHttpTransport,
  createRedditRuntimeHarness,
  fetchRedditLivePublicPosts,
  type RedditDataEnvelope,
  type RedditPost
} from "@opportunity-os/connectors-reddit";
import {
  createStackExchangeProviderConfigFromEnv,
  searchStackExchange,
  type StackExchangeQuestion,
  type StackExchangeQuotaMetadata
} from "@opportunity-os/connectors-stack-exchange";
import {
  ANALYSIS_RESULT_STATUSES,
  createGeminiLiveLlmProviderAdapter,
  createLiveLlmProviderConfigFromEnv,
  createOpenAiLiveLlmProviderAdapter,
  llmAnalysisFixturePrompt,
  llmAnalysisFixtureProvider,
  llmAnalysisFixtureRequest,
  llmAnalysisFixtureResult,
  type AnalysisResult,
  type LlmModelId,
  type LlmProviderId
} from "@opportunity-os/llm-analysis";
import { CANONICAL_TEXT_VERSION, NORMALIZATION_STAGES } from "@opportunity-os/normalization";
import { CANDIDATE_OPPORTUNITY_STATUSES } from "@opportunity-os/opportunity-candidates";
import {
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  synthesizeEvidenceClusters,
  type SynthesizedOpportunity
} from "@opportunity-os/opportunity-generation";
import {
  clusterEvidence,
  type EvidenceCluster,
  type EvidenceClusterMember
} from "@opportunity-os/opportunity-pipeline";
import {
  DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
  OPPORTUNITY_RANKING_FACTOR_IDS,
  OPPORTUNITY_RANKING_FACTOR_KINDS,
  OPPORTUNITY_RANKING_MODES,
  OPPORTUNITY_RANKING_SIGNAL_IDS,
  OPPORTUNITY_RANKING_SIGNAL_SOURCES,
  rankOpportunities,
  type OpportunityRankingFactor,
  type OpportunityRankingFieldPath,
  type OpportunityRankingRequestId,
  type OpportunityRankingRunId,
  type OpportunityRankingScoreValue,
  type OpportunityRankingSignal,
  type OpportunityRankingTimestamp,
  type OpportunityRankingUpstreamReference,
  type OpportunityRankingVersion
} from "@opportunity-os/opportunity-ranking";
import { RAW_CONTENT_ENVELOPE_VERSION } from "@opportunity-os/raw-content";
import type {
  ApiScanEvidenceDto,
  ApiScanMode,
  ApiScanOpportunityDto,
  ApiScanResultDto,
  ApiScanStageDto
} from "./scan-pipeline-dto.js";
import { API_SCAN_MODES, API_SCAN_STAGE_STATUSES } from "./scan-pipeline-dto.js";
import type { ApiScanRequest } from "./scan-request.js";
import { createScanValidationMetrics } from "./scan-validation-metrics.js";

export type OpportunityScanPipelineContext = {
  readonly correlationId: string;
  readonly requestId?: string;
  readonly requestedAt: string;
  readonly env?: NodeJS.ProcessEnv;
};

export type OpportunityScanPipelineInput = Omit<ApiScanRequest, "source" | "query" | "tags"> &
  Partial<Pick<ApiScanRequest, "source" | "query" | "tags">> &
  OpportunityScanPipelineContext;

type PipelineSourceItem = {
  readonly id: string;
  readonly title: string;
  readonly bodyText?: string;
  readonly permalink: string;
  readonly community: string;
  readonly source: "reddit" | "stack-exchange";
  readonly observedAt: string;
  readonly connectorId: "reddit" | "stack-exchange";
};

type PipelineRawContent = {
  readonly id: string;
  readonly version: typeof RAW_CONTENT_ENVELOPE_VERSION;
  readonly kind: "post";
  readonly title: string;
  readonly bodyText?: string;
  readonly permalink: string;
  readonly source: {
    readonly platform: "reddit" | "stack-exchange";
    readonly sourceId: string;
    readonly sourceUrl: string;
    readonly community: string;
  };
  readonly ingestion: {
    readonly ingestionId: string;
    readonly ingestedAt: string;
    readonly connectorId: "reddit" | "stack-exchange";
  };
  readonly provenance: {
    readonly sourcePlatform: "reddit" | "stack-exchange";
    readonly sourceId: string;
    readonly sourceUrl: string;
    readonly transformBoundary: "reddit-to-raw-content" | "stack-exchange-to-raw-content";
    readonly rawProviderPayloadStored: false;
  };
};

type PipelineNormalizedContent = {
  readonly id: string;
  readonly version: typeof CANONICAL_TEXT_VERSION;
  readonly sourceRawContentId: string;
  readonly text: string;
  readonly stages: readonly string[];
  readonly provenance: PipelineRawContent["provenance"];
};

type PipelineCandidate = {
  readonly candidateId: string;
  readonly status: typeof CANDIDATE_OPPORTUNITY_STATUSES.validationReady;
  readonly title: string;
  readonly evidenceSummary: string;
  readonly confidence: number;
  readonly cluster: EvidenceCluster;
  readonly synthesis: SynthesizedOpportunity;
  readonly evidence: readonly PipelineEvidenceBundle[];
  readonly provenance: {
    readonly sourceItemIds: readonly string[];
    readonly rawContentIds: readonly string[];
    readonly normalizedContentIds: readonly string[];
    readonly analysisRequestIds: readonly string[];
  };
};

type PipelineEvidenceBundle = {
  readonly post: PipelineSourceItem;
  readonly raw: PipelineRawContent;
  readonly normalized: PipelineNormalizedContent;
  readonly analysis: AnalysisResult;
  readonly analysisRequestId: string;
  readonly member: EvidenceClusterMember;
};

type PipelineGeneratedOpportunity = {
  readonly opportunityId: string;
  readonly outputId: string;
  readonly status: typeof OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated;
  readonly candidate: PipelineCandidate;
  readonly generatedAt: string;
};

const unsafeOutputPattern =
  /(sk-[a-z0-9_-]+|bearer\s+[a-z0-9._-]+|authorization|client_secret|refresh_token|access_token|raw provider|stack trace|raw cause)/iu;

const stage = (name: ApiScanStageDto["name"], safeMessage: string): ApiScanStageDto => ({
  name,
  status: API_SCAN_STAGE_STATUSES.completed,
  safeMessage
});

const safeId = (value: string): string => value.replace(/[^a-zA-Z0-9_-]+/gu, "-").replace(/^-|-$/gu, "");

function shouldUseLivePath(input: OpportunityScanPipelineInput): boolean {
  return input.mode === API_SCAN_MODES.live;
}

async function readReddit(input: OpportunityScanPipelineInput): Promise<{
  readonly mode: ApiScanMode;
  readonly envelope: RedditDataEnvelope;
}> {
  if (!shouldUseLivePath(input)) {
    return {
      mode: API_SCAN_MODES.fixture,
      envelope: createRedditRuntimeHarness().connector.read("reddit.read.posts")
    };
  }

  const env = input.env ?? process.env;
  const redditConfig = createRedditLiveProviderConfigFromEnv(env);
  if (!redditConfig.ok || !redditConfig.config.enabled) {
    return {
      mode: API_SCAN_MODES.fixture,
      envelope: createRedditRuntimeHarness().connector.read("reddit.read.posts")
    };
  }

  const result = await fetchRedditLivePublicPosts({
    credentials: redditConfig.config.credentials,
    transport: createRedditLiveHttpTransport(),
    subreddit: input.subreddit ?? "opportunity",
    limit: input.limit,
    tokenEndpoint: redditConfig.config.tokenEndpoint,
    apiBaseUrl: redditConfig.config.apiBaseUrl,
    requestedAt: input.requestedAt,
    runtimeContext: {
      ...REDDIT_FAKE_HOST_CONTEXT,
      correlationId: input.correlationId,
      requestId: input.requestId
    },
    timeoutMs: 10000
  });

  if (!result.ok) {
    return {
      mode: API_SCAN_MODES.fixture,
      envelope: createRedditRuntimeHarness().connector.read("reddit.read.posts")
    };
  }

  return {
    mode: API_SCAN_MODES.live,
    envelope: result.envelope
  };
}

type SourceReadResult = {
  readonly mode: ApiScanMode;
  readonly items: readonly PipelineSourceItem[];
  readonly community: string;
  readonly attribution: string;
  readonly quota?: StackExchangeQuotaMetadata;
};

async function readSource(input: OpportunityScanPipelineInput): Promise<SourceReadResult> {
  if (input.source === "stack-exchange") {
    const config = createStackExchangeProviderConfigFromEnv(input.env ?? process.env);
    const provider = await searchStackExchange({
      config: { ...config, enabled: input.mode === API_SCAN_MODES.live && config.enabled },
      request: {
        query: input.query ?? "manual review",
        site: input.site,
        tags: input.tags ?? [],
        pageSize: input.limit
      }
    });
    if (!provider.ok) throw new Error(provider.error.message);
    return {
      mode: provider.result.mode,
      items: provider.result.items.slice(0, input.limit).map(mapStackExchangeQuestion),
      community: input.site ?? config.defaultSite,
      attribution: provider.result.attribution.sourceName,
      quota: provider.result.quota
    };
  }

  const reddit = await readReddit(input);
  const posts = reddit.envelope.kind === "posts" ? reddit.envelope.items.slice(0, input.limit) : [];
  return {
    mode: reddit.mode,
    items: posts.map(mapRedditPost),
    community: input.subreddit ?? "opportunity",
    attribution: "Reddit"
  };
}

function mapRedditPost(post: RedditPost): PipelineSourceItem {
  return {
    id: post.id,
    title: post.title,
    bodyText: post.bodyText,
    permalink: post.permalink,
    community: post.subreddit.name,
    source: "reddit",
    observedAt: post.timestamps.createdAt ?? "1970-01-01T00:00:00.000Z",
    connectorId: "reddit"
  };
}

function mapStackExchangeQuestion(question: StackExchangeQuestion): PipelineSourceItem {
  return {
    id: question.id,
    title: question.title,
    bodyText: question.bodyText,
    permalink: question.permalink,
    community: question.site,
    source: "stack-exchange",
    observedAt: question.createdAt,
    connectorId: "stack-exchange"
  };
}

function prepareSourceItems(items: readonly PipelineSourceItem[]): {
  readonly accepted: readonly PipelineSourceItem[];
  readonly rejected: number;
  readonly duplicates: number;
} {
  const accepted: PipelineSourceItem[] = [];
  const seen = new Set<string>();
  let rejected = 0;
  let duplicates = 0;
  for (const item of items) {
    const validUrl = /^(https:\/\/|\/)/u.test(item.permalink);
    if (!item.id.trim() || item.title.trim().length < 8 || !validUrl) {
      rejected += 1;
      continue;
    }
    const fingerprint = `${item.source}:${item.permalink.toLowerCase()}:${item.title.trim().toLowerCase().replace(/\s+/gu, " ")}`;
    if (seen.has(fingerprint)) {
      duplicates += 1;
      continue;
    }
    seen.add(fingerprint);
    accepted.push(item);
  }
  return { accepted, rejected, duplicates };
}

function mapPostToRawContent(post: PipelineSourceItem, requestedAt: string): PipelineRawContent {
  return {
    id: `raw-post-${safeId(post.id)}`,
    version: RAW_CONTENT_ENVELOPE_VERSION,
    kind: "post",
    title: post.title,
    bodyText: post.bodyText,
    permalink: post.permalink,
    source: {
      platform: post.source,
      sourceId: post.id,
      sourceUrl: post.permalink,
      community: post.community
    },
    ingestion: {
      ingestionId: `ingestion-${safeId(post.id)}`,
      ingestedAt: requestedAt,
      connectorId: post.source
    },
    provenance: {
      sourcePlatform: post.source,
      sourceId: post.id,
      sourceUrl: post.permalink,
      transformBoundary: post.source === "reddit" ? "reddit-to-raw-content" : "stack-exchange-to-raw-content",
      rawProviderPayloadStored: false
    }
  };
}

function normalizeRawContent(raw: PipelineRawContent): PipelineNormalizedContent {
  return {
    id: `normalized-${safeId(raw.id)}`,
    version: CANONICAL_TEXT_VERSION,
    sourceRawContentId: raw.id,
    text: [raw.title, raw.bodyText].filter(Boolean).join("\n\n").trim(),
    stages: [NORMALIZATION_STAGES[2], NORMALIZATION_STAGES[5]],
    provenance: raw.provenance
  };
}

async function analyzeContent(
  normalized: PipelineNormalizedContent,
  input: OpportunityScanPipelineInput,
  mode: ApiScanMode
): Promise<AnalysisResult> {
  if (mode !== API_SCAN_MODES.live) {
    return llmAnalysisFixtureResult;
  }

  const config = createLiveLlmProviderConfigFromEnv(input.env ?? process.env);
  if (!config.ok || !config.config.enabled) {
    return llmAnalysisFixtureResult;
  }

  const adapter = config.config.provider === "gemini"
    ? createGeminiLiveLlmProviderAdapter({ config: config.config })
    : createOpenAiLiveLlmProviderAdapter({ config: config.config });
  return adapter.analyze({
    ...llmAnalysisFixtureRequest,
    input: {
      ...llmAnalysisFixtureRequest.input,
      variables: {
        canonicalText: normalized.text
      }
    },
    provider: {
      ...llmAnalysisFixtureProvider.metadata,
      id: config.config.provider as LlmProviderId,
      name: config.config.provider,
      models: [
        {
          id: config.config.model as LlmModelId,
          name: config.config.model,
          supportedCapabilities: ["text-analysis", "structured-output"]
        }
      ]
    },
    prompt: llmAnalysisFixturePrompt,
    context: {
      correlationId: input.correlationId,
      requestId: input.requestId
    }
  });
}

function analysisSummary(result: AnalysisResult, fallback: string): string {
  if (result.status !== ANALYSIS_RESULT_STATUSES.success) return fallback;
  const summary = result.response.output?.values.summary;
  return typeof summary === "string" && summary.length > 0 ? summary : fallback;
}

function analysisConfidence(result: AnalysisResult): number {
  if (result.status !== ANALYSIS_RESULT_STATUSES.success) return 0.62;
  const confidence = result.response.output?.values.confidence;
  return typeof confidence === "number" && Number.isFinite(confidence) ? Math.min(Math.max(confidence, 0), 1) : 0.74;
}

function createCandidate(input: {
  readonly cluster: EvidenceCluster;
  readonly synthesis: SynthesizedOpportunity;
  readonly bundles: readonly PipelineEvidenceBundle[];
}): PipelineCandidate {
  const supporting = input.bundles.filter((bundle) => bundle.member.stance === "supporting");
  const confidence = supporting.length === 0
    ? 0
    : supporting.reduce((total, bundle) => total + analysisConfidence(bundle.analysis), 0) / supporting.length;
  return {
    candidateId: `candidate-${safeId(input.cluster.clusterId)}`,
    status: CANDIDATE_OPPORTUNITY_STATUSES.validationReady,
    title: input.synthesis.title,
    evidenceSummary: input.synthesis.pain.text,
    confidence,
    cluster: input.cluster,
    synthesis: input.synthesis,
    evidence: input.bundles,
    provenance: {
      sourceItemIds: input.bundles.map((bundle) => bundle.post.id),
      rawContentIds: input.bundles.map((bundle) => bundle.raw.id),
      normalizedContentIds: input.bundles.map((bundle) => bundle.normalized.id),
      analysisRequestIds: input.bundles.map((bundle) => bundle.analysisRequestId)
    }
  };
}

function generateOpportunity(candidate: PipelineCandidate, requestedAt: string): PipelineGeneratedOpportunity {
  return {
    opportunityId: `opportunity-${safeId(candidate.candidateId)}`,
    outputId: `generation-output-${safeId(candidate.candidateId)}`,
    status: OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated,
    candidate,
    generatedAt: requestedAt
  };
}

function rankingReference(packageName: string, entityKind: string, entityId: string): OpportunityRankingUpstreamReference {
  return {
    packageName,
    entityKind,
    entityId,
    version: "mvp-v1"
  };
}

function rankGeneratedOpportunities(input: {
  readonly opportunities: readonly PipelineGeneratedOpportunity[];
  readonly requestedAt: string;
  readonly requestId?: string;
}) {
  const signals: readonly OpportunityRankingSignal[] = [
    {
      signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence,
      source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.candidate,
      fieldPath: "candidate.confidence" as OpportunityRankingFieldPath,
      value: 0.82 as OpportunityRankingScoreValue,
      normalizedValue: 0.82 as OpportunityRankingScoreValue,
      explanation: "Candidate confidence is present and traceable."
    },
    {
      signalId: OPPORTUNITY_RANKING_SIGNAL_IDS.evidenceCompleteness,
      source: OPPORTUNITY_RANKING_SIGNAL_SOURCES.evidence,
      fieldPath: "candidate.evidence" as OpportunityRankingFieldPath,
      value: 0.88 as OpportunityRankingScoreValue,
      normalizedValue: 0.88 as OpportunityRankingScoreValue,
      explanation: "Every generated opportunity includes source evidence."
    }
  ];
  const factors: readonly OpportunityRankingFactor[] = [
    {
      factorId: OPPORTUNITY_RANKING_FACTOR_IDS.confidenceStrength,
      kind: OPPORTUNITY_RANKING_FACTOR_KINDS.confidence,
      signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.candidateConfidence],
      value: 0.82 as OpportunityRankingScoreValue,
      explanation: "Confidence contributes deterministically."
    },
    {
      factorId: OPPORTUNITY_RANKING_FACTOR_IDS.evidenceCompleteness,
      kind: OPPORTUNITY_RANKING_FACTOR_KINDS.evidence,
      signalIds: [OPPORTUNITY_RANKING_SIGNAL_IDS.evidenceCompleteness],
      value: 0.88 as OpportunityRankingScoreValue,
      explanation: "Evidence completeness contributes deterministically."
    }
  ];
  const safeMetadata = input.requestId ? { requestId: input.requestId } : undefined;

  return rankOpportunities(
    {
      requestId: "mvp-scan-ranking-request" as OpportunityRankingRequestId,
      generatedOpportunities: input.opportunities.map((item) =>
        rankingReference("@opportunity-os/opportunity-generation", "generated-opportunity", item.opportunityId)
      ),
      generationOutputs: input.opportunities.map((item) =>
        rankingReference("@opportunity-os/opportunity-generation", "generation-output", item.outputId)
      ),
      candidates: input.opportunities.map((item) =>
        rankingReference("@opportunity-os/opportunity-candidates", "candidate-opportunity", item.candidate.candidateId)
      ),
      signals: {
        signals,
        deterministic: true,
        providerIndependent: true,
        explainable: true
      },
      factors: {
        factors,
        deterministic: true,
        explainable: true
      },
      weights: DEFAULT_OPPORTUNITY_RANKING_WEIGHT_SET,
      context: {
        requestedAt: input.requestedAt as OpportunityRankingTimestamp,
        requestedBy: "api-scan",
        mode: OPPORTUNITY_RANKING_MODES.deterministic,
        version: "ranking-v1" as OpportunityRankingVersion,
        ...(safeMetadata ? { safeMetadata } : {})
      }
    },
    {
      runId: "mvp-scan-ranking-run" as OpportunityRankingRunId,
      rankedAt: input.requestedAt as OpportunityRankingTimestamp
    }
  );
}

function toDto(input: {
  readonly generated: PipelineGeneratedOpportunity;
  readonly scanId: string;
  readonly rank: number;
  readonly score: number;
  readonly rankingRunId: string;
}): ApiScanOpportunityDto {
  const evidence: ApiScanEvidenceDto[] = input.generated.candidate.evidence.map((bundle) => ({
    evidenceId: bundle.member.evidenceId,
    sourceType: bundle.post.source,
    summary: bundle.normalized.text.slice(0, 220),
    permalink: bundle.post.permalink,
    confidence: analysisConfidence(bundle.analysis),
    stance: bundle.member.stance,
    observedAt: bundle.post.observedAt,
    connectorId: bundle.post.connectorId,
    provenance: {
      sourcePlatform: bundle.post.source,
      sourceId: bundle.post.id,
      sourceUrl: bundle.post.permalink,
      rawContentId: bundle.raw.id,
      normalizedContentId: bundle.normalized.id,
      analysisRequestId: bundle.analysisRequestId
    }
  }));
  const primary = input.generated.candidate.evidence[0];
  if (!primary) throw new Error("Synthesized opportunity has no traceable evidence.");

  return {
    opportunityId: input.generated.opportunityId,
    title: input.generated.candidate.title,
    summary: input.generated.candidate.evidenceSummary,
    confidence: input.generated.candidate.confidence,
    rank: {
      position: input.rank,
      score: input.score,
      explanation: "Ranked by deterministic confidence and evidence completeness signals."
    },
    synthesis: input.generated.candidate.synthesis,
    evidence,
    trust: {
      evidenceCount: input.generated.candidate.cluster.demandCount,
      confidenceBand: input.generated.candidate.confidence >= 0.8 ? "high" : input.generated.candidate.confidence >= 0.6 ? "moderate" : "low",
      limitations: input.generated.candidate.synthesis.limitations,
      rankingFactors: [
        { label: "Candidate confidence", contribution: "Weighted deterministic signal" },
        { label: "Evidence completeness", contribution: "Required source evidence present" }
      ]
    },
    provenance: {
      scanId: input.scanId,
      clusterId: input.generated.candidate.cluster.clusterId,
      clusterFingerprint: input.generated.candidate.cluster.fingerprint,
      sourceItemId: primary.post.id,
      sourceItemIds: input.generated.candidate.provenance.sourceItemIds,
      ...(primary.post.source === "reddit" ? { redditPostId: primary.post.id } : {}),
      rawContentId: primary.raw.id,
      rawContentIds: input.generated.candidate.provenance.rawContentIds,
      normalizedContentId: primary.normalized.id,
      normalizedContentIds: input.generated.candidate.provenance.normalizedContentIds,
      analysisRequestId: primary.analysisRequestId,
      analysisRequestIds: input.generated.candidate.provenance.analysisRequestIds,
      candidateId: input.generated.candidate.candidateId,
      generationOutputId: input.generated.outputId,
      rankingRunId: input.rankingRunId
    }
  };
}

function assertSafeOutput(result: ApiScanResultDto): void {
  const serialized = JSON.stringify(result);
  if (unsafeOutputPattern.test(serialized)) {
    throw new Error("Opportunity scan pipeline produced unsafe output.");
  }
}

export async function runOpportunityScanPipeline(input: OpportunityScanPipelineInput): Promise<ApiScanResultDto> {
  const sourceName = input.source ?? "reddit";
  const source = await readSource({ ...input, source: sourceName });
  const prepared = prepareSourceItems(source.items);
  const posts = prepared.accepted;
  const scanId = `scan-${safeId(sourceName)}-${safeId(source.community)}-${safeId(input.requestedAt)}`;
  const rawContent = posts.map((post) => mapPostToRawContent(post, input.requestedAt));
  const normalizedContent = rawContent.map((raw) => normalizeRawContent(raw));
  const analyses = await Promise.all(normalizedContent.map((normalized) => analyzeContent(normalized, input, source.mode)));
  const clusteringInputs = posts.map((post, index) => {
    const raw = rawContent[index] as PipelineRawContent;
    const normalized = normalizedContent[index] as PipelineNormalizedContent;
    return {
      evidenceId: `evidence-${safeId(post.id)}`,
      title: post.title,
      text: normalized.text,
      sourceType: post.source,
      sourceId: post.id,
      sourceUrl: post.permalink,
      observedAt: post.observedAt,
      connectorId: post.connectorId,
      rawContentId: raw.id,
      normalizedContentId: normalized.id,
      analysisRequestId: `analysis-${safeId(normalized.id)}`,
      provenance: raw.provenance
    };
  });
  const clusters = clusterEvidence(clusteringInputs);
  const synthesisResults = synthesizeEvidenceClusters(clusters);
  const bundlesByEvidenceId = new Map(clusteringInputs.map((item, index) => [item.evidenceId, {
    post: posts[index] as PipelineSourceItem,
    raw: rawContent[index] as PipelineRawContent,
    normalized: normalizedContent[index] as PipelineNormalizedContent,
    analysis: analyses[index] ?? llmAnalysisFixtureResult,
    analysisRequestId: item.analysisRequestId
  }]));
  const candidates = synthesisResults.flatMap((synthesisResult) => {
    if (synthesisResult.status !== "synthesized") return [];
    const cluster = clusters.find((item) => item.clusterId === synthesisResult.opportunity.clusterId);
    if (!cluster) return [];
    const members = [...cluster.supportingEvidence, ...cluster.contradictoryEvidence, ...cluster.excludedEvidence];
    const bundles = members.flatMap((member) => {
      const bundle = bundlesByEvidenceId.get(member.evidenceId);
      return bundle ? [{ ...bundle, member }] : [];
    });
    return [createCandidate({ cluster, synthesis: synthesisResult.opportunity, bundles })];
  });
  const generated = candidates.map((candidate) => generateOpportunity(candidate, input.requestedAt));
  const ranking = rankGeneratedOpportunities({
    opportunities: generated,
    requestedAt: input.requestedAt,
    requestId: input.requestId
  });
  const rankedOutput = ranking.status === "success" ? ranking.output : undefined;
  const ranked = rankedOutput?.rankedOpportunities ?? [];
  const opportunities = generated.map((item, index) => {
    const matchingRank = ranked.find((rank) => rank.opportunity.entityId === item.opportunityId);
    return toDto({
      generated: item,
      scanId,
      rank: matchingRank?.rank ?? index + 1,
      score: matchingRank?.score ?? 0,
      rankingRunId: rankedOutput?.runId ?? "mvp-scan-ranking-run"
    });
  });
  const result: ApiScanResultDto = {
    scanId,
    mode: source.mode,
    status: "completed",
    source: {
      provider: sourceName,
      community: source.community,
      ...(sourceName === "reddit"
        ? { subreddit: input.subreddit ?? source.community }
        : { site: input.site ?? source.community }),
      query: input.query ?? "manual review",
      attribution: source.attribution,
      itemCount: posts.length,
      quota: source.quota
    },
    stages: [
      stage("source", source.mode === API_SCAN_MODES.live ? `Fetched ${source.attribution} content through the live provider.` : `Loaded deterministic ${source.attribution} fixture content.`),
      stage("raw-content", `Mapped ${source.attribution} content into safe Raw Content envelopes.`),
      stage("normalization", "Normalized text while preserving source provenance."),
      stage("llm-analysis", source.mode === API_SCAN_MODES.live ? "Ran env-gated live LLM analysis or safe fixture fallback." : "Used deterministic LLM analysis fixture output."),
      stage("candidate-generation", `Clustered ${posts.length} source item(s) into ${clusters.length} traceable evidence cluster(s).`),
      stage("opportunity-generation", `Synthesized ${opportunities.length} cited opportunity candidate(s) from qualified clusters.`),
      stage("ranking", "Ranked generated opportunities with explainable deterministic ranking.")
    ],
    opportunities,
    validationMetrics: createScanValidationMetrics({ retrievedItems: posts.length, opportunities }),
    safeMetadata: {
      deterministic: source.mode === API_SCAN_MODES.fixture,
      liveEnabled: source.mode === API_SCAN_MODES.live,
      rawProviderPayloadStored: false,
      rejectedSourceItems: prepared.rejected,
      duplicateSourceItems: prepared.duplicates,
      evidenceClusterCount: clusters.length,
      exploratoryClusterCount: clusters.filter((cluster) => cluster.exploratory).length,
      rejectedClusterCount: synthesisResults.filter((item) => item.status === "rejected").length
    }
  };

  assertSafeOutput(result);
  return result;
}
