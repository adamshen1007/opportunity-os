import type { ApiRequestContext } from "../http/index.js";

export const LEGACY_UNOWNED_PRINCIPAL_ID = "__legacy_unowned__";
export const LOCAL_DEVELOPMENT_PRINCIPAL_ID = "__local_development__";

export type ApiOwnershipScope =
  | { readonly mode: "owner"; readonly principalId: string }
  | { readonly mode: "administrator"; readonly principalId: string; readonly reason: string };

export function createOwnerScope(principalId: string): ApiOwnershipScope {
  const normalized = principalId.trim();
  if (normalized.length === 0 || normalized === LEGACY_UNOWNED_PRINCIPAL_ID) {
    throw new Error("An authenticated principal is required.");
  }
  return { mode: "owner", principalId: normalized };
}

export function requireOwnershipScope(context: ApiRequestContext): ApiOwnershipScope {
  if (!context.ownership) {
    throw new Error("Server-derived ownership context is required.");
  }
  return context.ownership;
}

export function ownerWhere(scope: ApiOwnershipScope): Readonly<Record<string, string>> {
  return scope.mode === "owner" ? { ownerPrincipalId: scope.principalId } : {};
}

export function ownsPrincipal(scope: ApiOwnershipScope, ownerPrincipalId: string): boolean {
  return scope.mode === "administrator" || scope.principalId === ownerPrincipalId;
}
