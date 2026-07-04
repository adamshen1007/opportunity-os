export const API_INVITE_STATUSES = {
  pending: "pending",
  accepted: "accepted",
  revoked: "revoked",
  expired: "expired"
} as const;

export type ApiInviteStatus = (typeof API_INVITE_STATUSES)[keyof typeof API_INVITE_STATUSES];
