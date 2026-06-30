export type ValueObjectProperties = Readonly<Record<string, unknown>>;

export type ValueObject<
  TProperties extends ValueObjectProperties = ValueObjectProperties
> = {
  readonly properties: Readonly<TProperties>;
};

export type ValueObjectEquality<TValueObject extends ValueObject> = (
  left: TValueObject,
  right: TValueObject
) => boolean;
