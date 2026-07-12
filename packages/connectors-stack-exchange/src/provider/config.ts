import {
  STACK_EXCHANGE_DEFAULT_API_BASE_URL,
  STACK_EXCHANGE_DEFAULT_SITE,
  type StackExchangeProviderConfig
} from "./contracts.js";

export function createStackExchangeProviderConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env
): StackExchangeProviderConfig {
  const timeout = Number(env.STACK_EXCHANGE_TIMEOUT_MS ?? 10000);
  return {
    enabled: env.STACK_EXCHANGE_LIVE_SCAN_ENABLED === "true",
    apiBaseUrl: env.STACK_EXCHANGE_API_BASE_URL?.trim() || STACK_EXCHANGE_DEFAULT_API_BASE_URL,
    apiKey: env.STACK_EXCHANGE_API_KEY?.trim() || undefined,
    defaultSite: env.STACK_EXCHANGE_DEFAULT_SITE?.trim() || STACK_EXCHANGE_DEFAULT_SITE,
    timeoutMs: Number.isFinite(timeout) && timeout >= 1000 && timeout <= 30000 ? timeout : 10000
  };
}
