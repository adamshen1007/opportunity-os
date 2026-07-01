import type {
  ConnectorOperationContract,
  ConnectorOperationInput,
  ConnectorOperationOutput
} from "@opportunity-os/connectors";
import type { RedditDataEnvelope } from "../data/index.js";

export const REDDIT_OPERATION_NAMES = [
  "reddit.read.posts",
  "reddit.read.comments",
  "reddit.read.subreddits",
  "reddit.read.authors"
] as const;

export type RedditOperationName = (typeof REDDIT_OPERATION_NAMES)[number];

export type RedditReadOperationFilters = {
  readonly subredditName?: string;
  readonly authorUsername?: string;
  readonly query?: string;
};

export type RedditOperationInput = ConnectorOperationInput<{
  readonly operationName: RedditOperationName;
  readonly filters?: RedditReadOperationFilters;
}>;

export type RedditOperationOutput =
  ConnectorOperationOutput<RedditDataEnvelope>;

export type RedditOperationContract =
  ConnectorOperationContract<RedditOperationInput["value"], RedditDataEnvelope> & {
    readonly name: RedditOperationName;
    readonly output?: RedditOperationOutput;
  };
