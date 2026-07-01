/**
 * Infrastructure Composition Foundation public export boundary.
 *
 * Phase 1 Milestone 9 defines package ownership and generic composition
 * contracts without creating runtime startup behavior.
 */
export type {
  InfrastructureBootstrapContract,
  InfrastructureBootstrapInput,
  InfrastructureBootstrapOutput,
  InfrastructureBootstrapStatus,
  InfrastructureBootstrapValidationIssue,
  InfrastructureBootstrapValidationIssueCode,
  InfrastructureBootstrapValidationResult,
  InfrastructureComposedContainerResult
} from "./bootstrap/index.js";
export {
  INFRASTRUCTURE_BOOTSTRAP_STATUSES
} from "./bootstrap/index.js";
export type {
  InfrastructureCompositionInput,
  InfrastructureCompositionModule,
  InfrastructureCompositionResult
} from "./composition/index.js";
export type {
  DependencyGraphCycle,
  DependencyGraphDuplicateRegistration,
  DependencyGraphEdge,
  DependencyGraphMissingDependency,
  DependencyGraphNode,
  DependencyGraphValidationIssue,
  DependencyGraphValidationIssueCode,
  DependencyGraphValidationResult
} from "./dependency-graph/index.js";
export {
  InfrastructureError,
  createInfrastructureError,
  sanitizeInfrastructureErrorMessage
} from "./errors/index.js";
export type {
  InfrastructureErrorOptions,
  SafeInfrastructureErrorDetails
} from "./errors/index.js";
export type {
  ApplicationCompositionMetadata,
  ConfigCompositionContract,
  DatabaseCompositionContract,
  DomainCompositionMetadata,
  EventCompositionContract,
  FoundationPackageCompositionContract,
  FoundationPackageCompositionMetadata,
  FoundationPackageCompositionResult,
  LoggingCompositionContract
} from "./foundation/index.js";
export type {
  HealthAggregateStatus,
  HealthAggregationResult,
  HealthCheckContract,
  HealthComponentStatus,
  HealthMetadata,
  HealthStatus
} from "./health/index.js";
export {
  HEALTH_STATUSES
} from "./health/index.js";
export type {
  InfrastructureLifecycleOrder,
  InfrastructureLifecycleParticipant,
  InfrastructureLifecycleParticipantId,
  InfrastructureLifecyclePhase
} from "./lifecycle/index.js";
export {
  INFRASTRUCTURE_LIFECYCLE_PHASES
} from "./lifecycle/index.js";
export type {
  InfrastructureModule,
  InfrastructureModuleDependency,
  InfrastructureModuleId,
  InfrastructureModuleKind,
  InfrastructurePackageName,
  PackageRegistrationMetadata,
  PackageRegistrationModule
} from "./modules/index.js";
export {
  INFRASTRUCTURE_MODULE_KINDS,
  INFRASTRUCTURE_PACKAGE_NAMES
} from "./modules/index.js";
export {
  infrastructureFailure,
  infrastructureSuccess
} from "./results/index.js";
export type {
  InfrastructureFailure,
  InfrastructureResult,
  InfrastructureSuccess
} from "./results/index.js";
export type {
  GracefulShutdownFailure,
  GracefulShutdownParticipant,
  GracefulShutdownResult,
  GracefulShutdownResultStatus
} from "./shutdown/index.js";
export {
  GRACEFUL_SHUTDOWN_RESULT_STATUSES
} from "./shutdown/index.js";
export type {
  StartupValidationCheck,
  StartupValidationCheckKind,
  StartupValidationFailure,
  StartupValidationIssue,
  StartupValidationIssueCode,
  StartupValidationResult,
  StartupValidationStatus,
  StartupValidationSuccess
} from "./startup/index.js";
export {
  STARTUP_VALIDATION_CHECK_KINDS,
  STARTUP_VALIDATION_STATUSES
} from "./startup/index.js";
