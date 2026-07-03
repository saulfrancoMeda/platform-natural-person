"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  /** Optional badge (count, "Nuevo", etc.). */
  badge?: string | number;
}
export interface NavGroup { title?: string; items: NavItem[]; }

interface SidebarProps {
  groups: NavGroup[];
  activeHref?: string;
  /** Top of the sidebar (logo). */
  header?: React.ReactNode;
  /** Bottom of the sidebar (user menu, version, sign out). */
  footer?: React.ReactNode;
  /** Allow collapsing to an icon-only rail. Default true. */
  collapsible?: boolean;
  /** Start collapsed. */
  defaultCollapsed?: boolean;
  /** Controlled mobile open state (AppShell drives this). */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  /** Render in normal flow (not fixed/overlay) — for embedding in a demo or a custom layout. */
  embedded?: boolean;
  className?: string;
}

/**
 * Customizable sidebar navigation. Groups with optional titles, items with icons + badges,
 * collapsible to an icon rail, header/footer slots. Use standalone or via AppShell.
 */
export function Sidebar({
  groups, activeHref, header, footer, collapsible = true, defaultCollapsed = false,
  mobileOpen, onMobileClose, embedded = false, className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const w = collapsed ? "w-16" : "w-60";

  return (
    <aside className={cn(
      "flex flex-col border-r border-border-default bg-surface transition-all",
      embedded ? "h-full" : "fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0",
      w,
      !embedded && (mobileOpen ? "translate-x-0" : "-translate-x-full"),
      className
    )}>
      {header && <div className={cn("flex h-16 items-center border-b border-border-default", collapsed ? "justify-center px-2" : "px-5")}>{header}</div>}

      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {groups.map((g, gi) => (
          <div key={gi}>
            {g.title && !collapsed && <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-fg-tertiary">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = activeHref === it.href;
                return (
                  <li key={it.href}>
                    <Link href={it.href} onClick={onMobileClose} title={collapsed ? it.label : undefined}
                      className={cn("flex items-center gap-2.5 rounded-control px-3 py-2 text-sm transition-colors",
                        collapsed && "justify-center px-0",
                        active ? "bg-brand/15 font-medium text-brand-dark" : "text-fg-secondary hover:bg-muted hover:text-fg")}>
                      {it.icon && <span className="shrink-0 text-base">{it.icon}</span>}
                      {!collapsed && <span className="flex-1">{it.label}</span>}
                      {!collapsed && it.badge != null && (
                        <span className="rounded-full bg-brand/20 px-1.5 py-0.5 text-[10px] font-medium text-brand-dark">{it.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {footer && !collapsed && <div className="border-t border-border-default p-3">{footer}</div>}

      {collapsible && (
        <button onClick={() => setCollapsed((c) => !c)} aria-label={collapsed ? "Expandir" : "Colapsar"}
          className="hidden items-center justify-center border-t border-border-default py-2 text-fg-tertiary hover:bg-muted hover:text-fg lg:flex">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      )}
    </aside>
  );
}
