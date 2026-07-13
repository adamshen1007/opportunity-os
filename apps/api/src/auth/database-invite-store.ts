import { createHmac, randomUUID } from "node:crypto";
import type { PrismaDatabaseRuntime } from "@opportunity-os/database";
import { createAuthenticatedAuthContext } from "./auth-context.js";
import type { ApiInviteDto, ApiSessionDto } from "./invite-dto.js";
import {
  API_INVITE_ACCEPTANCE_FAILURE_REASONS,
  type ApiInviteAcceptanceResult,
  type ApiInviteStore
} from "./invite-store.js";
import { API_INVITE_STATUSES } from "./invite-status.js";
import { API_SESSION_STATUSES } from "./session-status.js";

export interface DatabaseInviteStoreOptions {
  readonly client: PrismaDatabaseRuntime["client"];
  readonly inviteCodePepper: string;
  readonly clock?: () => Date;
  readonly sessionTtlMs?: number;
  readonly idFactory?: () => string;
}

export function createDatabaseInviteStore(options: DatabaseInviteStoreOptions): ApiInviteStore {
  const clock = options.clock ?? (() => new Date());
  const sessionTtlMs = options.sessionTtlMs ?? 1000 * 60 * 60 * 8;
  const idFactory = options.idFactory ?? randomUUID;
  const hashInviteCode = (value: string) => createHmac("sha256", options.inviteCodePepper).update(value).digest("hex");

  return {
    async createInvite(input) {
      const invite = await options.client.privateBetaInvite.create({
        data: {
          id: idFactory(),
          email: input.email,
          inviteCodeHash: hashInviteCode(input.inviteCode),
          status: API_INVITE_STATUSES.pending,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : null
        }
      });
      return toInviteDto(invite);
    },

    async acceptInvite(input): Promise<ApiInviteAcceptanceResult> {
      const invite = await options.client.privateBetaInvite.findUnique({
        where: { inviteCodeHash: hashInviteCode(input.inviteCode) }
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
      const expiresAt = new Date(now.getTime() + sessionTtlMs);
      const [acceptedInvite, session] = await options.client.$transaction([
        options.client.privateBetaInvite.update({
          where: { id: invite.id },
          data: { status: API_INVITE_STATUSES.accepted, acceptedAt: now }
        }),
        options.client.privateBetaSession.create({
          data: {
            id: sessionId,
            inviteId: invite.id,
            principalId: invite.email,
            status: API_SESSION_STATUSES.active,
            expiresAt
          }
        })
      ]);

      return {
        accepted: true,
        invite: toInviteDto(acceptedInvite),
        session: toSessionDto(session, input.displayName)
      };
    },

    async getSession(sessionId) {
      const session = await options.client.privateBetaSession.findUnique({ where: { id: sessionId } });
      if (!session || session.status !== API_SESSION_STATUSES.active || session.revokedAt) return undefined;
      if (session.expiresAt.getTime() <= clock().getTime()) {
        await options.client.privateBetaSession.update({ where: { id: session.id }, data: { status: API_SESSION_STATUSES.expired } });
        return undefined;
      }
      return toSessionDto(session);
    }
  };
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
    sessionId: session.id,
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
