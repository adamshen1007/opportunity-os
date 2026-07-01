export const CONNECTOR_CATEGORIES = [
  "source",
  "destination",
  "bidirectional",
  "utility"
] as const;

export const CONNECTOR_STABILITY_STATUSES = [
  "experimental",
  "stable",
  "deprecated"
] as const;

export type ConnectorId = string;
export type ConnectorProvider = string;
export type ConnectorVersion = string;

export type ConnectorCategory = (typeof CONNECTOR_CATEGORIES)[number];

export type ConnectorStabilityStatus =
  (typeof CONNECTOR_STABILITY_STATUSES)[number];

export type ConnectorMetadata = {
  readonly id: ConnectorId;
  readonly name: string;
  readonly version: ConnectorVersion;
  readonly description: string;
  readonly provider: ConnectorProvider;
  readonly category: ConnectorCategory;
  readonly tags: readonly string[];
  readonly stability: ConnectorStabilityStatus;
};
