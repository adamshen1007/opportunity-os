export type Clock = {
  readonly now: () => Date;
};

export type TimestampInput = Date | number | string;

export const systemClock: Clock = {
  now: () => new Date()
};

function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

function toDate(value: TimestampInput): Date {
  const date = value instanceof Date ? cloneDate(value) : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new RangeError("Timestamp input must represent a valid date.");
  }

  return date;
}

export function toIsoTimestamp(value: TimestampInput): string {
  return toDate(value).toISOString();
}

export function createClock(now: () => TimestampInput): Clock {
  return {
    now: () => toDate(now())
  };
}

export function createFixedClock(date: TimestampInput): Clock {
  const fixedDate = toDate(date);

  return {
    now: () => cloneDate(fixedDate)
  };
}

export function createSequenceClock(dates: readonly TimestampInput[]): Clock {
  const sequence = dates.map(toDate);
  let index = 0;

  return {
    now: () => {
      if (sequence.length === 0) {
        throw new RangeError("Sequence clock requires at least one timestamp.");
      }

      const current = sequence[Math.min(index, sequence.length - 1)];
      index += 1;

      if (current === undefined) {
        throw new RangeError("Sequence clock requires at least one timestamp.");
      }

      return cloneDate(current);
    }
  };
}

export function getIsoTimestamp(clock: Clock = systemClock): string {
  return toIsoTimestamp(clock.now());
}
