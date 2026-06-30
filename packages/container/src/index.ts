/**
 * Container Foundation public export boundary.
 *
 * Phase 1 Milestone 8 Slice A defines package ownership only.
 * Dependency injection and composition contracts are introduced in later approved slices.
 */
export type {
  ConfigBinding,
  ConfigBindingInput,
  LoggerBinding,
  LoggerBindingContract,
  LoggerFactoryBinding
} from "./bindings/index.js";
export type {
  ContainerContract,
  DependencyResolver
} from "./container/index.js";
export {
  COMPOSITION_RESULT_STATUSES,
  type CompositionFailure,
  type CompositionIssue,
  type CompositionResult,
  type CompositionResultStatus,
  type CompositionRoot,
  type CompositionRootInput,
  type CompositionSuccess
} from "./composition/index.js";
export {
  CONTAINER_ERROR_CODES,
  ContainerError,
  createContainerError,
  type ContainerErrorCode,
  type ContainerErrorOptions,
  type SafeContainerErrorDetails
} from "./errors/index.js";
export {
  CONTAINER_LIFETIMES,
  type ContainerLifetime
} from "./lifetime/index.js";
export type {
  ModuleDefinition,
  ModuleId,
  ModuleRegistration
} from "./modules/index.js";
export {
  SERVICE_REGISTRATION_KINDS,
  type ClassRegistration,
  type DependencyFactory,
  type FactoryRegistration,
  type FactoryResolutionContext,
  type ServiceConstructor,
  type ServiceDescriptor,
  type ServiceRegistration,
  type ServiceRegistrationKind,
  type ValueRegistration
} from "./registration/index.js";
export {
  createDependencyToken,
  type DependencyToken
} from "./tokens/index.js";
export {
  REGISTRATION_VALIDATION_ISSUE_CODES,
  type DuplicateTokenIssue,
  type MissingDependencyIssue,
  type RegistrationValidationFailure,
  type RegistrationValidationIssue,
  type RegistrationValidationIssueCode,
  type RegistrationValidationResult,
  type RegistrationValidationSuccess,
  type UnsupportedLifetimeIssue
} from "./validation/index.js";
export type {
  ContainerScope,
  ScopeFactory,
  ScopeId,
  ScopedContainer
} from "./scope/index.js";
