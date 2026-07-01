import {
  createDependencyToken,
  type DependencyToken,
  type ModuleRegistration,
  type ServiceDescriptor
} from "@opportunity-os/container";
import type { RedditApiClient } from "./api-client.js";
import type { RedditHttpTransport } from "./transport.js";

export const REDDIT_PROVIDER_TRANSPORT_TOKEN =
  createDependencyToken<RedditHttpTransport>(
    "reddit.provider.transport",
    "Reddit provider transport contract"
  );

export const REDDIT_PROVIDER_API_CLIENT_TOKEN =
  createDependencyToken<RedditApiClient>(
    "reddit.provider.api-client",
    "Reddit provider API client contract"
  );

export type RedditProviderBindingToken =
  | typeof REDDIT_PROVIDER_TRANSPORT_TOKEN
  | typeof REDDIT_PROVIDER_API_CLIENT_TOKEN;

export type RedditProviderBindingContract = {
  readonly transportToken: DependencyToken<RedditHttpTransport>;
  readonly apiClientToken: DependencyToken<RedditApiClient>;
  readonly registrations: readonly ServiceDescriptor[];
};

export type RedditProviderModuleRegistration = ModuleRegistration & {
  readonly id: "reddit-provider-transport";
};

export const REDDIT_PROVIDER_BINDING_CONTRACT = {
  transportToken: REDDIT_PROVIDER_TRANSPORT_TOKEN,
  apiClientToken: REDDIT_PROVIDER_API_CLIENT_TOKEN,
  registrations: []
} as const satisfies RedditProviderBindingContract;
