export const CONTAINER_LIFETIMES = [
  "singleton",
  "scoped",
  "transient"
] as const;

export type ContainerLifetime = (typeof CONTAINER_LIFETIMES)[number];
