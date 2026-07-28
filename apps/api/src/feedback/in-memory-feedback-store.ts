import type { ApiFeedbackDto } from "./feedback-dto.js";
import type { ValidatedApiFeedbackInput } from "./feedback-validation.js";
import { LOCAL_DEVELOPMENT_PRINCIPAL_ID, ownsPrincipal, type ApiOwnershipScope } from "../ownership/index.js";

export interface ApiFeedbackStoreCreateInput extends ValidatedApiFeedbackInput {
  readonly ownerPrincipalId: string;
  readonly opportunityRecordId: string;
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiFeedbackStoreListInput {
  readonly scope: ApiOwnershipScope;
  readonly opportunityId?: string;
}

export interface ApiFeedbackStore {
  readonly createFeedback: (input: ApiFeedbackStoreCreateInput) => Promise<ApiFeedbackDto>;
  readonly getFeedback: (scope: ApiOwnershipScope, feedbackId: string) => Promise<ApiFeedbackDto | undefined>;
  readonly listFeedback: (input: ApiFeedbackStoreListInput) => Promise<readonly ApiFeedbackDto[]>;
  readonly deleteFeedback: (scope: ApiOwnershipScope, feedbackId: string) => Promise<boolean>;
}

export interface InMemoryFeedbackStoreInput {
  readonly initialFeedback?: readonly ApiFeedbackDto[];
  readonly initialOwnerPrincipalId?: string;
  readonly clock?: () => string;
  readonly idFactory?: () => string;
}

export function createInMemoryFeedbackStore(input: InMemoryFeedbackStoreInput = {}): ApiFeedbackStore {
  const feedback = (input.initialFeedback ?? []).map((item) => ({
    ownerPrincipalId: input.initialOwnerPrincipalId ?? LOCAL_DEVELOPMENT_PRINCIPAL_ID,
    item
  }));
  let sequence = feedback.length;
  const clock = input.clock ?? (() => new Date().toISOString());
  const idFactory = input.idFactory ?? (() => `feedback-${++sequence}`);

  return {
    async createFeedback(createInput) {
      const item: ApiFeedbackDto = {
        feedbackId: idFactory(),
        opportunityId: createInput.opportunityId,
        opportunityRecordId: createInput.opportunityRecordId,
        status: createInput.status,
        reasonCategories: [...createInput.reasonCategories],
        ratings: createInput.ratings.map((rating) => ({ ...rating })),
        createdAt: clock(),
        safeMetadata: createInput.safeMetadata ? { ...createInput.safeMetadata } : undefined
      };
      feedback.push({ ownerPrincipalId: createInput.ownerPrincipalId, item });
      return cloneFeedback(item);
    },
    async getFeedback(scope, feedbackId) {
      const record = feedback.find((candidate) => candidate.item.feedbackId === feedbackId && ownsPrincipal(scope, candidate.ownerPrincipalId));
      return record ? cloneFeedback(record.item) : undefined;
    },
    async listFeedback(listInput) {
      return feedback
        .filter((record) => ownsPrincipal(listInput.scope, record.ownerPrincipalId))
        .filter((record) => listInput.opportunityId === undefined || record.item.opportunityId === listInput.opportunityId)
        .map((record) => cloneFeedback(record.item));
    },
    async deleteFeedback(scope, feedbackId) {
      const index = feedback.findIndex((record) => record.item.feedbackId === feedbackId && ownsPrincipal(scope, record.ownerPrincipalId));
      if (index < 0) return false;
      feedback.splice(index, 1);
      return true;
    }
  };
}

function cloneFeedback(feedback: ApiFeedbackDto): ApiFeedbackDto {
  return {
    ...feedback,
    reasonCategories: [...feedback.reasonCategories],
    ratings: feedback.ratings.map((rating) => ({ ...rating })),
    safeMetadata: feedback.safeMetadata ? { ...feedback.safeMetadata } : undefined
  };
}
