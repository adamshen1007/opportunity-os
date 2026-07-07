import type { ApiScanOpportunityDto, ApiScanResultDto } from "../pipeline/index.js";

export interface ApiScanPersistenceInput {
  readonly result: ApiScanResultDto;
  readonly persistedAt: string;
}

export interface ApiScanPersistenceStore {
  readonly persistScanResult: (input: ApiScanPersistenceInput) => Promise<void>;
  readonly resolveOpportunityRecordId: (opportunityId: string) => Promise<string | undefined>;
}

export interface ApiScanPersistenceRecord {
  readonly scanId: string;
  readonly opportunityIds: readonly string[];
  readonly opportunityRecordIds: Readonly<Record<string, string>>;
}

export interface InMemoryScanPersistenceInput {
  readonly initialRecords?: readonly ApiScanPersistenceRecord[];
}

const unsafePersistencePattern =
  /api[_-]?key|access[_-]?token|refresh[_-]?token|password|secret|credential|authorization|bearer\s+[a-z0-9]|raw provider|provider payload|stack trace|raw cause/iu;

export function createNoopScanPersistenceStore(): ApiScanPersistenceStore {
  return {
    async persistScanResult() {
      return undefined;
    },
    async resolveOpportunityRecordId() {
      return undefined;
    }
  };
}

export function createInMemoryScanPersistenceStore(input: InMemoryScanPersistenceInput = {}): ApiScanPersistenceStore {
  const records = new Map<string, ApiScanPersistenceRecord>();
  const opportunityRecordIds = new Map<string, string>();

  for (const record of input.initialRecords ?? []) {
    records.set(record.scanId, cloneRecord(record));
    for (const [opportunityId, recordId] of Object.entries(record.opportunityRecordIds)) {
      opportunityRecordIds.set(opportunityId, recordId);
    }
  }

  return {
    async persistScanResult({ result }) {
      assertSafePersistencePayload(result);
      const record = toScanPersistenceRecord(result);
      records.set(record.scanId, cloneRecord(record));
      for (const [opportunityId, recordId] of Object.entries(record.opportunityRecordIds)) {
        opportunityRecordIds.set(opportunityId, recordId);
      }
    },
    async resolveOpportunityRecordId(opportunityId) {
      return opportunityRecordIds.get(opportunityId);
    }
  };
}

export function toScanPersistenceRecord(result: ApiScanResultDto): ApiScanPersistenceRecord {
  return {
    scanId: result.scanId,
    opportunityIds: result.opportunities.map((opportunity) => opportunity.opportunityId),
    opportunityRecordIds: Object.fromEntries(
      result.opportunities.map((opportunity) => [opportunity.opportunityId, opportunity.provenance.generationOutputId])
    )
  };
}

export function assertSafePersistencePayload(value: unknown): void {
  const serialized = JSON.stringify(value);
  if (unsafePersistencePattern.test(serialized)) {
    throw new Error("Persistence payload contains unsafe operational details.");
  }
}

function cloneRecord(record: ApiScanPersistenceRecord): ApiScanPersistenceRecord {
  return {
    scanId: record.scanId,
    opportunityIds: [...record.opportunityIds],
    opportunityRecordIds: { ...record.opportunityRecordIds }
  };
}

export interface ApiScanPersistenceDatabaseDelegate<TArgs = unknown> {
  readonly upsert: (args: TArgs) => Promise<unknown>;
}

export interface ApiScanPersistenceDatabaseClient {
  readonly scanRunRecord: ApiScanPersistenceDatabaseDelegate;
  readonly rawSourceContent: ApiScanPersistenceDatabaseDelegate;
  readonly normalizedContent: ApiScanPersistenceDatabaseDelegate;
  readonly analysisResult: ApiScanPersistenceDatabaseDelegate;
  readonly candidateOpportunityRecord: ApiScanPersistenceDatabaseDelegate;
  readonly generatedOpportunityRecord: ApiScanPersistenceDatabaseDelegate;
  readonly opportunityRankingResult: ApiScanPersistenceDatabaseDelegate;
  readonly opportunityRankingItem: ApiScanPersistenceDatabaseDelegate;
}

export function createDatabaseScanPersistenceStore(database: ApiScanPersistenceDatabaseClient): ApiScanPersistenceStore {
  const memory = createInMemoryScanPersistenceStore();

  return {
    async persistScanResult(input) {
      assertSafePersistencePayload(input.result);
      await persistToDatabase(database, input);
      await memory.persistScanResult(input);
    },
    async resolveOpportunityRecordId(opportunityId) {
      return memory.resolveOpportunityRecordId(opportunityId);
    }
  };
}

async function persistToDatabase(database: ApiScanPersistenceDatabaseClient, input: ApiScanPersistenceInput): Promise<void> {
  const { result, persistedAt } = input;
  const completedAt = new Date(persistedAt);
  const rankingRunId = result.opportunities[0]?.provenance.rankingRunId ?? `${result.scanId}-ranking`;

  await database.scanRunRecord.upsert({
    where: { id: result.scanId },
    update: {
      mode: result.mode,
      status: result.status,
      source: result.source,
      stages: result.stages,
      safeMetadata: result.safeMetadata,
      completedAt
    },
    create: {
      id: result.scanId,
      mode: result.mode,
      status: result.status,
      source: result.source,
      stages: result.stages,
      safeMetadata: result.safeMetadata,
      startedAt: completedAt,
      completedAt
    }
  });

  for (const opportunity of result.opportunities) {
    await persistOpportunity(database, opportunity, completedAt);
  }

  await database.opportunityRankingResult.upsert({
    where: { id: rankingRunId },
    update: {
      rankingVersion: "mvp-scan-ranking",
      status: "ranked",
      generatedAt: completedAt,
      safeMetadata: {
        scanId: result.scanId,
        mode: result.mode
      },
      provenance: {
        scanId: result.scanId
      }
    },
    create: {
      id: rankingRunId,
      rankingVersion: "mvp-scan-ranking",
      status: "ranked",
      generatedAt: completedAt,
      safeMetadata: {
        scanId: result.scanId,
        mode: result.mode
      },
      provenance: {
        scanId: result.scanId
      }
    }
  });

  for (const opportunity of result.opportunities) {
    await database.opportunityRankingItem.upsert({
      where: {
        rankingResultId_generatedOpportunityId: {
          rankingResultId: rankingRunId,
          generatedOpportunityId: opportunity.provenance.generationOutputId
        }
      },
      update: {
        rankPosition: opportunity.rank.position,
        score: {
          value: opportunity.rank.score
        },
        explanation: {
          message: opportunity.rank.explanation
        },
        safeMetadata: {
          opportunityId: opportunity.opportunityId
        }
      },
      create: {
        id: `${rankingRunId}-${opportunity.provenance.generationOutputId}`,
        rankingResultId: rankingRunId,
        generatedOpportunityId: opportunity.provenance.generationOutputId,
        rankPosition: opportunity.rank.position,
        score: {
          value: opportunity.rank.score
        },
        explanation: {
          message: opportunity.rank.explanation
        },
        safeMetadata: {
          opportunityId: opportunity.opportunityId
        }
      }
    });
  }
}

async function persistOpportunity(
  database: ApiScanPersistenceDatabaseClient,
  opportunity: ApiScanOpportunityDto,
  completedAt: Date
): Promise<void> {
  const primaryEvidence = opportunity.evidence[0];
  const sourceId = primaryEvidence?.provenance.sourceId ?? opportunity.provenance.redditPostId;

  await database.rawSourceContent.upsert({
    where: {
      sourcePlatform_sourceId: {
        sourcePlatform: "reddit",
        sourceId
      }
    },
    update: {
      title: opportunity.title,
      bodyText: primaryEvidence?.summary,
      sourceUrl: primaryEvidence?.permalink,
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    },
    create: {
      id: opportunity.provenance.rawContentId,
      sourcePlatform: "reddit",
      sourceId,
      sourceType: "post",
      sourceUrl: primaryEvidence?.permalink,
      title: opportunity.title,
      bodyText: primaryEvidence?.summary,
      capturedAt: completedAt,
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    }
  });

  await database.normalizedContent.upsert({
    where: { id: opportunity.provenance.normalizedContentId },
    update: {
      canonicalText: opportunity.summary,
      textSegments: [opportunity.summary],
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    },
    create: {
      id: opportunity.provenance.normalizedContentId,
      rawSourceContentId: opportunity.provenance.rawContentId,
      canonicalText: opportunity.summary,
      textSegments: [opportunity.summary],
      safeMetadata: {
        scanId: opportunity.provenance.scanId,
        opportunityId: opportunity.opportunityId
      },
      provenance: opportunity.provenance
    }
  });

  await database.analysisResult.upsert({
    where: { id: opportunity.provenance.analysisRequestId },
    update: {
      status: "completed",
      structuredOutput: {
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      provenance: opportunity.provenance
    },
    create: {
      id: opportunity.provenance.analysisRequestId,
      normalizedContentId: opportunity.provenance.normalizedContentId,
      analysisType: "mvp-opportunity-scan",
      analysisVersion: "phase-4-m34",
      status: "completed",
      structuredOutput: {
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      provenance: opportunity.provenance
    }
  });

  await database.candidateOpportunityRecord.upsert({
    where: { id: opportunity.provenance.candidateId },
    update: {
      title: opportunity.title,
      summary: opportunity.summary,
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      lifecycleStatus: "generated",
      provenance: opportunity.provenance
    },
    create: {
      id: opportunity.provenance.candidateId,
      analysisResultId: opportunity.provenance.analysisRequestId,
      title: opportunity.title,
      summary: opportunity.summary,
      hypothesis: {
        title: opportunity.title,
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      lifecycleStatus: "generated",
      provenance: opportunity.provenance
    }
  });

  await database.generatedOpportunityRecord.upsert({
    where: { id: opportunity.provenance.generationOutputId },
    update: {
      title: opportunity.title,
      summary: opportunity.summary,
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      score: {
        value: opportunity.rank.score
      },
      lifecycleStatus: "ranked",
      provenance: opportunity.provenance
    },
    create: {
      id: opportunity.provenance.generationOutputId,
      candidateOpportunityId: opportunity.provenance.candidateId,
      title: opportunity.title,
      summary: opportunity.summary,
      hypothesis: {
        title: opportunity.title,
        summary: opportunity.summary
      },
      evidence: opportunity.evidence,
      confidence: {
        value: opportunity.confidence
      },
      score: {
        value: opportunity.rank.score
      },
      generationVersion: "phase-4-m34",
      lifecycleStatus: "ranked",
      provenance: opportunity.provenance
    }
  });
}
