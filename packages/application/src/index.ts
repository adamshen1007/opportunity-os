/**
 * Application Foundation public export boundary.
 *
 * Phase 1 Milestone 7 defines generic application-layer contracts only.
 */
export type {
  ApplicationCommand,
  ApplicationCommandHandler,
  ApplicationCommandInput,
  ApplicationCommandMetadata
} from "./commands/index.js";
export {
  createApplicationContext,
  createRequestContext,
  type ApplicationContext,
  type ApplicationContextInput,
  type CorrelationId,
  type RequestContext,
  type RequestContextInput,
  type RequestId
} from "./context/index.js";
export {
  createInjectionToken,
  type ApplicationProvider,
  type ContainerContract,
  type FactoryProvider,
  type InjectionToken,
  type ValueProvider
} from "./di/index.js";
export {
  APPLICATION_ERROR_CODES,
  ApplicationError,
  createApplicationError,
  type ApplicationErrorCategory,
  type ApplicationErrorCode,
  type ApplicationErrorOptions,
  type SafeApplicationErrorDetails
} from "./errors/index.js";
export type {
  ApplicationEventDispatchInput,
  ApplicationEventDispatchPort,
  ApplicationEventDispatchResult,
  ApplicationEventPublisher,
  ApplicationEventPublisherPort
} from "./events/index.js";
export type {
  ApplicationRepositoryPort,
  DomainRepositoryPort,
  TransactionBoundaryPort,
  TransactionScope
} from "./ports/index.js";
export type {
  ApplicationQuery,
  ApplicationQueryHandler,
  ApplicationQueryInput,
  ApplicationQueryMetadata
} from "./queries/index.js";
export type {
  ApplicationService,
  ApplicationServiceOperation
} from "./services/index.js";
export type {
  ApplicationHandler,
  HandlerExecutionContext,
  HandlerExecutionInput
} from "./handlers/index.js";
export {
  applicationFailure,
  applicationSuccess,
  type ApplicationFailure,
  type ApplicationResult,
  type ApplicationSuccess
} from "./results/index.js";
export {
  useCaseFailure,
  useCaseSuccess,
  type UseCase,
  type UseCaseContext,
  type UseCaseFailure,
  type UseCaseInput,
  type UseCaseResult,
  type UseCaseSuccess
} from "./use-cases/index.js";
export {
  applicationValidationFailure,
  applicationValidationSuccess,
  type ApplicationValidationFailure,
  type ApplicationValidationIssue,
  type ApplicationValidationResult,
  type ApplicationValidationSuccess
} from "./validation/index.js";
