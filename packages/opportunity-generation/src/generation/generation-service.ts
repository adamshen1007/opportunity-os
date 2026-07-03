import type { OpportunityGenerationInput } from "./generation-input.js";
import type { OpportunityGenerationOutput } from "./generation-output.js";
import type {
  OpportunityGenerationRunId,
  OpportunityGenerationSafeMetadata,
  OpportunityGenerationTimestamp
} from "./primitives.js";

export type OpportunityGenerationServiceContext = {
  readonly runId: OpportunityGenerationRunId;
  readonly startedAt: OpportunityGenerationTimestamp;
  readonly correlationId: string;
  readonly requestId?: string;
  readonly safeMetadata?: OpportunityGenerationSafeMetadata;
};

export type OpportunityGenerationServiceResult = {
  readonly input: OpportunityGenerationInput;
  readonly output: OpportunityGenerationOutput;
  readonly context: OpportunityGenerationServiceContext;
};

export type OpportunityGenerationService = {
  readonly generate: (
    input: OpportunityGenerationInput,
    context: OpportunityGenerationServiceContext
  ) => OpportunityGenerationServiceResult | Promise<OpportunityGenerationServiceResult>;
};

export type DeterministicOpportunityGenerationServiceContract = {
  readonly service: OpportunityGenerationService;
  readonly deterministic: true;
  readonly explicitInputsOnly: true;
  readonly providerIndependent: true;
};
