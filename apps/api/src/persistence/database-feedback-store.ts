import type { ApiFeedbackDto } from "../feedback/feedback-dto.js";
import type {
  ApiFeedbackStore,
  ApiFeedbackStoreCreateInput,
  ApiFeedbackStoreListInput
} from "../feedback/in-memory-feedback-store.js";
import { assertSafePersistencePayload } from "./scan-persistence.js";
import { ownerWhere } from "../ownership/index.js";

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
  readonly ownerPrincipalId: string;
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
          ownerPrincipalId: input.ownerPrincipalId,
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
    async getFeedback(scope, feedbackId) {
      const record = await database.privateBetaFeedback.findUnique({
        where: { id: feedbackId, ...ownerWhere(scope) }
      });
      return record ? toFeedbackDto(record) : undefined;
    },
    async listFeedback(input) {
      const records = await database.privateBetaFeedback.findMany({
        where: toFeedbackWhere(input)
      });
      return records.map(toFeedbackDto);
    },
    async deleteFeedback(scope, feedbackId) {
      if (!database.privateBetaFeedback.delete) return false;
      const existing = await database.privateBetaFeedback.findUnique({ where: { id: feedbackId, ...ownerWhere(scope) } });
      if (!existing) return false;
      await database.privateBetaFeedback.delete({ where: { id: feedbackId } });
      return true;
    }
  };
}

function toFeedbackWhere(input: ApiFeedbackStoreListInput): Record<string, string> {
  return { ...ownerWhere(input.scope), ...(input.opportunityId ? { opportunityId: input.opportunityId } : {}) };
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
  if (!opportunityRecordId) throw new Error("Owned opportunity record was not found.");
  return {
    ...input,
    opportunityRecordId
  };
}
