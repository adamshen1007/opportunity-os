import { describe, expect, it } from "vitest";
import {
  API_ACCEPT_INVITE_ROUTE,
  API_CREATE_INVITE_ROUTE,
  API_ERROR_CODES,
  API_GET_SESSION_ROUTE,
  API_INVITE_STATUSES,
  API_SESSION_STATUSES,
  createInMemoryInviteStore,
  createSyntheticApiInviteStore,
  createSyntheticApiRequest,
  handleAcceptInviteRequest,
  handleCreateInviteRequest,
  handleGetSessionRequest,
  syntheticApiCreateInviteRequestBody,
  syntheticApiInvite,
  syntheticApiSession,
  syntheticPrivateBetaInviteCode,
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
      expect(response.error.code).toBe(API_ERROR_CODES.unauthorized);
      expect(response.error.details).toEqual(["invite:invite_not_found"]);
      expect(JSON.stringify(response.error)).not.toContain("raw-invalid-secret-code");
      expect(JSON.stringify(response.error)).not.toContain("stack");
    }
  });

  it("reads sessions through the session route", async () => {
    const response = await handleGetSessionRequest(
      createSyntheticApiRequest({
        params: {
          sessionId: syntheticApiSession.sessionId
        }
      }),
      createSyntheticApiInviteStore()
    );

    expect(API_GET_SESSION_ROUTE.path).toBe("/auth/sessions/:sessionId");
    expect(response.ok).toBe(true);
    if (response.ok) {
      expect(response.data.sessionId).toBe(syntheticApiSession.sessionId);
      expect(response.data.principal.principalId).toBe(syntheticApiInvite.email);
    }
  });
});
