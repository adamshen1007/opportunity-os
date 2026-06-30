export type DatabaseSeedPlan = Readonly<{
  name: string;
  description: string;
  enabled: false;
}>;

export type DatabaseSeedResult = Readonly<{
  status: "skipped";
  plan: DatabaseSeedPlan;
}>;

export function createSeedPlaceholder(plan: Omit<DatabaseSeedPlan, "enabled">): DatabaseSeedResult {
  return {
    status: "skipped",
    plan: {
      ...plan,
      enabled: false
    }
  };
}
