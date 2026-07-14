import type { ApiFeedbackDto } from "../feedback/feedback-dto.js";
import type {
  ApiFeedbackStore,
  ApiFeedbackStoreCreateInput,
  ApiFeedbackStoreListInput
} from "../feedback/in-memory-feedback-store.js";
import { assertSafePersistencePayload } from "./scan-persistence.js";

export interface ApiFeedbackPersistenceDelegate {
  readonly create: (args: unknown) => Promise<ApiPersistedFeedbackRecord>;
  readonly findUnique: (args: unknown) => Promise<ApiPersistedFeedbackRecord | null>;
  readonly findMany: (args: unknown) => Promise<readonly ApiPersistedFeedbackRecord[]>;
  readonly delete?: (args: unknown) => Promise<unknown>;
}

export interface ApiFeedbackPersistenceDatabaseClient {
  readonly privateBetaFeedback: ApiFeedbackPersistenceDelegate;
}

export interface ApiPersistedFeedbackRecord {
  readonly id: string;
  readonly opportunityId: string;
  readonly opportunityRecordId?: string | null;
  readonly status: string;
  readonly reasonCategories: unknown;
  readonly ratings: unknown;
  readonly safeMetadata?: unknown;
  readonly createdAt: Date | string;
}

export function createDatabaseFeedbackStore(database: ApiFeedbackPersistenceDatabaseClient): ApiFeedbackStore {
  return {
    async createFeedback(input) {
      assertSafePersistencePayload(input);
      const record = await database.privateBetaFeedback.create({
        data: {
          id: `feedback-${input.correlationId}-${input.opportunityId}`,
          opportunityId: input.opportunityId,
          opportunityRecordId: input.opportunityRecordId,
          status: input.status,
          reasonCategories: input.reasonCategories,
          ratings: input.ratings,
          safeMetadata: input.safeMetadata
        }
      });
      return toFeedbackDto(record);
    },
    async getFeedback(feedbackId) {
      const record = await database.privateBetaFeedback.findUnique({
        where: { id: feedbackId }
      });
      return record ? toFeedbackDto(record) : undefined;
    },
    async listFeedback(input = {}) {
      const records = await database.privateBetaFeedback.findMany({
        where: toFeedbackWhere(input)
      });
      return records.map(toFeedbackDto);
    },
    async deleteFeedback(feedbackId) {
      if (!database.privateBetaFeedback.delete) return false;
      const existing = await database.privateBetaFeedback.findUnique({ where: { id: feedbackId } });
      if (!existing) return false;
      await database.privateBetaFeedback.delete({ where: { id: feedbackId } });
      return true;
    }
  };
}

function toFeedbackWhere(input: ApiFeedbackStoreListInput): Record<string, string> | undefined {
  return input.opportunityId ? { opportunityId: input.opportunityId } : undefined;
}

function toFeedbackDto(record: ApiPersistedFeedbackRecord): ApiFeedbackDto {
  return {
    feedbackId: record.id,
    opportunityId: record.opportunityId,
    opportunityRecordId: record.opportunityRecordId ?? undefined,
    status: record.status as ApiFeedbackDto["status"],
    reasonCategories: Array.isArray(record.reasonCategories)
      ? (record.reasonCategories as ApiFeedbackDto["reasonCategories"])
      : [],
    ratings: Array.isArray(record.ratings) ? (record.ratings as ApiFeedbackDto["ratings"]) : [],
    createdAt: typeof record.createdAt === "string" ? record.createdAt : record.createdAt.toISOString(),
    safeMetadata:
      record.safeMetadata && typeof record.safeMetadata === "object" && !Array.isArray(record.safeMetadata)
        ? (record.safeMetadata as ApiFeedbackDto["safeMetadata"])
        : undefined
  };
}

export function withResolvedOpportunityRecordId(
  input: ApiFeedbackStoreCreateInput,
  opportunityRecordId: string | undefined
): ApiFeedbackStoreCreateInput {
  return {
    ...input,
    opportunityRecordId: input.opportunityRecordId ?? opportunityRecordId
  };
}
