export {
  ERROR_CATEGORIES,
  type ErrorCategory
} from "./error-categories.js";
export {
  ERROR_CODES,
  type ErrorCode
} from "./error-codes.js";
export {
  OpportunityError,
  type OpportunityErrorOptions,
  type SafeErrorDetails
} from "./base-error.js";
export {
  REDACTED_ERROR_VALUE,
  redactSecretLikeValues,
  toSafeErrorDetails,
  type SafeErrorSource
} from "./safe-error.js";
