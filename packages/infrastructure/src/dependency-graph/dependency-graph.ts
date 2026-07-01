import type { InfrastructureModuleId } from "../modules/index.js";

export type DependencyGraphNode = {
  readonly id: InfrastructureModuleId;
  readonly provides?: readonly string[];
  readonly requires?: readonly InfrastructureModuleId[];
};

export type DependencyGraphEdge = {
  readonly from: InfrastructureModuleId;
  readonly to: InfrastructureModuleId;
  readonly optional?: boolean;
};

export type DependencyGraphCycle = {
  readonly nodeIds: readonly InfrastructureModuleId[];
  readonly safeMessage: string;
};

export type DependencyGraphMissingDependency = {
  readonly nodeId: InfrastructureModuleId;
  readonly missingDependencyId: InfrastructureModuleId;
  readonly safeMessage: string;
};

export type DependencyGraphDuplicateRegistration = {
  readonly token: string;
  readonly moduleIds: readonly InfrastructureModuleId[];
  readonly safeMessage: string;
};

export type DependencyGraphValidationIssueCode =
  | "cycle-detected"
  | "missing-dependency"
  | "duplicate-registration";

export type DependencyGraphValidationIssue = {
  readonly code: DependencyGraphValidationIssueCode;
  readonly safeMessage: string;
  readonly path?: readonly string[];
  readonly cycle?: DependencyGraphCycle;
  readonly missingDependency?: DependencyGraphMissingDependency;
  readonly duplicateRegistration?: DependencyGraphDuplicateRegistration;
};

export type DependencyGraphValidationResult =
  | {
      readonly valid: true;
      readonly nodes: readonly DependencyGraphNode[];
      readonly edges: readonly DependencyGraphEdge[];
      readonly issues: readonly [];
    }
  | {
      readonly valid: false;
      readonly nodes: readonly DependencyGraphNode[];
      readonly edges: readonly DependencyGraphEdge[];
      readonly issues: readonly DependencyGraphValidationIssue[];
    };
