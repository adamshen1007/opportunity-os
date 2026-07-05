import {
  API_VALIDATION_ISSUE_CODES,
  createApiValidationFailure,
  createApiValidationSuccess,
  type ApiValidationIssue,
  type ApiValidationResult
} from "../validation/index.js";
import {
  API_FEEDBACK_RATING_TARGETS,
  API_FEEDBACK_RATING_VALUES,
  type ApiFeedbackRatingTarget,
  type ApiFeedbackRatingValue
} from "./feedback-rating.js";
import { API_FEEDBACK_REASON_CATEGORIES, type ApiFeedbackReasonCategory } from "./feedback-reason-category.js";
import { API_FEEDBACK_STATUSES, type ApiFeedbackStatus } from "./feedback-status.js";
import type { ApiCreateFeedbackRequestBody, ApiFeedbackRatingDto } from "./feedback-dto.js";

export interface ValidatedApiFeedbackInput {
  readonly opportunityId: string;
  readonly opportunityRecordId?: string;
  readonly status: ApiFeedbackStatus;
  readonly reasonCategories: readonly ApiFeedbackReasonCategory[];
  readonly ratings: readonly ApiFeedbackRatingDto[];
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export function validateCreateFeedbackBody(
  body: ApiCreateFeedbackRequestBody | undefined
): ApiValidationResult<ValidatedApiFeedbackInput> {
  const issues: ApiValidationIssue[] = [];

  if (body?.opportunityId === undefined || body.opportunityId.trim().length === 0) {
    issues.push({
      code: API_VALIDATION_ISSUE_CODES.missingRequiredField,
      field: "opportunityId",
      message: "opportunityId is required."
    });
  }

  if (body?.status === undefined) {
    issues.push({
      code: API_VALIDATION_ISSUE_CODES.missingRequiredField,
      field: "status",
      message: "status is required."
    });
  } else if (!isApiFeedbackStatus(body.status)) {
    issues.push({
      code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
      field: "status",
      message: "status is unsupported."
    });
  }

  const reasonCategories = body?.reasonCategories ?? [];
  reasonCategories.forEach((category, index) => {
    if (!isApiFeedbackReasonCategory(category)) {
      issues.push({
        code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
        field: `reasonCategories.${index}`,
        message: "reason category is unsupported."
      });
    }
  });

  const ratings = body?.ratings ?? [];
  ratings.forEach((rating, index) => {
    if (!isApiFeedbackRatingTarget(rating.target)) {
      issues.push({
        code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
        field: `ratings.${index}.target`,
        message: "rating target is unsupported."
      });
    }

    if (!isApiFeedbackRatingValue(rating.value)) {
      issues.push({
        code: API_VALIDATION_ISSUE_CODES.unsupportedValue,
        field: `ratings.${index}.value`,
        message: "rating value is unsupported."
      });
    }
  });

  if (issues.length > 0 || body?.opportunityId === undefined || body.status === undefined) {
    return createApiValidationFailure(issues);
  }

  return createApiValidationSuccess({
    opportunityId: body.opportunityId,
    opportunityRecordId:
      body.opportunityRecordId !== undefined && body.opportunityRecordId.trim().length > 0
        ? body.opportunityRecordId
        : undefined,
    status: body.status,
    reasonCategories: [...reasonCategories],
    ratings: ratings.map((rating) => ({ ...rating })),
    safeMetadata: body.safeMetadata ? { ...body.safeMetadata } : undefined
  });
}

function isApiFeedbackStatus(status: string): status is ApiFeedbackStatus {
  return Object.values(API_FEEDBACK_STATUSES).includes(status as ApiFeedbackStatus);
}

function isApiFeedbackReasonCategory(category: string): category is ApiFeedbackReasonCategory {
  return Object.values(API_FEEDBACK_REASON_CATEGORIES).includes(category as ApiFeedbackReasonCategory);
}

function isApiFeedbackRatingTarget(target: string): target is ApiFeedbackRatingTarget {
  return Object.values(API_FEEDBACK_RATING_TARGETS).includes(target as ApiFeedbackRatingTarget);
}

function isApiFeedbackRatingValue(value: number): value is ApiFeedbackRatingValue {
  return (API_FEEDBACK_RATING_VALUES as readonly number[]).includes(value);
}
