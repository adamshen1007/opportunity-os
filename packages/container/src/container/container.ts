import type { ServiceDescriptor } from "../registration/index.js";
import type { DependencyResolver } from "./resolver.js";

export type ContainerContract = DependencyResolver & {
  readonly registrations: readonly ServiceDescriptor[];
};
