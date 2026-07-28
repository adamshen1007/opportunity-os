import { describe, expect, it } from "vitest";
import {
  API_ACCEPT_INVITE_ROUTE,
  API_CREATE_INVITE_ROUTE,
  API_ERROR_CODES,
  API_GET_CURRENT_SESSION_ROUTE,
  API_LOGOUT_ROUTE,
  ApiInviteConflictError,
  API_INVITE_STATUSES,
  API_SESSION_STATUSES,
  createDatabaseInviteStore,
  createInMemoryInviteStore,
  createSyntheticApiInviteStore,
  createSyntheticApiRequest,
  handleAcceptInviteRequest,
  handleCreateInviteRequest,
  handleGetCurrentSessionRequest,
  handleLogoutRequest,
  syntheticApiCreateInviteRequestBody,
  syntheticApiInvite,
  syntheticApiSession,
  syntheticPrivateBetaInviteCode,
  syntheticPrivateBetaSessionToken,
  validateAcceptInviteBody,
  validateCreateInviteBody
} from "../index.js";

describe("Private Beta invite-only auth", () => {
  it("creates invite DTOs without exposing raw invite codes", async () => {
    const store = createInMemoryInviteStore({
      clock: () => "2026-07-04T00:00:00.000Z",
      inviteIdFactory: () => "invite-created-1"
    });
    const response = await handleCreateInviteRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/auth/invites" },
        body: syntheticApiCreateInviteRequestBody
      }),
      store
    );

    expect(API_CREATE_INVITE_ROUTE.path).toBe("/auth/invites");
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.inviteId).toBe("invite-created-1");
      expect(response.data.status).toBe(API_INVITE_STATUSES.pending);
      expect(JSON.stringify(response.data)).not.toContain(syntheticPrivateBetaInviteCode);
    }
  });

  it("returns a safe conflict when an invite email or code already exists", async () => {
    const store = createInMemoryInviteStore();
    const request = createSyntheticApiRequest({
      context: { method: "POST", path: "/v1/auth/invites" },
      body: syntheticApiCreateInviteRequestBody
    });

    expect((await handleCreateInviteRequest(request, store)).ok).toBe(true);
    const response = await handleCreateInviteRequest(request, store);

    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.error.code).toBe(API_ERROR_CODES.conflict);
      expect(response.error.statusCode).toBe(409);
      expect(response.error.details).toEqual(["invite:already_exists"]);
      expect(JSON.stringify(response.error)).not.toContain(syntheticPrivateBetaInviteCode);
    }
    expect(new ApiInviteConflictError().message).not.toContain(syntheticPrivateBetaInviteCode);
  });

  it("normalizes database uniqueness failures without exposing database details", async () => {
    const store = createDatabaseInviteStore({
      client: {
        privateBetaInvite: {
          create: async () => {
            throw { code: "P2002", meta: { target: "inviteCodeHash", value: syntheticPrivateBetaInviteCode } };
          }
        }
      } as never,
      inviteCodePepper: "test-only-pepper"
    });

    await expect(store.createInvite({
      email: syntheticApiCreateInviteRequestBody.email ?? "partner@example.com",
      inviteCode: syntheticApiCreateInviteRequestBody.inviteCode ?? "test-only-invite-code",
      expiresAt: syntheticApiCreateInviteRequestBody.expiresAt,
      safeMetadata: syntheticApiCreateInviteRequestBody.safeMetadata,
      correlationId: "invite-conflict-test"
    })).rejects.toEqual(new ApiInviteConflictError());
  });

  it("accepts valid invites and creates active sessions", async () => {
    const store = createSyntheticApiInviteStore();
    const response = await handleAcceptInviteRequest(
      createSyntheticApiRequest({
        context: { method: "POST", path: "/v1/auth/invites/accept" },
        body: {
          inviteCode: syntheticPrivateBetaInviteCode,
          displayName: "Design Partner"
        }
      }),
      store
    );

    expect(API_ACCEPT_INVITE_ROUTE.requiresAuthentication).toBe(false);
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.invite.status).toBe(API_INVITE_STATUSES.accepted);
      expect(response.data.session.status).toBe(API_SESSION_STATUSES.active);
      expect(response.data.session.principal.permissions).toEqual(["private-beta:access"]);
      expect(JSON.stringify(response.data)).not.toContain(syntheticPrivateBetaInviteCode);
    }
  });

  it("validates invite input with safe issue details", async () => {
    const validation = validateCreateInviteBody({
      email: "not-an-email",
      inviteCode: "secret-invite-code"
    });
    const acceptanceValidation = validateAcceptInviteBody(undefined);

    expect(validation.valid).toBe(false);
    expect(acceptanceValidation.valid).toBe(false);
    expect(JSON.stringify(validation)).not.toContain("secret-invite-code");
  });

  it("returns secret-safe errors for invalid invite acceptance", async () => {
    const response = await handleAcceptInviteRequest(
      createSyntheticApiRequest({
        body: {
          inviteCode: "raw-invalid-secret-code"
        }
      }),
      createSyntheticApiInviteStore()
    );

    expect(response.ok).toBe(false);
    if (!response.ok) {
      expect(response.error.code).toBe(API_ERROR_CODES.validationFailed);
      expect(response.error.details).toEqual(["inviteCode:unsupported-value"]);
      expect(JSON.stringify(response.error)).not.toContain("raw-invalid-secret-code");
      expect(JSON.stringify(response.error)).not.toContain("stack");
    }
  });

  it("reads and revokes the current session without exposing session internals", async () => {
    const store = createSyntheticApiInviteStore();
    const request = createSyntheticApiRequest({
      context: { sessionId: syntheticPrivateBetaSessionToken }
    });

    const current = await handleGetCurrentSessionRequest(request, store);
    expect(API_GET_CURRENT_SESSION_ROUTE.path).toBe("/auth/session");
    expect(current.ok).toBe(true);

    const logout = await handleLogoutRequest(request, store);
    expect(API_LOGOUT_ROUTE.path).toBe("/auth/logout");
    expect(logout).toMatchObject({ ok: true, data: { loggedOut: true } });
    expect(await store.getSession(syntheticPrivateBetaSessionToken)).toBeUndefined();

    const afterLogout = await handleGetCurrentSessionRequest(request, store);
    expect(afterLogout.ok).toBe(false);
    expect(JSON.stringify(afterLogout)).not.toContain("stack");
  });
});
