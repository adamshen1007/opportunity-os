export const API_SESSION_STATUSES = {
  active: "active",
  expired: "expired",
  revoked: "revoked"
} as const;

export type ApiSessionStatus = (typeof API_SESSION_STATUSES)[keyof typeof API_SESSION_STATUSES];
