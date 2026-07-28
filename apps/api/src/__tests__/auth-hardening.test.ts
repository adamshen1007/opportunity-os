import { describe, expect, it } from "vitest";
import {
  API_INVITE_ACCEPTANCE_FAILURE_REASONS,
  createInMemoryInviteStore,
  createLocalApiDispatcher,
  createSessionCookie,
  generateInviteCode,
  generateSessionToken,
  handleAcceptInviteRequest,
  hashAuthSecret,
  syntheticApiInvite,
  syntheticApiSession,
  syntheticPrivateBetaInviteCode,
  syntheticPrivateBetaSessionToken,
  takeAttachedSessionToken,
  timingSafeStringEqual
} from "../index.js";
import { createSyntheticApiRequest } from "../testing/index.js";

const webOrigin = "https://opportunity-os-web.vercel.app";

describe("production authentication hardening", () => {
  it("generates cryptographically strong, distinct auth secrets", () => {
    const inviteCodes = new Set(Array.from({ length: 32 }, generateInviteCode));
    const sessionTokens = new Set(Array.from({ length: 32 }, generateSessionToken));
    expect(inviteCodes.size).toBe(32);
    expect(sessionTokens.size).toBe(32);
    for (const value of inviteCodes) expect(value).toMatch(/^inv_[A-Za-z0-9_-]{43}$/u);
    for (const value of sessionTokens) expect(value).toMatch(/^ses_[A-Za-z0-9_-]{43}$/u);
  });

  it("accepts an invite once and keeps invite and session secrets out of the API body", async () => {
    const store = createStore();
    const response = await handleAcceptInviteRequest(
      createSyntheticApiRequest({ body: { inviteCode: syntheticPrivateBetaInviteCode } }),
      store
    );
    expect(response.ok).toBe(true);
    const sessionToken = takeAttachedSessionToken(response);
    expect(sessionToken).toBe(syntheticPrivateBetaSessionToken);
    const serialized = JSON.stringify(response);
    expect(serialized).not.toContain(syntheticPrivateBetaInviteCode);
    expect(serialized).not.toContain(syntheticPrivateBetaSessionToken);
    expect(serialized).not.toContain(hashAuthSecret(syntheticPrivateBetaInviteCode, "test-pepper"));

    const replay = await store.acceptInvite({ inviteCode: syntheticPrivateBetaInviteCode });
    expect(replay).toMatchObject({
      accepted: false,
      reason: API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotPending
    });
  });

  it("rejects expired and revoked invites", async () => {
    const expiredStore = createStore({ now: "2026-07-12T00:00:00.000Z" });
    const expired = await expiredStore.acceptInvite({ inviteCode: syntheticPrivateBetaInviteCode });
    expect(expired).toMatchObject({ accepted: false, reason: API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteExpired });

    const revokedStore = createStore();
    expect(await revokedStore.revokeInvite(syntheticApiInvite.inviteId)).toBe(true);
    const revoked = await revokedStore.acceptInvite({ inviteCode: syntheticPrivateBetaInviteCode });
    expect(revoked).toMatchObject({ accepted: false, reason: API_INVITE_ACCEPTANCE_FAILURE_REASONS.inviteNotPending });
  });

  it("rejects expired, logged-out, administratively revoked, and malformed sessions", async () => {
    const expiredStore = createStore({ now: "2026-07-04T09:00:00.000Z" });
    expect(await expiredStore.getSession(syntheticPrivateBetaSessionToken)).toBeUndefined();

    const logoutStore = createStore();
    expect(await logoutStore.revokeSession(syntheticPrivateBetaSessionToken)).toBe(true);
    expect(await logoutStore.getSession(syntheticPrivateBetaSessionToken)).toBeUndefined();

    const revokedStore = createStore();
    expect(await revokedStore.revokeInvite(syntheticApiInvite.inviteId)).toBe(true);
    expect(await revokedStore.getSession(syntheticPrivateBetaSessionToken)).toBeUndefined();

    const dispatch = createLocalApiDispatcher({
      requireAuthentication: true,
      allowedOrigins: [webOrigin],
      inviteStore: createStore()
    });
    for (const token of [undefined, "", "malformed", `ses_${"!".repeat(43)}`]) {
      const response = await dispatch({
        method: "GET",
        path: "/opportunities",
        headers: token === undefined ? {} : { "x-opportunity-os-session-id": token }
      });
      expect(response.ok).toBe(false);
      expect(response.ok ? undefined : response.error.statusCode).toBe(401);
    }
  });

  it("requires approved origins for state-changing browser requests", async () => {
    const dispatch = createLocalApiDispatcher({
      requireAuthentication: true,
      allowedOrigins: [webOrigin],
      inviteStore: createStore()
    });
    const body = { inviteCode: syntheticPrivateBetaInviteCode };
    for (const origin of [undefined, "https://attacker.example"]) {
      const response = await dispatch({
        method: "POST",
        path: "/auth/invites/accept",
        body,
        headers: origin ? { origin } : {}
      });
      expect(response.ok).toBe(false);
      expect(response.ok ? undefined : response.error.statusCode).toBe(403);
    }
    const allowed = await dispatch({ method: "POST", path: "/auth/invites/accept", body, headers: { origin: webOrigin } });
    expect(allowed.ok).toBe(true);
  });

  it("requires explicit administrator authorization and revokes all invite sessions", async () => {
    const store = createStore();
    const dispatch = createLocalApiDispatcher({
      requireAuthentication: true,
      adminAccessToken: "admin-secret",
      allowedOrigins: [webOrigin],
      inviteStore: store
    });
    const path = `/auth/invites/${syntheticApiInvite.inviteId}/revoke`;
    const denied = await dispatch({ method: "POST", path, headers: { "x-opportunity-os-admin-token": "wrong" } });
    expect(denied.ok).toBe(false);
    const revoked = await dispatch({ method: "POST", path, headers: { "x-opportunity-os-admin-token": "admin-secret" } });
    expect(revoked).toMatchObject({ ok: true, data: { revoked: true } });
    expect(await store.getSession(syntheticPrivateBetaSessionToken)).toBeUndefined();
  });

  it("sets the safest cookie policy compatible with separate Vercel and Render sites", () => {
    const productionCookie = createSessionCookie(syntheticPrivateBetaSessionToken, true);
    expect(productionCookie).toContain("__Host-opportunity_os_session=");
    expect(productionCookie).toContain("HttpOnly");
    expect(productionCookie).toContain("Secure");
    expect(productionCookie).toContain("SameSite=None");
    expect(productionCookie).toContain("Path=/");

    const localCookie = createSessionCookie(syntheticPrivateBetaSessionToken, false);
    expect(localCookie).toContain("SameSite=Lax");
    expect(localCookie).not.toContain("; Secure");
  });

  it("uses fixed-length timing-safe comparisons for equal and unequal inputs", () => {
    expect(timingSafeStringEqual("same", "same")).toBe(true);
    expect(timingSafeStringEqual("short", "a-much-longer-value")).toBe(false);
    expect(timingSafeStringEqual(undefined, "expected")).toBe(false);
  });

  it("redacts attempted session credentials from route failures", async () => {
    const dispatch = createLocalApiDispatcher({ requireAuthentication: true, inviteStore: createStore() });
    const response = await dispatch({ method: "GET", path: `/auth/sessions/${syntheticPrivateBetaSessionToken}` });
    const serialized = JSON.stringify(response);
    expect(response.ok).toBe(false);
    expect(serialized).not.toContain(syntheticPrivateBetaSessionToken);
    expect(serialized).toContain("/auth/sessions/[redacted]");
  });
});

function createStore(input: { readonly now?: string } = {}) {
  const pepper = "test-pepper";
  return createInMemoryInviteStore({
    initialInvites: [{
      ...syntheticApiInvite,
      inviteCodeHash: hashAuthSecret(syntheticPrivateBetaInviteCode, pepper)
    }],
    initialSessions: [{
      internalId: "session-internal-1",
      inviteId: syntheticApiInvite.inviteId,
      tokenHash: hashAuthSecret(syntheticPrivateBetaSessionToken, pepper),
      session: syntheticApiSession
    }],
    clock: () => input.now ?? "2026-07-04T00:00:00.000Z",
    secretPepper: pepper,
    sessionIdFactory: () => "session-internal-created",
    sessionTokenFactory: () => syntheticPrivateBetaSessionToken
  });
}
