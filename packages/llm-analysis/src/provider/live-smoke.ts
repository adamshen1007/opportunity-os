import {
  createLiveLlmProviderConfigFromEnv,
  createOpenAiLiveLlmProviderAdapter
} from "./index.js";
import { llmAnalysisFixtureRequest } from "../fixtures/index.js";

async function main() {
  const configResult = createLiveLlmProviderConfigFromEnv(process.env);

  if (!configResult.ok) {
    console.error(configResult.safeMessage);
    process.exitCode = 1;
    return;
  }

  if (!configResult.config.enabled) {
    console.error("Live LLM analysis skipped. Set LLM_LIVE_ANALYSIS_ENABLED=true before running this command.");
    process.exitCode = 1;
    return;
  }

  const adapter = createOpenAiLiveLlmProviderAdapter({ config: configResult.config });
  const result = await adapter.analyze({
    ...llmAnalysisFixtureRequest,
    provider: {
      ...llmAnalysisFixtureRequest.provider,
      id: "openai" as typeof llmAnalysisFixtureRequest.provider.id,
      name: "OpenAI",
      models: [
        {
          id: configResult.config.model as typeof llmAnalysisFixtureRequest.provider.models[number]["id"],
          name: configResult.config.model,
          supportedCapabilities: ["text-analysis", "structured-output"]
        }
      ]
    }
  });

  if (result.status !== "success") {
    console.error(`Live LLM analysis failed safely: ${result.error?.message ?? result.status}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Live LLM analysis completed with ${configResult.config.provider}/${configResult.config.model}.`);
  console.log(`Output fields: ${Object.keys(result.response.output?.values ?? {}).join(", ")}`);
}

await main();
