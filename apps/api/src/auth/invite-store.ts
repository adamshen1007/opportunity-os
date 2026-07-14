import { createAuthenticatedAuthContext } from "./auth-context.js";
import type { ApiInviteDto, ApiSessionDto } from "./invite-dto.js";
import { API_INVITE_STATUSES } from "./invite-status.js";
import { API_SESSION_STATUSES } from "./session-status.js";
import type { ValidatedApiInviteAcceptanceInput, ValidatedApiInviteCreationInput } from "./invite-validation.js";

export const API_INVITE_ACCEPTANCE_FAILURE_REASONS = {
  inviteNotFound: "invite_not_found",
  inviteExpired: "invite_expired",
  inviteNotPending: "invite_not_pending"
} as const;

export type ApiInviteAcceptanceFailureReason =
  (typeof API_INVITE_ACCEPTANCE_FAILURE_REASONS)[keyof typeof API_INVITE_ACCEPTANCE_FAILURE_REASONS];

export type ApiInviteAcceptanceResult =
  | { readonly accepted: true; readonly invite: ApiInviteDto; readonly session: ApiSessionDto }
  | { readonly accepted: false; readonly reason: ApiInviteAcceptanceFailureReason; readonly safeMessage: string };

export interface ApiInviteRecord extends ApiInviteDto {
  readonly inviteCode: string;
}

export interface ApiInviteStoreCreateInput extends ValidatedApiInviteCreationInput {
  readonly correlationId: string;
  readonly requestId?: string;
}

export class ApiInviteConflictError extends Error {
  constructor() {
    super("An invite already exists for this email or invite code.");
    this.name = "ApiInviteConflictError";
  }
}

export interface ApiInviteStore {
  readonly createInvite: (input: ApiInviteStoreCreateInput) => Promise<ApiInviteDto>;
  readonly acceptInvite: (input: ValidatedApiInviteAcceptanceInput) => Promise<ApiInviteAcceptanceResult>;
  readonly getSession: (sessionId: string) => Promise<ApiSessionDto | undefined>;
  readonly revokeSession: (sessionId: string) => Promise<boolean>;
}

export interface InMemoryInviteStoreInput {
  readonly initialInvites?: readonly ApiInviteRecord[];
  readonly initialSessions?: readonly ApiSessionDto[];
  readonly clock?: () => string;
  readonly inviteIdFactory?: () => string;
  readonly sessionIdFactory?: () => string;
  readonly sessionTtlMs?: number;
}

export function createInMemoryInviteStore(input: InMemoryInviteStoreInput = {}): ApiInviteStore {
  const invites = [...(input.initialInvites ?? [])].map(cloneInviteRecord);
  const sessions = [...(input.initialSessions ?? [])].map(cloneSession);
  let inviteSequence = invites.length;
  let sessionSequence = sessions.length;
  const clock = input.clock ?? (() => new Date().toISOString());
  const inviteIdFactory = input.inviteIdFactory ?? (() => `invite-${++inviteSequence}`);
  const sessionIdFactory = input.sessionIdFactory ?? (() => `session-${++sessionSequence}`);
  const sessionTtlMs = input.sessionTtlMs ?? 1000 * 60 * 60 * 8;

  return {
    async createInvite(createInput) {
      if (invites.some((invite) => invite.email === createInput.email || invite.inviteCode === createInput.inviteCode)) {
        throw new ApiInviteConflictError();
      }
      const invite: ApiInviteRecord = {
        inviteId: inviteIdFactory(),
        inviteCode: createInput.inviteCode,
        email: createInput.email,
        status: API_INVITE_STATUSES.pending,
        createdAt: clock(),
        expiresAt: createInput.expiresAt,
        safeMetadata: createInput.safeMetadata ? { ...createInput.safeMetadata } : undefined
      };
      invites.push(invite);
      return toInviteDto(invite);
    },
    async acceptInvite(acceptInput) {
      const inviteIndex = invites.findIndex((candidate) => candidate.inviteCode === acceptInput.inviteCode);
      if (inviteIndex < 0) {
        return {
          accepted: false,
          reason: API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotFound,
          safeMessage: "Invite is not valid."
        };
      }

      const invite = invites[inviteIndex];
      if (invite === undefined) {
        return {
          accepted: false,
          reason: API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotFound,
          safeMessage: "Invite is not valid."
        };
      }

      const now = clock();
      if (invite.expiresAt && Date.parse(invite.expiresAt) <= Date.parse(now)) {
        invites[inviteIndex] = { ...invite, status: API_INVITE_STATUSES.expired };
        return {
          accepted: false,
          reason: API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteExpired,
          safeMessage: "Invite has expired."
        };
      }

      if (invite.status !== API_INVITE_STATUSES.pending) {
        return {
          accepted: false,
          reason: API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotPending,
          safeMessage: "Invite is no longer available."
        };
      }

      const acceptedInvite: ApiInviteRecord = {
        ...invite,
        status: API_INVITE_STATUSES.accepted,
        acceptedAt: now
      };
      invites[inviteIndex] = acceptedInvite;

      const session: ApiSessionDto = {
        sessionId: sessionIdFactory(),
        status: API_SESSION_STATUSES.active,
        principal: createAuthenticatedAuthContext({
          principalId: acceptedInvite.email,
          displayName: acceptInput.displayName,
          permissions: ["private-beta:access"]
        }).principal!,
        createdAt: now,
        expiresAt: new Date(Date.parse(now) + sessionTtlMs).toISOString()
      };
      sessions.push(session);

      return {
        accepted: true,
        invite: toInviteDto(acceptedInvite),
        session: cloneSession(session)
      };
    },
    async getSession(sessionId) {
      const session = sessions.find((candidate) => candidate.sessionId === sessionId);
      if (!session || session.status !== API_SESSION_STATUSES.active || Date.parse(session.expiresAt) <= Date.parse(clock())) {
        return undefined;
      }
      return cloneSession(session);
    },
    async revokeSession(sessionId) {
      const sessionIndex = sessions.findIndex((candidate) => candidate.sessionId === sessionId);
      const session = sessions[sessionIndex];
      if (sessionIndex < 0 || session === undefined) return false;
      sessions[sessionIndex] = { ...session, status: API_SESSION_STATUSES.revoked };
      return true;
    }
  };
}

function toInviteDto(invite: ApiInviteRecord): ApiInviteDto {
  return {
    inviteId: invite.inviteId,
    email: invite.email,
    status: invite.status,
    createdAt: invite.createdAt,
    expiresAt: invite.expiresAt,
    acceptedAt: invite.acceptedAt,
    safeMetadata: invite.safeMetadata ? { ...invite.safeMetadata } : undefined
  };
}

function cloneInviteRecord(invite: ApiInviteRecord): ApiInviteRecord {
  return {
    ...invite,
    safeMetadata: invite.safeMetadata ? { ...invite.safeMetadata } : undefined
  };
}

function cloneSession(session: ApiSessionDto): ApiSessionDto {
  return {
    ...session,
    principal: {
      ...session.principal,
      permissions: [...session.principal.permissions]
    }
  };
}
