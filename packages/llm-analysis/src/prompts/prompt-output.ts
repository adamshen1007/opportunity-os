import type { StructuredOutputValue } from "../structured-output/index.js";

export type PromptOutput = {
  readonly outputId: string;
  readonly schemaName: string;
  readonly schemaVersion: string;
  readonly values: Readonly<Record<string, StructuredOutputValue>>;
  readonly warnings: readonly string[];
};
