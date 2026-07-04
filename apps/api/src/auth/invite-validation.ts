import type { ApiValidationIssue } from "../validation/index.js";
import type { ApiAcceptInviteRequestBody, ApiCreateInviteRequestBody } from "./invite-dto.js";

export interface ValidatedApiInviteCreationInput {
  readonly email: string;
  readonly inviteCode: string;
  readonly expiresAt?: string;
  readonly safeMetadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ValidatedApiInviteAcceptanceInput {
  readonly inviteCode: string;
  readonly displayName?: string;
}

export type ApiInviteCreationValidationResult =
  | { readonly valid: true; readonly value: ValidatedApiInviteCreationInput }
  | { readonly valid: false; readonly issues: readonly ApiValidationIssue[] };

export type ApiInviteAcceptanceValidationResult =
  | { readonly valid: true; readonly value: ValidatedApiInviteAcceptanceInput }
  | { readonly valid: false; readonly issues: readonly ApiValidationIssue[] };

export function validateCreateInviteBody(body: ApiCreateInviteRequestBody | undefined): ApiInviteCreationValidationResult {
  const issues: ApiValidationIssue[] = [];
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const inviteCode = typeof body?.inviteCode === "string" ? body.inviteCode.trim() : "";

  if (!email) {
    issues.push({ field: "email", code: "missing-required-field", message: "Email is required." });
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/u.test(email)) {
    issues.push({ field: "email", code: "unsupported-value", message: "Email must be valid." });
  }

  if (!inviteCode) {
    issues.push({ field: "inviteCode", code: "missing-required-field", message: "Invite code is required." });
  }

  if (body?.expiresAt !== undefined && Number.isNaN(Date.parse(body.expiresAt))) {
    issues.push({ field: "expiresAt", code: "unsupported-value", message: "Expiration timestamp must be ISO-compatible." });
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return {
    valid: true,
    value: {
      email,
      inviteCode,
      expiresAt: body?.expiresAt,
      safeMetadata: body?.safeMetadata ? { ...body.safeMetadata } : undefined
    }
  };
}

export function validateAcceptInviteBody(body: ApiAcceptInviteRequestBody | undefined): ApiInviteAcceptanceValidationResult {
  const inviteCode = typeof body?.inviteCode === "string" ? body.inviteCode.trim() : "";

  if (!inviteCode) {
    return {
      valid: false,
      issues: [{ field: "inviteCode", code: "missing-required-field", message: "Invite code is required." }]
    };
  }

  return {
    valid: true,
    value: {
      inviteCode,
      displayName: body?.displayName?.trim() || undefined
    }
  };
}
