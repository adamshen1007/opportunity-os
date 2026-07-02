export const UNICODE_NORMALIZATION_FORMS = [
  "NFC",
  "NFD",
  "NFKC",
  "NFKD"
] as const;

export type UnicodeNormalizationForm =
  (typeof UNICODE_NORMALIZATION_FORMS)[number];

export type UnicodeNormalizationOptions = {
  readonly form: UnicodeNormalizationForm;
  readonly stripControlCharacters: boolean;
  readonly preserveEmoji: boolean;
};

export type UnicodeNormalizationContract = {
  readonly stage: "unicode-normalization";
  readonly options: UnicodeNormalizationOptions;
};
