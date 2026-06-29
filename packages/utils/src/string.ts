export const DEFAULT_REDACTION = "[REDACTED]";

const secretAssignmentPattern =
  /\b(api[_-]?key|token|password|secret|dsn|authorization|auth)\s*[:=]\s*("[^"]*"|'[^']*'|[^\s,;]+)/giu;
const bearerValuePattern = /\bbearer\s+("[^"]*"|'[^']*'|[^\s,;]+)/giu;
const basicValuePattern = /\bbasic\s+("[^"]*"|'[^']*'|[^\s,;]+)/giu;
const credentialUrlPattern =
  /\b([a-z][a-z0-9+.-]*:\/\/)([^:\s/@]+):([^@\s/]+)@([^\s,;]+)/giu;

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/gu, " ");
}

export function redactValue(value: string | undefined | null, replacement = DEFAULT_REDACTION): string {
  return value == null || value.length === 0 ? "" : replacement;
}

export function redactSecretLikeText(
  value: string | undefined | null,
  replacement = DEFAULT_REDACTION
): string {
  if (value == null || value.length === 0) {
    return "";
  }

  return value
    .replace(secretAssignmentPattern, (_match, key: string) => `${key}=${replacement}`)
    .replace(bearerValuePattern, `Bearer ${replacement}`)
    .replace(basicValuePattern, `Basic ${replacement}`)
    .replace(
      credentialUrlPattern,
      (_match, protocol: string, _user: string, _password: string, hostAndPath: string) =>
        `${protocol}${replacement}@${hostAndPath}`
    );
}
