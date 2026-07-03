import { describe, expect, it } from "vitest";
import {
  GENERATION_RESULT_STATUSES,
  OPPORTUNITY_GENERATION_FIXTURE_IDS,
  OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP,
  OPPORTUNITY_GENERATION_OUTPUT_STATUSES,
  opportunityGenerationFixtureAssembly,
  opportunityGenerationFixtureEvent,
  opportunityGenerationFixtureInput,
  opportunityGenerationFixtureOutput,
  opportunityGenerationFixtureResult,
  opportunityGenerationFixtureRuntimeError,
  opportunityGenerationFixtureSafeMetadata
} from "../index.js";

describe("Opportunity Generation deterministic fixtures", () => {
  it("uses stable synthetic fixture identifiers and timestamps", () => {
    expect(OPPORTUNITY_GENERATION_FIXTURE_IDS.runId).toBe("generation-run-fixture-1");
    expect(OPPORTUNITY_GENERATION_FIXTURE_TIMESTAMP).toBe("2026-01-01T00:00:00.000Z");
    expect(opportunityGenerationFixtureSafeMetadata.synthetic).toBe(true);
  });

  it("composes fixture input, assembly, output, result, and event contracts", () => {
    expect(opportunityGenerationFixtureInput.candidate.candidateId).toBeDefined();
    expect(opportunityGenerationFixtureAssembly.hypotheses).toHaveLength(1);
    expect(opportunityGenerationFixtureOutput.status).toBe(OPPORTUNITY_GENERATION_OUTPUT_STATUSES.generated);
    expect(opportunityGenerationFixtureResult.status).toBe(GENERATION_RESULT_STATUSES.success);
    expect(opportunityGenerationFixtureEvent.payload.runId).toBe(OPPORTUNITY_GENERATION_FIXTURE_IDS.runId);
  });

  it("keeps fixture errors safe by default", () => {
    const serialized = JSON.stringify(opportunityGenerationFixtureRuntimeError);

    expect(serialized).toContain("generation.validation_failed");
    expect(serialized).not.toContain("synthetic unsafe cause");
    expect(serialized).not.toContain("stack");
  });
});
