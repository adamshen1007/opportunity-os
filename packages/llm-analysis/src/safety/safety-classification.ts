export const SAFETY_CLASSIFICATIONS = {
  public: "public",
  internal: "internal",
  sensitive: "sensitive",
  restricted: "restricted"
} as const;

export type SafetyClassification =
  (typeof SAFETY_CLASSIFICATIONS)[keyof typeof SAFETY_CLASSIFICATIONS];

export type SafetyMetadata = {
  readonly classification: SafetyClassification;
  readonly redactionRequired: boolean;
  readonly allowedFields: readonly string[];
};
