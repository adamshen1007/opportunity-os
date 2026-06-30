export type ApplicationCommandMetadata = {
  readonly correlationId: string;
  readonly requestId?: string;
};

export type ApplicationCommand<
  TName extends string = string,
  TPayload = unknown
> = {
  readonly name: TName;
  readonly payload: TPayload;
  readonly metadata: ApplicationCommandMetadata;
};

export type ApplicationCommandInput<TPayload = unknown> = {
  readonly payload: TPayload;
  readonly metadata: ApplicationCommandMetadata;
};
