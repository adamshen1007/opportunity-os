export const STRUCTURED_OUTPUT_FIELD_KINDS = {
  string: "string",
  number: "number",
  boolean: "boolean",
  object: "object",
  array: "array"
} as const;

export type StructuredOutputFieldKind =
  (typeof STRUCTURED_OUTPUT_FIELD_KINDS)[keyof typeof STRUCTURED_OUTPUT_FIELD_KINDS];

export type StructuredOutputValue =
  | string
  | number
  | boolean
  | null
  | readonly StructuredOutputValue[]
  | { readonly [key: string]: StructuredOutputValue };

export type StructuredOutputField = {
  readonly name: string;
  readonly kind: StructuredOutputFieldKind;
  readonly required: boolean;
  readonly description?: string;
  readonly validationMetadata: {
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly allowedValues?: readonly StructuredOutputValue[];
  };
};
