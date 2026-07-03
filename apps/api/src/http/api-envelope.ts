export const API_RESPONSE_ENVELOPE_KEYS = ["ok", "data", "error", "meta"] as const;

export type ApiResponseEnvelopeKey = (typeof API_RESPONSE_ENVELOPE_KEYS)[number];
