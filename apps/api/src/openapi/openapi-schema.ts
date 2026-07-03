export interface ApiOpenApiSchema {
  readonly type: "array" | "boolean" | "integer" | "number" | "object" | "string";
  readonly description?: string;
  readonly properties?: Readonly<Record<string, ApiOpenApiSchema>>;
  readonly items?: ApiOpenApiSchema;
  readonly required?: readonly string[];
}
