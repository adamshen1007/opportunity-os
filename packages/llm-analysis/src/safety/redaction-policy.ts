import type { SafetyClassification } from "./safety-classification.js";

export const REDACTION_TARGET_KINDS = {
  credential: "credential",
  token: "token",
  authHeader: "auth-header",
  providerKey: "provider-key",
  rawPayload: "raw-payload",
  personalData: "personal-data"
} as const;

export type RedactionTargetKind =
  (typeof REDACTION_TARGET_KINDS)[keyof typeof REDACTION_TARGET_KINDS];

export type RedactionPolicy = {
  readonly policyName: string;
  readonly policyVersion: string;
  readonly classification: SafetyClassification;
  readonly targetKinds: readonly RedactionTargetKind[];
  readonly replacement: "[REDACTED]";
};
