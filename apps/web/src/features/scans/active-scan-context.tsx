"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createDashboardApiClient, getScan, listScans, type DashboardApiScanResultDto } from "../../api";

export const LAST_SCAN_STORAGE_KEY = "opportunity-os:last-scan-id";

type ActiveScanStatus = "loading" | "ready" | "empty" | "error";

interface ActiveScanContextValue {
  readonly status: ActiveScanStatus;
  readonly scan?: DashboardApiScanResultDto;
  readonly setActiveScan: (scan: DashboardApiScanResultDto) => void;
  readonly clearActiveScan: (scanId: string) => void;
}

const ActiveScanContext = createContext<ActiveScanContextValue | undefined>(undefined);

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL ?? "http://127.0.0.1:4000";
}

function createClient() {
  return createDashboardApiClient({
    baseUrl: getApiBaseUrl(),
    correlationId: `dashboard-active-scan-${Date.now().toString(36)}`,
    fetch: window.fetch.bind(window)
  });
}

export function ActiveScanProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [status, setStatus] = useState<ActiveScanStatus>("loading");
  const [scan, setScan] = useState<DashboardApiScanResultDto>();

  const setActiveScan = useCallback((nextScan: DashboardApiScanResultDto) => {
    window.localStorage.setItem(LAST_SCAN_STORAGE_KEY, nextScan.scanId);
    setScan(nextScan);
    setStatus("ready");
  }, []);

  const clearActiveScan = useCallback((scanId: string) => {
    setScan((current) => {
      if (current?.scanId !== scanId) return current;
      window.localStorage.removeItem(LAST_SCAN_STORAGE_KEY);
      setStatus("empty");
      return undefined;
    });
  }, []);

  useEffect(() => {
    let active = true;
    const client = createClient();
    const storedScanId = window.localStorage.getItem(LAST_SCAN_STORAGE_KEY);

    async function restoreActiveScan() {
      try {
        if (storedScanId) {
          const storedResult = await getScan(client, storedScanId);
          if (storedResult.ok) {
            if (active) setActiveScan(storedResult.data);
            return;
          }
        }

        const historyResult = await listScans(client, 1);
        const latestScan = historyResult.ok ? historyResult.data.scans[0] : undefined;
        if (latestScan) {
          if (active) setActiveScan(latestScan);
          return;
        }

        if (active) setStatus("empty");
      } catch {
        if (active) setStatus(storedScanId ? "error" : "empty");
      }
    }

    void restoreActiveScan();
    return () => {
      active = false;
    };
  }, [setActiveScan]);

  const value = useMemo(
    () => ({ status, scan, setActiveScan, clearActiveScan }),
    [clearActiveScan, scan, setActiveScan, status]
  );
  return <ActiveScanContext.Provider value={value}>{children}</ActiveScanContext.Provider>;
}

export function useActiveScan(): ActiveScanContextValue {
  const context = useContext(ActiveScanContext);
  if (!context) throw new Error("useActiveScan must be used within ActiveScanProvider.");
  return context;
}
