import type {
  ConnectorCapability,
  ConnectorCapabilitySet
} from "@opportunity-os/connectors";

export const REDDIT_READ_CONTRACT_AREAS = [
  "posts",
  "comments",
  "subreddits",
  "authors",
  "pagination-metadata",
  "rate-limit-metadata"
] as const;

export type RedditReadContractArea =
  (typeof REDDIT_READ_CONTRACT_AREAS)[number];

export type RedditConnectorCapability = ConnectorCapability & {
  readonly kind: "read" | "discover";
  readonly enabled: true;
  readonly area: RedditReadContractArea;
  readonly description: string;
};

export type RedditConnectorCapabilitySet = ConnectorCapabilitySet & {
  readonly capabilities: readonly RedditConnectorCapability[];
};

export const REDDIT_CONNECTOR_CAPABILITIES = [
  {
    kind: "read",
    enabled: true,
    area: "posts",
    description: "Declares future Reddit post read contracts."
  },
  {
    kind: "read",
    enabled: true,
    area: "comments",
    description: "Declares future Reddit comment read contracts."
  },
  {
    kind: "read",
    enabled: true,
    area: "subreddits",
    description: "Declares future subreddit read contracts."
  },
  {
    kind: "read",
    enabled: true,
    area: "authors",
    description: "Declares future Reddit author read contracts."
  },
  {
    kind: "discover",
    enabled: true,
    area: "pagination-metadata",
    description: "Declares future pagination metadata contracts."
  },
  {
    kind: "discover",
    enabled: true,
    area: "rate-limit-metadata",
    description: "Declares future rate-limit metadata contracts."
  }
] as const satisfies readonly RedditConnectorCapability[];
