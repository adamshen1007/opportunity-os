import type { ClassRegistration } from "./class-registration.js";
import type { FactoryRegistration } from "./factory-registration.js";
import type { ValueRegistration } from "./value-registration.js";

export type ServiceRegistration<TValue = unknown> =
  | ClassRegistration<TValue>
  | FactoryRegistration<TValue>
  | ValueRegistration<TValue>;

export type ServiceDescriptor<TValue = unknown> = ServiceRegistration<TValue>;

export const SERVICE_REGISTRATION_KINDS = [
  "class",
  "factory",
  "value"
] as const;

export type ServiceRegistrationKind =
  (typeof SERVICE_REGISTRATION_KINDS)[number];
