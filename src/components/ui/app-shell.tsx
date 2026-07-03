"use client";
import * as React from "react";
import { Menu } from "lucide-react";
import { MedaLogo } from "@/features/auth/meda-logo";
import { ThemeToggle } from "./theme-toggle";
import { Sidebar, type NavGroup } from "./sidebar";

interface AppShellProps {
  groups: NavGroup[];
  activeHref?: string;
  /** Sidebar header (defaults to MedaLogo). */
  sidebarHeader?: React.ReactNode;
  /** Sidebar footer (user menu, version…). */
  sidebarFooter?: React.ReactNode;
  /** Right side of the top bar. */
  topRight?: React.ReactNode;
  /** Allow collapsing the sidebar to an icon rail. Default true. */
  sidebarCollapsible?: boolean;
  children: React.ReactNode;
}

/**
 * Admin app shell: customizable Sidebar + top bar + content. Standard layout for MEDA back-office.
 * The sidebar is the <Sidebar> component (collapsible, badges, header/footer) — pass groups to configure.
 */
export function AppShell({ groups, activeHref, sidebarHeader, sidebarFooter, topRight, sidebarCollapsible = true, children }: AppShellProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex h-dvh overflow-hidden bg-bg print:block print:h-auto print:overflow-visible">
      {/* `contents` deja que el <aside> sea hijo directo del flex y estire a todo el alto. */}
      <div className="contents print:hidden">
        <Sidebar
          groups={groups} activeHref={activeHref} collapsible={sidebarCollapsible}
          header={sidebarHeader ?? <MedaLogo />} footer={sidebarFooter}
          mobileOpen={open} onMobileClose={() => setOpen(false)}
        />
      </div>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="flex min-w-0 flex-1 flex-col print:block">
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border-default bg-bg/90 px-5 backdrop-blur print:hidden">
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden text-fg" aria-label="Menu"><Menu className="h-5 w-5" /></button>
          <div className="ml-auto flex items-center gap-3">{topRight}<ThemeToggle /></div>
        </header>
        <main className="flex-1 overflow-y-auto p-5 lg:p-8 print:overflow-visible print:p-0">{children}</main>
      </div>
    </div>
  );
}
