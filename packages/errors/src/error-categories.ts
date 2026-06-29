export const ERROR_CATEGORIES = {
  validation: "validation",
  business: "business",
  infrastructure: "infrastructure",
  externalDependency: "external_dependency",
  internalSystem: "internal_system"
} as const;

export type ErrorCategory = (typeof ERROR_CATEGORIES)[keyof typeof ERROR_CATEGORIES];
