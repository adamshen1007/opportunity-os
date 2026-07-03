import { describe, expect, it } from "vitest";
import {
  GENERATION_RESULT_STATUSES,
  OPPORTUNITY_GENERATION_FIXTURE_IDS,
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  opportunityGenerationFixtureInput,
  opportunityGenerationFixtureOutput,
  opportunityGenerationFixtureResult
} from "../index.js";
import type {
  DeterministicOpportunityGenerationServiceContract,
  GenerationResult,
  OpportunityGenerationServiceContext,
  OpportunityGenerationTimestamp
} from "../index.js";

const startedAt = "2026-01-01T00:00:00.000Z" as OpportunityGenerationTimestamp;

describe("Opportunity Generation deterministic service contract", () => {
  it("can be exercised by a deterministic test-local service double", async () => {
    const context: OpportunityGenerationServiceContext = {
      runId: OPPORTUNITY_GENERATION_FIXTURE_IDS.runId,
      startedAt,
      correlationId: "correlation-generation-service-1",
      requestId: "request-generation-service-1"
    };
    const serviceContract: DeterministicOpportunityGenerationServiceContract = {
      deterministic: true,
      explicitInputsOnly: true,
      providerIndependent: true,
      service: {
        generate: (input, generationContext) => ({
          input,
          context: generationContext,
          output: opportunityGenerationFixtureOutput
        })
      }
    };

    const serviceResult = await serviceContract.service.generate(
      opportunityGenerationFixtureInput,
      context
    );
    const generationResult: GenerationResult = opportunityGenerationFixtureResult;

    expect(serviceContract.deterministic).toBe(true);
    expect(serviceResult.input).toBe(opportunityGenerationFixtureInput);
    expect(serviceResult.output.status).toBe(OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated);
    expect(generationResult.status).toBe(GENERATION_RESULT_STATUSES.success);
  });
});
