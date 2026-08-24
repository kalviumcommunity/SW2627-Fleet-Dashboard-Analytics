"use client";

import type { ReactNode } from "react";

/**
 * Fleet Dashboard — Footer
 *
 * Deliberately built as a thin, persistent status strip rather than a
 * marketing-style sitemap footer — this is an operations console, so the
 * footer's job is to report system health, not sell the product.
 *
 * Wire `lastSyncedSeconds` up to your live polling/websocket layer.
 * Uses the same tokens/fonts as header.tsx — see comments there.
 */

export type SystemStatus = "operational" | "degraded" | "down";

export interface FooterProps {
  systemStatus?: SystemStatus;
  lastSyncedSeconds?: number;
  version?: string;
}

const STATUS_MAP: Record<SystemStatus, { color: string; label: string }> = {
  operational: { color: "#34D399", label: "All systems operational" },
  degraded: { color: "#F5A524", label: "Degraded performance" },
  down: { color: "#F87171", label: "Sync interrupted" },
};

export default function Footer({
  systemStatus = "operational",
  lastSyncedSeconds = 12,
  version = "v0.1.0",
}: FooterProps) {
  const status = STATUS_MAP[systemStatus];

  return (
    <footer className="w-full border-t border-[#23324D] bg-[#0B1220]">
      <div
        className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-3 text-xs text-[#7C89A6] sm:flex-row sm:items-center sm:justify-between sm:px-6"
        style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
      >
        {/* Left: live status */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: status.color }}
              />
              <span
                className="relative inline-flex h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: status.color }}
              />
            </span>
            <span className="text-[#E7ECF5]">{status.label}</span>
          </span>
          <span className="hidden text-[#23324D] sm:inline">|</span>
          <span>
            Last sync: {lastSyncedSeconds}s ago
            <span className="ml-0.5 inline-block h-3 w-[6px] translate-y-[1px] animate-pulse bg-[#22D3EE]/70 align-middle" />
          </span>
        </div>

        {/* Center: links */}
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <FooterLink href="/docs">Docs</FooterLink>
          <FooterLink href="/status">API status</FooterLink>
          <FooterLink href="/support">Support</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
        </nav>

        {/* Right: attribution + version */}
        <div className="flex items-center gap-3 text-[#7C89A6]">
          <span>Map data © MapmyIndia</span>
          <span className="hidden text-[#23324D] sm:inline">|</span>
          <span className="text-[#7C89A6]">{version}</span>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  children: ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a
      href={href}
      className="uppercase tracking-wide text-[#7C89A6] transition-colors hover:text-[#22D3EE]"
    >
      {children}
    </a>
  );
}export default function Footer() {
  return (
    <footer>
      <p>Footer content goes here</p>
    </footer>
  );
}