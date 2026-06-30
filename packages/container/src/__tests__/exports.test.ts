import { describe, expect, expectTypeOf, it } from "vitest";
import * as container from "../index.js";
import type {
  ClassRegistration,
  CompositionResult,
  CompositionRoot,
  ConfigBinding,
  ContainerContract,
  ContainerErrorCode,
  ContainerLifetime,
  ContainerScope,
  DependencyResolver,
  DependencyToken,
  DuplicateTokenIssue,
  FactoryRegistration,
  LoggerBindingContract,
  ModuleRegistration,
  RegistrationValidationResult,
  ScopeFactory,
  ScopedContainer,
  ServiceDescriptor,
  ValueRegistration
} from "../index.js";

const expectedRuntimeExports = [
  "COMPOSITION_RESULT_STATUSES",
  "CONTAINER_ERROR_CODES",
  "CONTAINER_LIFETIMES",
  "ContainerError",
  "REGISTRATION_VALIDATION_ISSUE_CODES",
  "SERVICE_REGISTRATION_KINDS",
  "createContainerError",
  "createDependencyToken"
] as const;

describe("container public exports", () => {
  it("routes runtime exports through the package public boundary", () => {
    expect(Object.keys(container).sort()).toEqual(
      [...expectedRuntimeExports].sort()
    );
  });

  it("exposes approved type contracts from the package root", () => {
    expectTypeOf<ContainerLifetime>().toEqualTypeOf<
      "singleton" | "scoped" | "transient"
    >();
    expectTypeOf<DependencyToken<string>>().toMatchTypeOf<DependencyToken>();
    expectTypeOf<ServiceDescriptor>().toMatchTypeOf<
      ClassRegistration | FactoryRegistration | ValueRegistration
    >();
    expectTypeOf<ContainerContract>().toMatchTypeOf<DependencyResolver>();
    expectTypeOf<ScopedContainer>().toMatchTypeOf<ContainerContract>();
    expectTypeOf<ContainerScope>().toHaveProperty("dispose");
    expectTypeOf<ScopeFactory>().toHaveProperty("createScope");
    expectTypeOf<ModuleRegistration>().toHaveProperty("registrations");
    expectTypeOf<CompositionRoot>().toHaveProperty("compose");
    expectTypeOf<CompositionResult>().toHaveProperty("status");
    expectTypeOf<ConfigBinding>().toHaveProperty("config");
    expectTypeOf<LoggerBindingContract>().toHaveProperty("kind");
    expectTypeOf<RegistrationValidationResult>().toHaveProperty("valid");
    expectTypeOf<DuplicateTokenIssue>().toHaveProperty("code");
    expectTypeOf<ContainerErrorCode>().toMatchTypeOf<string>();
  });
});
