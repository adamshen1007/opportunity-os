export const LIVE_LLM_PROVIDER_NAMES = {
  openai: "openai",
  gemini: "gemini"
} as const;

export const LIVE_LLM_PROVIDER_ENV_KEYS = [
  "LLM_PROVIDER",
  "LLM_MODEL",
  "LLM_LIVE_ANALYSIS_ENABLED",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "GEMINI_API_KEY",
  "GEMINI_MODEL",
  "LLM_PROVIDER_TIMEOUT_MS"
] as const;

export type LiveLlmProviderName =
  (typeof LIVE_LLM_PROVIDER_NAMES)[keyof typeof LIVE_LLM_PROVIDER_NAMES];

export type LiveLlmProviderEnvKey =
  (typeof LIVE_LLM_PROVIDER_ENV_KEYS)[number];

export type LiveLlmSensitiveValue = {
  readonly value: string;
  readonly sensitive: true;
  readonly toJSON: () => {
    readonly value: "[REDACTED]";
    readonly sensitive: true;
  };
};

export type LiveLlmProviderConfig = {
  readonly enabled: boolean;
  readonly provider: LiveLlmProviderName;
  readonly model: string;
  readonly apiKey?: LiveLlmSensitiveValue;
  readonly endpoint:
    | "https://api.openai.com/v1/responses"
    | "https://generativelanguage.googleapis.com/v1beta";
  readonly timeoutMs: number;
};

export type LiveLlmProviderConfigResult =
  | {
      readonly ok: true;
      readonly config: LiveLlmProviderConfig;
    }
  | {
      readonly ok: false;
      readonly missingKeys: readonly LiveLlmProviderEnvKey[];
      readonly safeMessage: string;
    };

function sensitive(value: string | undefined): LiveLlmSensitiveValue | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  return {
    value: trimmed,
    sensitive: true,
    toJSON: () => ({
      value: "[REDACTED]",
      sensitive: true
    })
  };
}

function readEnabled(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

function readPositiveTimeout(value: string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 30_000;
  return Math.min(Math.floor(parsed), 120_000);
}

export function createLiveLlmProviderConfigFromEnv(
  env: Readonly<Record<string, string | undefined>>
): LiveLlmProviderConfigResult {
  const enabled = readEnabled(env.LLM_LIVE_ANALYSIS_ENABLED);
  const provider = env.LLM_PROVIDER?.trim().toLowerCase() || LIVE_LLM_PROVIDER_NAMES.openai;
  const model =
    env.LLM_MODEL?.trim() ||
    (provider === LIVE_LLM_PROVIDER_NAMES.gemini
      ? env.GEMINI_MODEL?.trim() || "gemini-2.5-flash"
      : env.OPENAI_MODEL?.trim() || "gpt-4.1-mini");
  const apiKey = sensitive(
    provider === LIVE_LLM_PROVIDER_NAMES.gemini ? env.GEMINI_API_KEY : env.OPENAI_API_KEY
  );

  if (
    provider !== LIVE_LLM_PROVIDER_NAMES.openai &&
    provider !== LIVE_LLM_PROVIDER_NAMES.gemini
  ) {
    return {
      ok: false,
      missingKeys: [],
      safeMessage: "Live LLM analysis currently supports only openai and gemini providers."
    };
  }

  if (enabled && !apiKey) {
    return {
      ok: false,
      missingKeys: [provider === LIVE_LLM_PROVIDER_NAMES.gemini ? "GEMINI_API_KEY" : "OPENAI_API_KEY"],
      safeMessage: `Live LLM analysis requires ${
        provider === LIVE_LLM_PROVIDER_NAMES.gemini ? "GEMINI_API_KEY" : "OPENAI_API_KEY"
      } when LLM_LIVE_ANALYSIS_ENABLED=true.`
    };
  }

  return {
    ok: true,
    config: {
      enabled,
      provider,
      model,
      ...(apiKey === undefined ? {} : { apiKey }),
      endpoint:
        provider === LIVE_LLM_PROVIDER_NAMES.gemini
          ? "https://generativelanguage.googleapis.com/v1beta"
          : "https://api.openai.com/v1/responses",
      timeoutMs: readPositiveTimeout(env.LLM_PROVIDER_TIMEOUT_MS)
    }
  };
}
