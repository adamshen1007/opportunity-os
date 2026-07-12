import { createStackExchangeProviderConfigFromEnv } from "./config.js";
import { searchStackExchange } from "./client.js";

const config = createStackExchangeProviderConfigFromEnv();
if (!config.enabled) {
  process.stderr.write("Live Stack Exchange scan skipped. Set STACK_EXCHANGE_LIVE_SCAN_ENABLED=true.\n");
  process.exitCode = 1;
} else {
  const result = await searchStackExchange({
    config,
    request: {
      query: process.env.STACK_EXCHANGE_QUERY ?? "manual deployment",
      site: process.env.STACK_EXCHANGE_DEFAULT_SITE ?? "stackoverflow",
      pageSize: 3
    }
  });
  if (!result.ok) {
    process.stderr.write(`Live Stack Exchange scan failed safely: ${result.error.message}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(`Live Stack Exchange scan succeeded with ${result.result.items.length} safe item(s).\n`);
  }
}
