import type { StructuredOutputField } from "./structured-output-field.js";

export type StructuredOutputContract = {
  readonly schemaName: string;
  readonly schemaVersion: string;
  readonly fields: readonly StructuredOutputField[];
  readonly requiredFields: readonly string[];
  readonly optionalFields: readonly string[];
  readonly validationMetadata: {
    readonly allowAdditionalFields: boolean;
    readonly issueCodes: readonly string[];
  };
};
