import type {
  CompositionResult,
  ContainerContract
} from "@opportunity-os/container";
import type { InfrastructureCompositionModule } from "../composition/index.js";
import type { InfrastructureModule } from "../modules/index.js";

export const INFRASTRUCTURE_BOOTSTRAP_STATUSES = [
  "ready",
  "invalid"
] as const;

export type InfrastructureBootstrapStatus =
  (typeof INFRASTRUCTURE_BOOTSTRAP_STATUSES)[number];

export type InfrastructureBootstrapValidationIssueCode =
  | "missing-module"
  | "invalid-registration"
  | "composition-failed";

export type InfrastructureBootstrapValidationIssue = {
  readonly code: InfrastructureBootstrapValidationIssueCode;
  readonly message: string;
  readonly path?: readonly string[];
};

export type InfrastructureBootstrapValidationResult =
  | {
      readonly valid: true;
      readonly issues: readonly [];
    }
  | {
      readonly valid: false;
      readonly issues: readonly InfrastructureBootstrapValidationIssue[];
    };

export type InfrastructureBootstrapInput = {
  readonly modules: readonly InfrastructureModule[];
  readonly compositionModules?: readonly InfrastructureCompositionModule[];
};

export type InfrastructureComposedContainerResult =
  | {
      readonly status: "ready";
      readonly container: ContainerContract;
      readonly composition: CompositionResult;
      readonly validation: Extract<
        InfrastructureBootstrapValidationResult,
        { readonly valid: true }
      >;
    }
  | {
      readonly status: "invalid";
      readonly validation: Extract<
        InfrastructureBootstrapValidationResult,
        { readonly valid: false }
      >;
      readonly composition?: CompositionResult;
    };

export type InfrastructureBootstrapOutput =
  InfrastructureComposedContainerResult;

export type InfrastructureBootstrapContract = {
  readonly bootstrap: (
    input: InfrastructureBootstrapInput
  ) => InfrastructureBootstrapOutput;
};
