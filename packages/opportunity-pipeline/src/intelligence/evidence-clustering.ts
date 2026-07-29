import { createHash } from "node:crypto";

export const EVIDENCE_STANCES = {
  supporting: "supporting",
  contradictory: "contradictory",
  excluded: "excluded"
} as const;

export type EvidenceStance = (typeof EVIDENCE_STANCES)[keyof typeof EVIDENCE_STANCES];

export type EvidenceClusteringInput = {
  readonly evidenceId: string;
  readonly title: string;
  readonly text: string;
  readonly sourceType: string;
  readonly sourceId: string;
  readonly sourceUrl?: string;
  readonly observedAt: string;
  readonly connectorId: string;
  readonly rawContentId: string;
  readonly normalizedContentId: string;
  readonly analysisRequestId: string;
  readonly stance?: EvidenceStance;
  readonly provenance: Readonly<Record<string, string | boolean>>;
};

export type EvidenceClusterMember = EvidenceClusteringInput & {
  readonly stance: EvidenceStance;
  readonly contentFingerprint: string;
  readonly exclusionReason?: "duplicate" | "explicitly-excluded";
};

export type EvidenceClusterSynthesisProfile = {
  readonly targetUser: string;
  readonly pain: string;
  readonly context: string;
  readonly currentWorkaround: string;
  readonly desiredOutcome: string;
};

export type EvidenceCluster = {
  readonly clusterId: string;
  readonly fingerprint: string;
  readonly ruleId: string;
  readonly label: string;
  readonly definition: string;
  readonly synthesisProfile: EvidenceClusterSynthesisProfile;
  readonly supportingEvidence: readonly EvidenceClusterMember[];
  readonly contradictoryEvidence: readonly EvidenceClusterMember[];
  readonly excludedEvidence: readonly EvidenceClusterMember[];
  readonly demandCount: number;
  readonly exploratory: boolean;
};

type EvidenceClusteringRule = EvidenceClusterSynthesisProfile & {
  readonly ruleId: string;
  readonly label: string;
  readonly definition: string;
  readonly anchors: readonly string[];
};

export const EVIDENCE_CLUSTERING_RULE_VERSION = "deterministic-domain-rules-v1" as const;

export const DETERMINISTIC_EVIDENCE_CLUSTERING_RULES: readonly EvidenceClusteringRule[] = [
  {
    ruleId: "release-diagnosis",
    label: "Release diagnosis and verification overhead",
    definition: "Repeated manual work to diagnose releases, compare environments, verify recovery, and assemble sign-off evidence.",
    targetUser: "release and platform operators",
    pain: "release diagnosis and verification require repeated manual work",
    context: "during deployment, rollback, environment comparison, and release sign-off",
    currentWorkaround: "operators compare logs, dashboards, settings, and checklists by hand",
    desiredOutcome: "a traceable release review that assembles failures, recovery checks, and sign-off evidence",
    anchors: ["deploy", "deployment", "release", "rollback", "environment", "staging", "production", "smoke", "build log", "health check", "service version"]
  },
  {
    ruleId: "research-synthesis",
    label: "Research synthesis fragmentation",
    definition: "Repeated manual consolidation, tagging, traceability, and reshaping of interview research.",
    targetUser: "product researchers and research reviewers",
    pain: "research evidence becomes fragmented during synthesis and review",
    context: "when interview notes are consolidated, tagged, traced, and reshaped for stakeholders",
    currentWorkaround: "researchers manually move notes, recreate summaries, and maintain source links",
    desiredOutcome: "consistent themes and summaries that retain direct links to source observations",
    anchors: ["interview", "research", "researcher", "theme", "synthesis", "finding", "notes", "reviewer", "meeting"]
  },
  {
    ruleId: "revenue-reconciliation",
    label: "Revenue reconciliation exceptions",
    definition: "Manual investigation and reconciliation of invoice, plan-change, credit, and renewal exceptions.",
    targetUser: "finance and revenue operations teams",
    pain: "revenue exceptions require repeated manual reconciliation",
    context: "when invoices, plan changes, credits, and renewals disagree with account records",
    currentWorkaround: "staff compare account history, invoices, and spreadsheets line by line",
    desiredOutcome: "consistent exception detection with the relevant invoice and account evidence assembled",
    anchors: ["invoice", "plan change", "credit", "renewal", "reconciliation", "reconcile", "finance"]
  },
  {
    ruleId: "incident-handoff",
    label: "Incident handoff context loss",
    definition: "Missing timeline, ownership, impact, and diagnostic context when incident responsibility changes.",
    targetUser: "incident responders and on-call teams",
    pain: "incident handoffs lose operational context and cause repeated diagnosis",
    context: "when incident responsibility changes between responders or shifts",
    currentWorkaround: "responders reconstruct timelines, ownership, impact, and prior actions manually",
    desiredOutcome: "a current handoff summary with traceable timeline, ownership, impact, and diagnostics",
    anchors: ["incident", "on-call", "handoff", "responder", "timeline", "shift", "diagnostic", "impact"]
  },
  {
    ruleId: "vendor-questionnaire",
    label: "Vendor questionnaire repetition",
    definition: "Repeated preparation, evidence retrieval, assignment, and freshness checking for vendor reviews.",
    targetUser: "security and vendor-review teams",
    pain: "vendor questionnaires repeat answers and evidence work",
    context: "when security questionnaires are assigned, answered, evidenced, and reviewed",
    currentWorkaround: "staff search repositories, reuse answers, and verify ownership and freshness manually",
    desiredOutcome: "approved reusable answers with current evidence, ownership, and review history",
    anchors: ["questionnaire", "vendor review", "security questionnaire", "subject-area", "control statement", "submission"]
  },
  {
    ruleId: "inventory-triage",
    label: "Inventory exception triage",
    definition: "Manual collection, prioritization, context gathering, and closure of inventory exceptions.",
    targetUser: "inventory and operations teams",
    pain: "inventory exceptions are difficult to prioritize and close consistently",
    context: "when shortages and stock exceptions require forecast, shipment, and location context",
    currentWorkaround: "operators copy exceptions into spreadsheets and inspect several systems",
    desiredOutcome: "a consistent triage queue with context, priority, ownership, and resolution state",
    anchors: ["inventory", "stock", "shortage", "forecast", "shipment", "location", "exception"]
  },
  {
    ruleId: "compliance-evidence",
    label: "Compliance evidence collection",
    definition: "Repeated and late collection, dating, deduplication, and tracking of audit evidence.",
    targetUser: "compliance teams and control owners",
    pain: "audit evidence is repeatedly requested, dated, and tracked by hand",
    context: "during audit preparation and control evidence review",
    currentWorkaround: "teams request documents repeatedly and track collection progress manually",
    desiredOutcome: "current, deduplicated, traceable evidence organized by control and deadline",
    anchors: ["audit", "compliance", "artifact", "control evidence", "audit workstream", "evidence request", "control owner"]
  },
  {
    ruleId: "support-escalation",
    label: "Support escalation context assembly",
    definition: "Manual preparation and reuse of symptoms, prior actions, outcomes, and escalation-readiness context.",
    targetUser: "support agents and escalation teams",
    pain: "support escalations arrive without complete reusable context",
    context: "when cases move between support tiers or similar cases recur",
    currentWorkaround: "agents re-ask for details and inspect fields, symptoms, fixes, and outcomes manually",
    desiredOutcome: "an escalation-ready case summary with symptoms, attempted fixes, outcomes, and source history",
    anchors: ["support", "escalation", "escalated", "customer", "agent", "support tier", "case", "symptom", "resolution lesson"]
  }
] as const;

const stopWords = new Set(["a", "an", "and", "are", "as", "at", "be", "because", "before", "by", "can", "each", "for", "from", "in", "into", "is", "it", "of", "on", "or", "that", "the", "their", "they", "this", "to", "when", "with"]);

function normalizedText(value: string): string {
  return value.toLowerCase().normalize("NFKC").replace(/[^a-z0-9]+/gu, " ").trim();
}

function tokenize(value: string): readonly string[] {
  return normalizedText(value).split(/\s+/u).filter((token) => token.length > 2 && !stopWords.has(token));
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function contentFingerprint(input: EvidenceClusteringInput): string {
  const identity = input.sourceUrl?.trim().toLowerCase() || `${input.sourceType}:${input.sourceId}`;
  return hash(`${identity}|${normalizedText(input.title)}|${normalizedText(input.text)}`);
}

function scoreRule(rule: EvidenceClusteringRule, text: string): number {
  return rule.anchors.reduce((score, anchor) => score + (text.includes(normalizedText(anchor)) ? Math.max(1, anchor.split(/\s+/u).length) : 0), 0);
}

function selectRule(input: EvidenceClusteringInput): EvidenceClusteringRule | undefined {
  const text = normalizedText(`${input.title} ${input.text}`);
  return DETERMINISTIC_EVIDENCE_CLUSTERING_RULES
    .map((rule) => ({ rule, score: scoreRule(rule, text) }))
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.rule.ruleId.localeCompare(right.rule.ruleId))[0]?.rule;
}

function fallbackKey(input: EvidenceClusteringInput): string {
  const tokens = [...new Set(tokenize(`${input.title} ${input.text}`))].sort();
  return `unclassified-${tokens.slice(0, 4).join("-") || hash(input.evidenceId).slice(0, 12)}`;
}

function fallbackProfile(key: string): EvidenceClusteringRule {
  return {
    ruleId: key,
    label: "Exploratory evidence pattern",
    definition: "A deterministic lexical pattern that does not yet match an approved domain rule.",
    targetUser: "people represented by the cited evidence",
    pain: "the cited evidence describes a recurring problem that requires validation",
    context: "in the workflow described by the cited evidence",
    currentWorkaround: "the current workaround is not yet supported by enough evidence",
    desiredOutcome: "a validated improvement supported by additional independent evidence",
    anchors: []
  };
}

export function clusterEvidence(inputs: readonly EvidenceClusteringInput[]): readonly EvidenceCluster[] {
  const grouped = new Map<string, { rule: EvidenceClusteringRule; members: EvidenceClusterMember[] }>();
  const seenFingerprints = new Set<string>();

  for (const input of [...inputs].sort((left, right) => left.evidenceId.localeCompare(right.evidenceId))) {
    const rule = selectRule(input);
    const key = rule?.ruleId ?? fallbackKey(input);
    const selectedRule = rule ?? fallbackProfile(key);
    const fingerprint = contentFingerprint(input);
    const duplicate = seenFingerprints.has(fingerprint);
    seenFingerprints.add(fingerprint);
    const stance = duplicate ? EVIDENCE_STANCES.excluded : input.stance ?? EVIDENCE_STANCES.supporting;
    const member: EvidenceClusterMember = {
      ...input,
      stance,
      contentFingerprint: fingerprint,
      ...(duplicate ? { exclusionReason: "duplicate" as const } : stance === EVIDENCE_STANCES.excluded ? { exclusionReason: "explicitly-excluded" as const } : {})
    };
    const group = grouped.get(key) ?? { rule: selectedRule, members: [] };
    group.members.push(member);
    grouped.set(key, group);
  }

  return [...grouped.entries()].map(([key, group]) => {
    const supportingEvidence = group.members.filter((member) => member.stance === EVIDENCE_STANCES.supporting);
    const contradictoryEvidence = group.members.filter((member) => member.stance === EVIDENCE_STANCES.contradictory);
    const excludedEvidence = group.members.filter((member) => member.stance === EVIDENCE_STANCES.excluded);
    const membershipFingerprint = hash(`${EVIDENCE_CLUSTERING_RULE_VERSION}|${key}|${group.members.map((member) => member.contentFingerprint).sort().join("|")}`);
    return {
      clusterId: `evidence-cluster-${membershipFingerprint.slice(0, 20)}`,
      fingerprint: membershipFingerprint,
      ruleId: group.rule.ruleId,
      label: group.rule.label,
      definition: group.rule.definition,
      synthesisProfile: {
        targetUser: group.rule.targetUser,
        pain: group.rule.pain,
        context: group.rule.context,
        currentWorkaround: group.rule.currentWorkaround,
        desiredOutcome: group.rule.desiredOutcome
      },
      supportingEvidence,
      contradictoryEvidence,
      excludedEvidence,
      demandCount: new Set(supportingEvidence.map((member) => `${member.sourceType}:${member.sourceId}`)).size,
      exploratory: supportingEvidence.length < 2
    };
  }).sort((left, right) => left.clusterId.localeCompare(right.clusterId));
}
