"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface CopyFieldProps {
  label?: string;
  value: string;
  masked?: boolean;
  className?: string;
}

/** Read-only field with a copy button — for CLABE, account numbers, references. */
export function CopyField({ label, value, masked, className }: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false);
  const display = masked && value.length > 8
    ? `${value.slice(0, 4)}${"•".repeat(value.length - 8)}${value.slice(-4)}`
    : value;
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };
  return (
    <div className={className}>
      {label && <span className="mb-1 block text-sm text-fg-secondary">{label}</span>}
      <div className="flex items-center justify-between rounded-control border border-border-default bg-muted px-3 h-10">
        <span className="font-mono text-sm text-fg tracking-wide">{display}</span>
        <button type="button" onClick={copy} className="text-xs font-medium text-brand-dark hover:underline">
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
