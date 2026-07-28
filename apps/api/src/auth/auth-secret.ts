import { createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";

const AUTH_SECRET_BYTES = 32;

export function generateInviteCode(): string {
  return `inv_${randomBytes(AUTH_SECRET_BYTES).toString("base64url")}`;
}

export function generateSessionToken(): string {
  return `ses_${randomBytes(AUTH_SECRET_BYTES).toString("base64url")}`;
}

export function hashAuthSecret(value: string, pepper: string): string {
  return createHmac("sha256", pepper).update(value, "utf8").digest("hex");
}

export function isWellFormedInviteCode(value: string): boolean {
  return /^inv_[A-Za-z0-9_-]{43}$/u.test(value);
}

export function isWellFormedSessionToken(value: string): boolean {
  return /^ses_[A-Za-z0-9_-]{43}$/u.test(value);
}

export function timingSafeStringEqual(left: string | undefined, right: string): boolean {
  if (left === undefined) return false;
  const leftDigest = createHash("sha256").update(left, "utf8").digest();
  const rightDigest = createHash("sha256").update(right, "utf8").digest();
  return timingSafeEqual(leftDigest, rightDigest);
}
