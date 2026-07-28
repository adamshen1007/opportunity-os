import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ActiveScanProvider } from "../features/scans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opportunity OS Dashboard",
  description: "Dashboard MVP application for Opportunity OS.",
  other: {
    "opportunity-os-release-sha": process.env.NEXT_PUBLIC_OPPORTUNITY_OS_RELEASE_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "unavailable",
    "opportunity-os-api-origin": process.env.NEXT_PUBLIC_OPPORTUNITY_OS_API_BASE_URL ?? "http://127.0.0.1:4000"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body><ActiveScanProvider>{children}</ActiveScanProvider></body>
    </html>
  );
}
