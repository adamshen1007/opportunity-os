export type LoggerClock = {
  readonly nowIso: () => string;
};

export function createFixedLoggerClock(timestamp: string): LoggerClock {
  const parsedTimestamp = new Date(timestamp);

  if (Number.isNaN(parsedTimestamp.getTime())) {
    throw new TypeError("Logger clock requires a valid timestamp");
  }

  const isoTimestamp = parsedTimestamp.toISOString();

  return {
    nowIso: () => isoTimestamp
  };
}

export function createSystemLoggerClock(): LoggerClock {
  return {
    nowIso: () => new Date().toISOString()
  };
}

export const systemLoggerClock = createSystemLoggerClock();
