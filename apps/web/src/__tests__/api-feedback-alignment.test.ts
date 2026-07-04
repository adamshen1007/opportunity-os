import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  API_CREATE_BUG_REPORT_ROUTE,
  API_CREATE_FEEDBACK_ROUTE,
  API_FEEDBACK_RATING_TARGETS,
  API_FEEDBACK_RATING_VALUES,
  API_FEEDBACK_REASON_CATEGORIES,
  API_FEEDBACK_STATUSES,
  API_GET_FEEDBACK_ROUTE,
  API_LIST_FEEDBACK_ROUTE
} from "@opportunity-os/api";
import { generatedApiRoutes } from "../api";
import type {
  DashboardApiFeedbackRatingTarget,
  DashboardApiFeedbackReasonCategory,
  DashboardApiFeedbackStatus
} from "../api";
import {
  dashboardFeedbackReasonCategories,
  dashboardFeedbackFixtures
} from "../testing";

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRoot = path.join(webRoot, "src");
const blockedDependencyTerms = [
  ["ana", "lytics"].join(""),
  ["c", "rm"].join(""),
  ["notif", "ication"].join(""),
  ["sched", "uler"].join(""),
  ["wor", "ker"].join(""),
  ["str", "ipe"].join(""),
  ["au", "th0"].join(""),
  ["cl", "erk"].join(""),
  ["next", "-auth"].join(""),
  ["pris", "ma"].join(""),
  ["data", "base"].join("")
] as const;
const blockedRuntimeTerms = [
  ["local", "Storage"].join(""),
  ["session", "Storage"].join(""),
  ["indexed", "DB"].join(""),
  ["navigator", ".send", "Beacon"].join(""),
  ["g", "tag"].join(""),
  ["ana", "lytics"].join(""),
  ["C", "RM"].join(""),
  ["Sales", "force"].join(""),
  ["Hub", "Spot"].join(""),
  ["Prisma", "Client"].join(""),
  ["Wo", "rker", "Process"].join("")
] as const;
const prohibitedDependencyPattern = new RegExp(
  `from ["']([^"']*(${blockedDependencyTerms.join("|")})[^"']*)["']`,
  "iu"
);
const prohibitedRuntimePattern = new RegExp(`\\b(${blockedRuntimeTerms.join("|")})\\b`, "iu");

function listSourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listSourceFiles(fullPath) : [fullPath];
  });
}

describe("API and dashboard feedback alignment", () => {
  it("keeps generated dashboard feedback routes aligned with API route contracts", () => {
    expect(generatedApiRoutes.createFeedback).toEqual({
      method: API_CREATE_FEEDBACK_ROUTE.method,
      path: API_CREATE_FEEDBACK_ROUTE.path,
      operationId: API_CREATE_FEEDBACK_ROUTE.operationId
    });
    expect(generatedApiRoutes.listFeedback).toEqual({
      method: API_LIST_FEEDBACK_ROUTE.method,
      path: API_LIST_FEEDBACK_ROUTE.path,
      operationId: API_LIST_FEEDBACK_ROUTE.operationId
    });
    expect(generatedApiRoutes.getFeedback).toEqual({
      method: API_GET_FEEDBACK_ROUTE.method,
      path: API_GET_FEEDBACK_ROUTE.path,
      operationId: API_GET_FEEDBACK_ROUTE.operationId
    });
    expect(generatedApiRoutes.createPrivateBetaBugReport).toEqual({
      method: API_CREATE_BUG_REPORT_ROUTE.method,
      path: API_CREATE_BUG_REPORT_ROUTE.path,
      operationId: API_CREATE_BUG_REPORT_ROUTE.operationId
    });
  });

  it("keeps dashboard feedback vocabulary aligned with API feedback vocabulary", () => {
    const apiStatuses = Object.values(API_FEEDBACK_STATUSES).sort() as DashboardApiFeedbackStatus[];
    const apiReasons = Object.values(API_FEEDBACK_REASON_CATEGORIES).sort() as DashboardApiFeedbackReasonCategory[];
    const apiRatingTargets = Object.values(API_FEEDBACK_RATING_TARGETS).sort() as DashboardApiFeedbackRatingTarget[];

    expect(apiStatuses).toEqual(["dismissed", "rated", "reason-provided", "saved"]);
    expect([...dashboardFeedbackReasonCategories].sort()).toEqual(apiReasons);
    expect(apiRatingTargets).toEqual(["evidence-quality", "ranking-quality", "usefulness"]);
    expect(API_FEEDBACK_RATING_VALUES).toEqual([1, 2, 3, 4, 5]);
    expect(dashboardFeedbackFixtures[0]?.ratings.map((rating) => rating.target).sort()).toEqual(apiRatingTargets);
  });

  it("keeps feedback validation source free of prohibited product integrations", () => {
    const feedbackFiles = listSourceFiles(sourceRoot).filter((file) => file.includes(`${path.sep}feedback${path.sep}`));
    const violations = feedbackFiles.flatMap((file) => {
      const content = fs.readFileSync(file, "utf8");
      const relative = path.relative(webRoot, file);
      const dependencyViolation = prohibitedDependencyPattern.test(content) ? [`${relative}:dependency`] : [];
      const runtimeViolation = prohibitedRuntimePattern.test(content) ? [`${relative}:runtime`] : [];
      return [...dependencyViolation, ...runtimeViolation];
    });

    expect(violations).toEqual([]);
  });
});
