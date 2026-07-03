"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
interface SwitchProps { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; id?: string; }
export function Switch({ checked, onChange, disabled, id }: SwitchProps) {
  return (
    <button id={id} type="button" role="switch" aria-checked={checked} disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn("relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-brand" : "bg-border-strong", disabled && "opacity-50 cursor-not-allowed")}>
      <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform", checked ? "translate-x-6" : "translate-x-1")} />
    </button>
  );
}
