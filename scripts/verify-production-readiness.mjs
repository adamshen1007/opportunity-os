import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const DEFAULT_EVIDENCE_URL = new URL(
  "../docs/04_IMPLEMENTATION/evidence/phase-4-5-pilot-gate.json",
  import.meta.url
);
const ALLOWED_STATUSES = new Set(["pass", "fail", "manual-required", "conditional"]);

export function evaluatePilotGate(manifest) {
  if (manifest?.schemaVersion !== "1.0.0" || manifest?.taskId !== "TASK-P45-G01") {
    throw new Error("Pilot evidence does not match the approved TASK-P45-G01 schema.");
  }
  if (!Array.isArray(manifest.checks) || manifest.checks.length === 0) {
    throw new Error("Pilot evidence must contain readiness checks.");
  }

  const identifiers = new Set();
  const unresolved = [];
  for (const check of manifest.checks) {
    if (
      typeof check?.id !== "string" ||
      typeof check?.area !== "string" ||
      check?.priority !== "P0" ||
      !ALLOWED_STATUSES.has(check?.status) ||
      typeof check?.evidenceId !== "string" ||
      check.evidenceId.length === 0
    ) {
      throw new Error("Pilot evidence contains an invalid P0 readiness check.");
    }
    if (identifiers.has(check.evidenceId)) {
      throw new Error("Pilot evidence identifiers must be unique.");
    }
    identifiers.add(check.evidenceId);
    if (check.status !== "pass") {
      unresolved.push({
        id: check.id,
        area: check.area,
        status: check.status,
        evidenceId: check.evidenceId,
        safeSummary: check.safeSummary
      });
    }
  }

  return {
    taskId: manifest.taskId,
    evaluatedAt: new Date().toISOString(),
    decision: unresolved.length === 0 ? "GO" : "NO-GO",
    passed: manifest.checks.length - unresolved.length,
    total: manifest.checks.length,
    unresolved
  };
}

export function assertSecretSafeManifestText(text) {
  const prohibited = [
    /postgres(?:ql)?:\/\//iu,
    /(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|authorization)\s*[:=]/iu,
    /bearer\s+[a-z0-9._-]+/iu,
    /\bsk-[a-z0-9_-]{16,}\b/iu
  ];
  if (prohibited.some((pattern) => pattern.test(text))) {
    throw new Error("Pilot evidence must not contain credentials or secret-like values.");
  }
}

async function main() {
  try {
    const evidenceUrl = process.env.PILOT_GATE_EVIDENCE_FILE
      ? new URL(`file://${process.env.PILOT_GATE_EVIDENCE_FILE}`)
      : DEFAULT_EVIDENCE_URL;
    const text = await readFile(evidenceUrl, "utf8");
    assertSecretSafeManifestText(text);
    const report = evaluatePilotGate(JSON.parse(text));
    console.log(JSON.stringify(report, null, 2));
    if (report.decision !== "GO") process.exitCode = 1;
  } catch (error) {
    console.error(
      `Pilot gate verification failed safely: ${error instanceof Error ? error.message : "Unknown safe failure."}`
    );
    process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
