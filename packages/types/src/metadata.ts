export type MetadataValue =
  | string
  | number
  | boolean
  | null
  | readonly MetadataValue[]
  | { readonly [key: string]: MetadataValue };

export type SerializableMetadata = {
  readonly [key: string]: MetadataValue;
};
