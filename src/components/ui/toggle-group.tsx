"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
interface ToggleGroupProps { value: string; onChange: (v: string) => void; options: { value: string; label: React.ReactNode }[]; className?: string; }
/** Segmented control — pick one option (e.g. time range: 1D / 1W / 1M). */
export function ToggleGroup({ value, onChange, options, className }: ToggleGroupProps) {
  return (
    <div role="group" className={cn("inline-flex rounded-meda border border-border-default p-0.5", className)}>
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={cn("rounded px-3 py-1.5 text-sm transition-colors",
            value === o.value ? "bg-brand text-brand-foreground" : "text-fg-secondary hover:bg-muted")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
