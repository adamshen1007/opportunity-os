export type DomainId<Name extends string = string> = string & {
  readonly __domainId: Name;
};

export type DomainTimestamp = string & {
  readonly __domainTimestamp: "iso-8601";
};

export type DomainVersion = number & {
  readonly __domainVersion: "positive-integer";
};
