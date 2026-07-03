"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div role="tablist" className={cn("flex gap-1 border-b border-border-default", className)}>
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={active === t.id} onClick={() => onChange(t.id)}
          className={cn("px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            active === t.id ? "border-brand text-fg" : "border-transparent text-fg-secondary hover:text-fg")}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
