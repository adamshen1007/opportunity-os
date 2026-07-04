import type { ApiAuthPrincipal } from "./auth-context.js";
import type { ApiInviteStatus } from "./invite-status.js";
import type { ApiSessionStatus } from "./session-status.js";

export interface ApiInviteDto {
  readonly inviteId: string;
  readonly email: string;
  readonly status: ApiInviteStatus;
  readonly createdAt: string;
  readonly expiresAt?: string;
  readonly acceptedAt?: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ApiCreateInviteRequestBody {
  readonly email?: string;
  readonly inviteCode?: string;
  readonly expiresAt?: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ApiAcceptInviteRequestBody {
  readonly inviteCode?: string;
  readonly displayName?: string;
}

export interface ApiSessionDto {
  readonly sessionId: string;
  readonly status: ApiSessionStatus;
  readonly principal: ApiAuthPrincipal;
  readonly createdAt: string;
  readonly expiresAt: string;
}

export interface ApiInviteAcceptanceDto {
  readonly invite: ApiInviteDto;
  readonly session: ApiSessionDto;
}
