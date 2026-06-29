export const ERROR_CODES = {
  validationFailed: "VALIDATION_FAILED",
  businessRuleRejected: "BUSINESS_RULE_REJECTED",
  infrastructureUnavailable: "INFRASTRUCTURE_UNAVAILABLE",
  externalDependencyFailed: "EXTERNAL_DEPENDENCY_FAILED",
  internalSystemFailure: "INTERNAL_SYSTEM_FAILURE"
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
