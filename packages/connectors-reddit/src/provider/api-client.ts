import type { StructuredLogger } from "@opportunity-os/shared";
import type { RedditRuntimeFakeContext } from "../runtime/index.js";
import type { RedditAuthState } from "./auth.js";
import type {
  RedditProviderRequestBuilderInput,
  RedditProviderRequestDescription
} from "./request-builder.js";
import type { RedditHttpTransport, RedditTransportResult } from "./transport.js";

export type RedditApiClientContext = {
  readonly transport: RedditHttpTransport;
  readonly auth: RedditAuthState;
  readonly runtimeContext: RedditRuntimeFakeContext;
  readonly logger?: StructuredLogger;
};

export type RedditApiClientRequest = {
  readonly description: RedditProviderRequestDescription;
};

export type RedditApiClientResult<TBody = unknown> = RedditTransportResult<TBody> & {
  readonly description: RedditProviderRequestDescription;
};

export type RedditApiClient = {
  readonly context: RedditApiClientContext;
  readonly describe: (
    input: RedditProviderRequestBuilderInput
  ) => RedditProviderRequestDescription;
  readonly execute: <TBody = unknown>(
    request: RedditApiClientRequest
  ) => Promise<RedditApiClientResult<TBody>> | RedditApiClientResult<TBody>;
};
