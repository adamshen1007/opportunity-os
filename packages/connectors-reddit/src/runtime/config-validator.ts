import {
  REDDIT_REQUIRED_CONFIG_FIELD_KEYS,
  type RedditConnectorConfig
} from "../configuration/index.js";
import {
  type RedditValidationIssue,
  type RedditValidationResult
} from "../validation/index.js";

export function validateRedditRuntimeConfig(
  config: RedditConnectorConfig
): RedditValidationResult {
  const issues: RedditValidationIssue[] = [];

  for (const requiredKey of REDDIT_REQUIRED_CONFIG_FIELD_KEYS) {
    const field = config.fields.find((candidate) => candidate.key === requiredKey);
    if (field?.value === undefined || field.value === "") {
      issues.push({
        code: "reddit-config-invalid",
        target: "config",
        safeMessage: `Missing required Reddit config field: ${requiredKey}`,
        path: ["fields", requiredKey]
      });
    }
  }

  return issues.length === 0
    ? { ok: true, issues: [] }
    : { ok: false, issues };
}
