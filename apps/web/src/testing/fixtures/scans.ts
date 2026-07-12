import type { DashboardApiScanResultDto } from "../../api";

export const dashboardScanFixture: DashboardApiScanResultDto = {
  scanId: "scan-opportunity-20260707",
  mode: "fixture",
  status: "completed",
  source: {
    provider: "reddit",
    community: "opportunity",
    subreddit: "opportunity",
    query: "manual review",
    attribution: "Reddit",
    itemCount: 2
  },
  stages: [
    {
      name: "source",
      status: "completed",
      safeMessage: "Loaded deterministic Reddit fixture content."
    },
    {
      name: "raw-content",
      status: "completed",
      safeMessage: "Mapped source content into raw content contracts."
    },
    {
      name: "normalization",
      status: "completed",
      safeMessage: "Prepared normalized text while preserving provenance."
    },
    {
      name: "llm-analysis",
      status: "completed",
      safeMessage: "Used deterministic analysis fixture output."
    },
    {
      name: "candidate-generation",
      status: "completed",
      safeMessage: "Created candidate opportunities from structured signals."
    },
    {
      name: "opportunity-generation",
      status: "completed",
      safeMessage: "Generated explainable opportunity candidates."
    },
    {
      name: "ranking",
      status: "completed",
      safeMessage: "Ranked opportunities with deterministic scoring."
    }
  ],
  opportunities: [
    {
      opportunityId: "scan-opportunity-001",
      title: "Prioritize repeated manual review workflows",
      summary:
        "People describe repeated manual checks and handoffs, suggesting a focused workflow automation opportunity.",
      confidence: 0.81,
      rank: {
        position: 1,
        score: 87,
        explanation: "High confidence, repeated evidence, and direct workflow urgency produced the top rank."
      },
      evidence: [
        {
          evidenceId: "scan-evidence-001",
          sourceType: "reddit",
          summary: "A practitioner reports spending hours each week on manual review before approvals.",
          permalink: "https://www.reddit.com/r/opportunity/comments/fixture/manual_review/",
          confidence: 0.84,
          provenance: {
            sourcePlatform: "reddit",
            sourceId: "post_fixture_manual_review",
            sourceUrl: "https://www.reddit.com/r/opportunity/comments/fixture/manual_review/",
            normalizedContentId: "normalized-fixture-001",
            analysisRequestId: "analysis-fixture-001"
          }
        }
      ],
      provenance: {
        scanId: "scan-opportunity-20260707",
        sourceItemId: "post_fixture_manual_review",
        redditPostId: "post_fixture_manual_review",
        rawContentId: "raw-fixture-001",
        normalizedContentId: "normalized-fixture-001",
        analysisRequestId: "analysis-fixture-001",
        candidateId: "candidate-fixture-001",
        generationOutputId: "generation-fixture-001",
        rankingRunId: "ranking-fixture-001"
      }
    },
    {
      opportunityId: "scan-opportunity-002",
      title: "Summarize support evidence for team decisions",
      summary:
        "Teams need clearer summaries of scattered evidence before deciding what to build or prioritize.",
      confidence: 0.72,
      rank: {
        position: 2,
        score: 73,
        explanation: "Moderate confidence and clear evidence quality created a second-ranked candidate."
      },
      evidence: [
        {
          evidenceId: "scan-evidence-002",
          sourceType: "reddit",
          summary: "A team lead asks for a better way to consolidate comments into a decision brief.",
          permalink: "https://www.reddit.com/r/opportunity/comments/fixture/evidence_summary/",
          confidence: 0.76,
          provenance: {
            sourcePlatform: "reddit",
            sourceId: "post_fixture_evidence_summary",
            sourceUrl: "https://www.reddit.com/r/opportunity/comments/fixture/evidence_summary/",
            normalizedContentId: "normalized-fixture-002",
            analysisRequestId: "analysis-fixture-002"
          }
        }
      ],
      provenance: {
        scanId: "scan-opportunity-20260707",
        sourceItemId: "post_fixture_evidence_summary",
        redditPostId: "post_fixture_evidence_summary",
        rawContentId: "raw-fixture-002",
        normalizedContentId: "normalized-fixture-002",
        analysisRequestId: "analysis-fixture-002",
        candidateId: "candidate-fixture-002",
        generationOutputId: "generation-fixture-002",
        rankingRunId: "ranking-fixture-001"
      }
    }
  ],
  validationMetrics: {
    retrievedItems: 2,
    generatedOpportunities: 2,
    evidenceBackedOpportunities: 2,
    evidenceCoverage: 1,
    averageConfidence: 0.765,
    reviewStatus: "ready-for-human-review"
  },
  safeMetadata: {
    deterministic: true,
    liveEnabled: false,
    rawProviderPayloadStored: false
  }
};
