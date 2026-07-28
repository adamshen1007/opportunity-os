import type { ApiFeedbackRatingTarget, ApiFeedbackRatingValue } from "./feedback-rating.js";
import type { ApiFeedbackReasonCategory } from "./feedback-reason-category.js";
import type { ApiFeedbackStatus } from "./feedback-status.js";

export interface ApiFeedbackRatingDto {
  readonly target: ApiFeedbackRatingTarget;
  readonly value: ApiFeedbackRatingValue;
}

export interface ApiFeedbackDto {
  readonly feedbackId: string;
  readonly opportunityId: string;
  readonly opportunityRecordId?: string;
  readonly status: ApiFeedbackStatus;
  readonly reasonCategories: readonly ApiFeedbackReasonCategory[];
  readonly ratings: readonly ApiFeedbackRatingDto[];
  readonly createdAt: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ApiFeedbackCollectionDto {
  readonly feedback: readonly ApiFeedbackDto[];
  readonly totalCount: number;
}

export interface ApiCreateFeedbackRequestBody {
  readonly opportunityId?: string;
  readonly status?: ApiFeedbackStatus;
  readonly reasonCategories?: readonly ApiFeedbackReasonCategory[];
  readonly ratings?: readonly ApiFeedbackRatingDto[];
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}
