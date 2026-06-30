/**
 * Domain Foundation public export boundary.
 *
 * Phase 1 Milestone 6 Slice A defines package ownership only.
 * Generic domain contracts are introduced in later approved slices.
 */
export type {
  AggregateIdentity,
  AggregateRoot
} from "./aggregate/index.js";
export type { Entity, EntityIdentity } from "./entity/index.js";
export {
  DomainError,
  createDomainError,
  type DomainErrorCategory,
  type DomainErrorCode,
  type DomainErrorOptions,
  type SafeDomainErrorDetails
} from "./errors/index.js";
export type {
  DomainEventCollection,
  DomainEventCollectionSnapshot,
  DomainEventMetadata,
  DomainEventName,
  DomainEventPayload,
  DomainEventReference,
  DomainEventVersion
} from "./events/index.js";
export type {
  CreatedMetadata,
  DomainMetadata,
  UpdatedMetadata,
  VersionMetadata
} from "./metadata/index.js";
export type {
  DomainId,
  DomainTimestamp,
  DomainVersion
} from "./primitives/index.js";
export type {
  DomainRepositoryContext,
  DomainRepositoryContract
} from "./repository/index.js";
export {
  domainFailure,
  domainSuccess,
  type DomainFailure,
  type DomainResult,
  type DomainSuccess
} from "./result/index.js";
export type {
  DomainValidationFailure,
  DomainValidationIssue,
  DomainValidationResult,
  DomainValidationSuccess
} from "./validation/index.js";
export type {
  ValueObject,
  ValueObjectEquality,
  ValueObjectProperties
} from "./value-object/index.js";
