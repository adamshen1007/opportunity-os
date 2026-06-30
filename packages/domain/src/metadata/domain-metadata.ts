import type { DomainTimestamp, DomainVersion } from "../primitives/index.js";

export type CreatedMetadata = {
  readonly createdAt: DomainTimestamp;
};

export type UpdatedMetadata = {
  readonly updatedAt: DomainTimestamp;
};

export type VersionMetadata = {
  readonly version: DomainVersion;
};

export type DomainMetadata = CreatedMetadata &
  Partial<UpdatedMetadata> &
  VersionMetadata;
