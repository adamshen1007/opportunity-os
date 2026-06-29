export type LoggerDestination = {
  readonly write: (message: string) => void;
};

export type InMemoryLoggerDestination = LoggerDestination & {
  readonly entries: readonly string[];
  readonly read: () => readonly string[];
  readonly clear: () => void;
};

export function createInMemoryLoggerDestination(): InMemoryLoggerDestination {
  const entries: string[] = [];

  return {
    write: (message: string) => {
      entries.push(message);
    },
    get entries() {
      return [...entries];
    },
    read: () => [...entries],
    clear: () => {
      entries.length = 0;
    }
  };
}
