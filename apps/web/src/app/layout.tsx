import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ActiveScanProvider } from "../features/scans";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opportunity OS Dashboard",
  description: "Dashboard MVP application for Opportunity OS."
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
