import type { ApplicationContext } from "@opportunity-os/application";
import type { DomainMetadata } from "@opportunity-os/domain";
import type { InfrastructureResult } from "../results/index.js";
import type { ConfigCompositionContract } from "./config-composition.js";
import type { DatabaseCompositionContract } from "./database-composition.js";
import type { EventCompositionContract } from "./event-composition.js";
import type { LoggingCompositionContract } from "./logging-composition.js";

export type FoundationPackageCompositionMetadata = {
  readonly packageName: string;
  readonly moduleId: string;
  readonly enabled: boolean;
  readonly dependsOn?: readonly string[];
};

export type DomainCompositionMetadata = {
  readonly packageName: "@opportunity-os/domain";
  readonly metadata?: DomainMetadata;
  readonly contracts: readonly string[];
};

export type ApplicationCompositionMetadata = {
  readonly packageName: "@opportunity-os/application";
  readonly context?: ApplicationContext;
  readonly ports: readonly string[];
};

export type FoundationPackageCompositionContract = {
  readonly metadata: readonly FoundationPackageCompositionMetadata[];
  readonly config?: ConfigCompositionContract;
  readonly logging?: LoggingCompositionContract;
  readonly events?: EventCompositionContract;
  readonly database?: DatabaseCompositionContract;
  readonly domain?: DomainCompositionMetadata;
  readonly application?: ApplicationCompositionMetadata;
};

export type FoundationPackageCompositionResult =
  InfrastructureResult<FoundationPackageCompositionContract>;
