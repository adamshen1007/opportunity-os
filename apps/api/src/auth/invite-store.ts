import { createAuthenticatedAuthContext } from "./auth-context.js";
import type { ApiInviteDto, ApiSessionDto } from "./invite-dto.js";
import { API_INVITE_STATUSES } from "./invite-status.js";
import { API_SESSION_STATUSES } from "./session-status.js";
import type { ValidatedApiInviteAcceptanceInput, ValidatedApiInviteCreationInput } from "./invite-validation.js";
import { generateSessionToken, hashAuthSecret, timingSafeStringEqual } from "./auth-secret.js";

export const API_INVITE_ACCEPTANCE_FAILURE_REASONS = {
  inviteNotFound: "invite_not_found",
  inviteExpired: "invite_expired",
  inviteNotPending: "invite_not_pending"
} as const;

export type ApiInviteAcceptanceFailureReason =
  (typeof API_INVITE_ACCEPTANCE_FAILURE_REASONS)[keyof typeof API_INVITE_ACCEPTANCE_FAILURE_REASONS];

export type ApiInviteAcceptanceResult =
  | { readonly accepted: true; readonly invite: ApiInviteDto; readonly session: ApiSessionDto; readonly sessionToken: string }
  | { readonly accepted: false; readonly reason: ApiInviteAcceptanceFailureReason; readonly safeMessage: string };

export interface ApiInviteRecord extends ApiInviteDto {
  readonly inviteCodeHash: string;
}

export interface ApiSessionRecord {
  readonly internalId: string;
  readonly inviteId: string;
  readonly tokenHash: string;
  readonly session: ApiSessionDto;
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
  readonly getSession: (sessionToken: string) => Promise<ApiSessionDto | undefined>;
  readonly revokeSession: (sessionToken: string) => Promise<boolean>;
  readonly revokeInvite: (inviteId: string) => Promise<boolean>;
}

export interface InMemoryInviteStoreInput {
  readonly initialInvites?: readonly ApiInviteRecord[];
  readonly initialSessions?: readonly ApiSessionRecord[];
  readonly clock?: () => string;
  readonly inviteIdFactory?: () => string;
  readonly sessionIdFactory?: () => string;
  readonly sessionTokenFactory?: () => string;
  readonly sessionTtlMs?: number;
  readonly inviteTtlMs?: number;
  readonly secretPepper?: string;
}

export function createInMemoryInviteStore(input: InMemoryInviteStoreInput = {}): ApiInviteStore {
  const invites = [...(input.initialInvites ?? [])].map(cloneInviteRecord);
  const sessions = [...(input.initialSessions ?? [])].map(cloneSessionRecord);
  let inviteSequence = invites.length;
  let sessionSequence = sessions.length;
  const clock = input.clock ?? (() => new Date().toISOString());
  const inviteIdFactory = input.inviteIdFactory ?? (() => `invite-${++inviteSequence}`);
  const sessionIdFactory = input.sessionIdFactory ?? (() => `session-${++sessionSequence}`);
  const sessionTokenFactory = input.sessionTokenFactory ?? generateSessionToken;
  const sessionTtlMs = input.sessionTtlMs ?? 1000 * 60 * 60 * 8;
  const inviteTtlMs = input.inviteTtlMs ?? 1000 * 60 * 60 * 24 * 7;
  const secretPepper = input.secretPepper ?? "in-memory-auth-pepper";

  return {
    async createInvite(createInput) {
      const inviteCodeHash = hashAuthSecret(createInput.inviteCode, secretPepper);
      if (invites.some((invite) => invite.email === createInput.email || timingSafeStringEqual(invite.inviteCodeHash, inviteCodeHash))) {
        throw new ApiInviteConflictError();
      }
      const invite: ApiInviteRecord = {
        inviteId: inviteIdFactory(),
        inviteCodeHash,
        email: createInput.email,
        status: API_INVITE_STATUSES.pending,
        createdAt: clock(),
        expiresAt: createInput.expiresAt ?? new Date(Date.parse(clock()) + inviteTtlMs).toISOString(),
        safeMetadata: createInput.safeMetadata ? { ...createInput.safeMetadata } : undefined
      };
      invites.push(invite);
      return toInviteDto(invite);
    },
    async acceptInvite(acceptInput) {
      const inviteCodeHash = hashAuthSecret(acceptInput.inviteCode, secretPepper);
      const inviteIndex = invites.findIndex((candidate) => timingSafeStringEqual(candidate.inviteCodeHash, inviteCodeHash));
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

      const sessionToken = sessionTokenFactory();
      const session: ApiSessionDto = {
        status: API_SESSION_STATUSES.active,
        principal: createAuthenticatedAuthContext({
          principalId: acceptedInvite.email,
          displayName: acceptInput.displayName,
          permissions: ["private-beta:access"]
        }).principal!,
        createdAt: now,
        expiresAt: new Date(Date.parse(now) + sessionTtlMs).toISOString()
      };
      sessions.push({
        internalId: sessionIdFactory(),
        inviteId: acceptedInvite.inviteId,
        tokenHash: hashAuthSecret(sessionToken, secretPepper),
        session
      });

      return {
        accepted: true,
        invite: toInviteDto(acceptedInvite),
        session: cloneSession(session),
        sessionToken
      };
    },
    async getSession(sessionToken) {
      const tokenHash = hashAuthSecret(sessionToken, secretPepper);
      const record = sessions.find((candidate) => timingSafeStringEqual(candidate.tokenHash, tokenHash));
      const session = record?.session;
      if (!session || session.status !== API_SESSION_STATUSES.active || Date.parse(session.expiresAt) <= Date.parse(clock())) {
        return undefined;
      }
      return cloneSession(session);
    },
    async revokeSession(sessionToken) {
      const tokenHash = hashAuthSecret(sessionToken, secretPepper);
      const sessionIndex = sessions.findIndex((candidate) => timingSafeStringEqual(candidate.tokenHash, tokenHash));
      const record = sessions[sessionIndex];
      if (sessionIndex < 0 || record === undefined) return false;
      sessions[sessionIndex] = { ...record, session: { ...record.session, status: API_SESSION_STATUSES.revoked } };
      return true;
    },
    async revokeInvite(inviteId) {
      const inviteIndex = invites.findIndex((candidate) => candidate.inviteId === inviteId);
      const invite = invites[inviteIndex];
      if (inviteIndex < 0 || invite === undefined || invite.status === API_INVITE_STATUSES.revoked) return false;
      invites[inviteIndex] = { ...invite, status: API_INVITE_STATUSES.revoked };
      for (const [index, record] of sessions.entries()) {
        if (record.inviteId === inviteId && record.session.status === API_SESSION_STATUSES.active) {
          sessions[index] = { ...record, session: { ...record.session, status: API_SESSION_STATUSES.revoked } };
        }
      }
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

function cloneSessionRecord(record: ApiSessionRecord): ApiSessionRecord {
  return { ...record, session: cloneSession(record.session) };
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
