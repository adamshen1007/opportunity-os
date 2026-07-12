export interface FixedWindowRateLimiter {
  readonly consume: (key: string, now?: number) => { readonly allowed: boolean; readonly remaining: number };
}

export function createFixedWindowRateLimiter(input: {
  readonly limit: number;
  readonly windowMs: number;
}): FixedWindowRateLimiter {
  const entries = new Map<string, { count: number; resetAt: number }>();
  return {
    consume(key, now = Date.now()) {
      const current = entries.get(key);
      const entry = !current || current.resetAt <= now
        ? { count: 0, resetAt: now + input.windowMs }
        : current;
      entry.count += 1;
      entries.set(key, entry);
      return {
        allowed: entry.count <= input.limit,
        remaining: Math.max(input.limit - entry.count, 0)
      };
    }
  };
}
