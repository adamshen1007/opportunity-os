import type { ApiFeedbackDto } from "./feedback-dto.js";
import type { ValidatedApiFeedbackInput } from "./feedback-validation.js";

export interface ApiFeedbackStoreCreateInput extends ValidatedApiFeedbackInput {
  readonly correlationId: string;
  readonly requestId?: string;
}

export interface ApiFeedbackStoreListInput {
  readonly opportunityId?: string;
}

export interface ApiFeedbackStore {
  readonly createFeedback: (input: ApiFeedbackStoreCreateInput) => Promise<ApiFeedbackDto>;
  readonly getFeedback: (feedbackId: string) => Promise<ApiFeedbackDto | undefined>;
  readonly listFeedback: (input?: ApiFeedbackStoreListInput) => Promise<readonly ApiFeedbackDto[]>;
  readonly deleteFeedback: (feedbackId: string) => Promise<boolean>;
}

export interface InMemoryFeedbackStoreInput {
  readonly initialFeedback?: readonly ApiFeedbackDto[];
  readonly clock?: () => string;
  readonly idFactory?: () => string;
}

export function createInMemoryFeedbackStore(input: InMemoryFeedbackStoreInput = {}): ApiFeedbackStore {
  const feedback = [...(input.initialFeedback ?? [])];
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
      feedback.push(item);
      return cloneFeedback(item);
    },
    async getFeedback(feedbackId) {
      const item = feedback.find((candidate) => candidate.feedbackId === feedbackId);
      return item ? cloneFeedback(item) : undefined;
    },
    async listFeedback(listInput = {}) {
      return feedback
        .filter((item) => listInput.opportunityId === undefined || item.opportunityId === listInput.opportunityId)
        .map((item) => cloneFeedback(item));
    },
    async deleteFeedback(feedbackId) {
      const index = feedback.findIndex((item) => item.feedbackId === feedbackId);
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
