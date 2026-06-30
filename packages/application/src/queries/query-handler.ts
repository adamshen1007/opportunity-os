import type { ApplicationQuery } from "./query.js";

export type ApplicationQueryHandler<
  TQuery extends ApplicationQuery = ApplicationQuery,
  TResult = unknown
> = {
  readonly queryName: TQuery["name"];
  execute(query: TQuery): Promise<TResult>;
};
