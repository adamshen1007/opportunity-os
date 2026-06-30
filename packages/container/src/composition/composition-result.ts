import type { ContainerContract } from "../container/index.js";

export const COMPOSITION_RESULT_STATUSES = [
  "success",
  "failure"
] as const;

export type CompositionResultStatus =
  (typeof COMPOSITION_RESULT_STATUSES)[number];

export type CompositionIssue = {
  readonly code: string;
  readonly message: string;
  readonly path?: readonly string[];
};

export type CompositionSuccess = {
  readonly status: "success";
  readonly container: ContainerContract;
};

export type CompositionFailure = {
  readonly status: "failure";
  readonly issues: readonly CompositionIssue[];
};

export type CompositionResult =
  | CompositionSuccess
  | CompositionFailure;
