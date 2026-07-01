import type { ConnectorMetadata } from "@opportunity-os/connectors";

export type RedditConnectorProvider = "reddit";

export type RedditConnectorTag =
  | "reddit"
  | "social"
  | "community"
  | "read-contract";

export type RedditConnectorMetadata = ConnectorMetadata & {
  readonly provider: RedditConnectorProvider;
  readonly tags: readonly RedditConnectorTag[];
  readonly description: string;
};

export const REDDIT_CONNECTOR_METADATA = {
  id: "reddit",
  name: "Reddit",
  version: "0.0.0",
  description: "Reddit connector contract package for future read-only data acquisition.",
  provider: "reddit",
  category: "source",
  tags: ["reddit", "social", "community", "read-contract"],
  stability: "experimental"
} as const satisfies RedditConnectorMetadata;
