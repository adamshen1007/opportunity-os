import { randomUUID } from "node:crypto";
import type { PrismaDatabaseRuntime } from "@opportunity-os/database";
import { createAuthenticatedAuthContext } from "./auth-context.js";
import type { ApiInviteDto, ApiSessionDto } from "./invite-dto.js";
import {
  API_INVITE_ACCEPTANCE_FAILURE_REASONS,
  ApiInviteConflictError,
  type ApiInviteAcceptanceResult,
  type ApiInviteStore
} from "./invite-store.js";
import { API_INVITE_STATUSES } from "./invite-status.js";
import { API_SESSION_STATUSES } from "./session-status.js";
import { generateSessionToken, hashAuthSecret } from "./auth-secret.js";

export interface DatabaseInviteStoreOptions {
  readonly client: PrismaDatabaseRuntime["client"];
  readonly inviteCodePepper: string;
  readonly clock?: () => Date;
  readonly sessionTtlMs?: number;
  readonly idFactory?: () => string;
  readonly sessionTokenFactory?: () => string;
  readonly inviteTtlMs?: number;
}

export function createDatabaseInviteStore(options: DatabaseInviteStoreOptions): ApiInviteStore {
  const clock = options.clock ?? (() => new Date());
  const sessionTtlMs = options.sessionTtlMs ?? 1000 * 60 * 60 * 8;
  const idFactory = options.idFactory ?? randomUUID;
  const sessionTokenFactory = options.sessionTokenFactory ?? generateSessionToken;
  const inviteTtlMs = options.inviteTtlMs ?? 1000 * 60 * 60 * 24 * 7;
  const hashSecret = (value: string) => hashAuthSecret(value, options.inviteCodePepper);

  return {
    async createInvite(input) {
      try {
        const invite = await options.client.privateBetaInvite.create({
          data: {
            id: idFactory(),
            email: input.email,
            inviteCodeHash: hashSecret(input.inviteCode),
            status: API_INVITE_STATUSES.pending,
            expiresAt: input.expiresAt ? new Date(input.expiresAt) : new Date(clock().getTime() + inviteTtlMs)
          }
        });
        return toInviteDto(invite);
      } catch (error) {
        if (isUniqueConstraintError(error)) throw new ApiInviteConflictError();
        throw error;
      }
    },

    async acceptInvite(input): Promise<ApiInviteAcceptanceResult> {
      const invite = await options.client.privateBetaInvite.findUnique({
        where: { inviteCodeHash: hashSecret(input.inviteCode) }
      });
      if (!invite) return rejected(API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotFound, "Invite is not valid.");

      const now = clock();
      if (invite.expiresAt && invite.expiresAt.getTime() <= now.getTime()) {
        await options.client.privateBetaInvite.update({ where: { id: invite.id }, data: { status: API_INVITE_STATUSES.expired } });
        return rejected(API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteExpired, "Invite has expired.");
      }
      if (invite.status !== API_INVITE_STATUSES.pending) {
        return rejected(API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotPending, "Invite is no longer available.");
      }

      const sessionId = idFactory();
      const sessionToken = sessionTokenFactory();
      const expiresAt = new Date(now.getTime() + sessionTtlMs);
      const accepted = await options.client.$transaction(async (transaction) => {
        const claim = await transaction.privateBetaInvite.updateMany({
          where: { id: invite.id, status: API_INVITE_STATUSES.pending },
          data: { status: API_INVITE_STATUSES.accepted, acceptedAt: now }
        });
        if (claim.count !== 1) return undefined;
        const acceptedInvite = await transaction.privateBetaInvite.findUniqueOrThrow({ where: { id: invite.id } });
        const session = await transaction.privateBetaSession.create({
          data: {
            id: sessionId,
            tokenHash: hashSecret(sessionToken),
            inviteId: invite.id,
            principalId: invite.email,
            status: API_SESSION_STATUSES.active,
            expiresAt
          }
        });
        return { acceptedInvite, session };
      });
      if (!accepted) {
        return rejected(API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotPending, "Invite is no longer available.");
      }

      return {
        accepted: true,
        invite: toInviteDto(accepted.acceptedInvite),
        session: toSessionDto(accepted.session, input.displayName),
        sessionToken
      };
    },

    async getSession(sessionToken) {
      const session = await options.client.privateBetaSession.findUnique({ where: { tokenHash: hashSecret(sessionToken) } });
      if (!session || session.status !== API_SESSION_STATUSES.active || session.revokedAt) return undefined;
      if (session.expiresAt.getTime() <= clock().getTime()) {
        await options.client.privateBetaSession.update({ where: { id: session.id }, data: { status: API_SESSION_STATUSES.expired } });
        return undefined;
      }
      return toSessionDto(session);
    },

    async revokeSession(sessionToken) {
      const session = await options.client.privateBetaSession.findUnique({ where: { tokenHash: hashSecret(sessionToken) } });
      if (!session || session.status !== API_SESSION_STATUSES.active) return false;
      const now = clock();
      await options.client.privateBetaSession.update({
        where: { id: session.id },
        data: { status: API_SESSION_STATUSES.revoked, revokedAt: now }
      });
      return true;
    },

    async revokeInvite(inviteId) {
      const invite = await options.client.privateBetaInvite.findUnique({ where: { id: inviteId } });
      if (!invite || invite.status === API_INVITE_STATUSES.revoked) return false;
      const now = clock();
      await options.client.$transaction([
        options.client.privateBetaInvite.update({
          where: { id: inviteId },
          data: { status: API_INVITE_STATUSES.revoked, revokedAt: now }
        }),
        options.client.privateBetaSession.updateMany({
          where: { inviteId, status: API_SESSION_STATUSES.active },
          data: { status: API_SESSION_STATUSES.revoked, revokedAt: now }
        })
      ]);
      return true;
    }
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

function rejected(reason: typeof API_INVITE_ACCEPTANCE_FAILURE_REASONS[keyof typeof API_INVITE_ACCEPTANCE_FAILURE_REASONS], safeMessage: string): ApiInviteAcceptanceResult {
  return { accepted: false, reason, safeMessage };
}

function toInviteDto(invite: { id: string; email: string; status: string; createdAt: Date; expiresAt: Date | null; acceptedAt: Date | null }): ApiInviteDto {
  return {
    inviteId: invite.id,
    email: invite.email,
    status: invite.status as ApiInviteDto["status"],
    createdAt: invite.createdAt.toISOString(),
    expiresAt: invite.expiresAt?.toISOString(),
    acceptedAt: invite.acceptedAt?.toISOString()
  };
}

function toSessionDto(session: { id: string; principalId: string; status: string; createdAt: Date; expiresAt: Date }, displayName?: string): ApiSessionDto {
  return {
    status: session.status as ApiSessionDto["status"],
    principal: createAuthenticatedAuthContext({
      principalId: session.principalId,
      displayName,
      permissions: ["private-beta:access"]
    }).principal!,
    createdAt: session.createdAt.toISOString(),
    expiresAt: session.expiresAt.toISOString()
  };
}
