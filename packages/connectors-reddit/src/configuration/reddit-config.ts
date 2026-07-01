import type {
  ConnectorConfig,
  ConnectorConfigField,
  ConnectorConfigInput,
  ConnectorSensitiveConfigField
} from "@opportunity-os/connectors";

export const REDDIT_CONFIG_FIELD_KEYS = [
  "clientId",
  "clientSecret",
  "refreshToken",
  "accessToken",
  "userAgent",
  "readOnlyMode"
] as const;

export const REDDIT_REQUIRED_CONFIG_FIELD_KEYS = [
  "userAgent",
  "readOnlyMode"
] as const;

export const REDDIT_SENSITIVE_CONFIG_FIELD_KEYS = [
  "clientId",
  "clientSecret",
  "refreshToken",
  "accessToken"
] as const;

export const REDDIT_OAUTH_CONFIG_FIELD_KEYS = [
  "clientId",
  "clientSecret",
  "refreshToken",
  "accessToken"
] as const;

export type RedditConfigFieldKey =
  (typeof REDDIT_CONFIG_FIELD_KEYS)[number];

export type RedditRequiredConfigFieldKey =
  (typeof REDDIT_REQUIRED_CONFIG_FIELD_KEYS)[number];

export type RedditSensitiveConfigFieldKey =
  (typeof REDDIT_SENSITIVE_CONFIG_FIELD_KEYS)[number];

export type RedditOAuthConfigFieldKey =
  (typeof REDDIT_OAUTH_CONFIG_FIELD_KEYS)[number];

type RedditNonSensitiveConfigField =
  ConnectorConfigField<string | boolean> & {
    readonly key: Exclude<RedditConfigFieldKey, RedditSensitiveConfigFieldKey>;
    readonly sensitive?: false;
  };

type RedditSensitiveConfigField =
  ConnectorSensitiveConfigField<string> & {
    readonly key: RedditSensitiveConfigFieldKey;
  };

export type RedditConnectorConfigField =
  | RedditNonSensitiveConfigField
  | RedditSensitiveConfigField;

export type RedditConnectorConfigInput = ConnectorConfigInput & {
  readonly fields: readonly RedditConnectorConfigField[];
};

export type RedditConnectorConfig = ConnectorConfig & {
  readonly fields: readonly RedditConnectorConfigField[];
};
