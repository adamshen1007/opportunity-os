export type ApplicationQueryMetadata = {
  readonly correlationId: string;
  readonly requestId?: string;
};

export type ApplicationQuery<
  TName extends string = string,
  TParameters = unknown
> = {
  readonly name: TName;
  readonly parameters: TParameters;
  readonly metadata: ApplicationQueryMetadata;
};

export type ApplicationQueryInput<TParameters = unknown> = {
  readonly parameters: TParameters;
  readonly metadata: ApplicationQueryMetadata;
};
