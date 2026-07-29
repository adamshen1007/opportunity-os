import assert from "node:assert/strict";
import test from "node:test";
import { assertSecretSafeManifestText, evaluatePilotGate } from "./verify-production-readiness.mjs";

const check = (overrides = {}) => ({
  id: "production.release",
  area: "production",
  priority: "P0",
  status: "pass",
  evidenceId: "release-evidence-1",
  safeSummary: "Verified without protected values.",
  ...overrides
});

test("passes only when every P0 check passes", () => {
  const report = evaluatePilotGate({ schemaVersion: "1.0.0", taskId: "TASK-P45-G01", checks: [check()] });
  assert.equal(report.decision, "GO");
  assert.equal(report.passed, 1);
});

test("fails closed for manual, conditional, and failed checks", () => {
  for (const status of ["manual-required", "conditional", "fail"]) {
    const report = evaluatePilotGate({
      schemaVersion: "1.0.0",
      taskId: "TASK-P45-G01",
      checks: [check({ status })]
    });
    assert.equal(report.decision, "NO-GO");
    assert.equal(report.unresolved[0]?.status, status);
  }
});

test("rejects duplicate evidence identifiers", () => {
  assert.throws(
    () => evaluatePilotGate({
      schemaVersion: "1.0.0",
      taskId: "TASK-P45-G01",
      checks: [check(), check({ id: "production.rollback" })]
    }),
    /identifiers must be unique/u
  );
});

test("rejects secret-like evidence content", () => {
  assert.throws(() => assertSecretSafeManifestText("DATABASE_URL=postgresql://user:value@example.test/db"));
  assert.throws(() => assertSecretSafeManifestText("authorization: Bearer token-value"));
  assert.doesNotThrow(() => assertSecretSafeManifestText("public-sha-mismatch-20260729"));
});
