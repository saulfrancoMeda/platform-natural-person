import * as React from "react";
import { cn } from "@/lib/cn";
import { SuccessIcon, ErrorIcon, WaitingIcon } from "@/components/icons/status-icons";

type Status = "SUCCESS" | "PROCESSING" | "PENDING" | "FAILED" | "REFUNDED";
const map: Record<Status, { label: string; dot: string; text: string }> = {
  SUCCESS:    { label: "Success",    dot: "bg-success", text: "text-success" },
  PROCESSING: { label: "Processing", dot: "bg-warning", text: "text-warning" },
  PENDING:    { label: "Pending",    dot: "bg-warning", text: "text-warning" },
  FAILED:     { label: "Failed",     dot: "bg-error",   text: "text-error" },
  REFUNDED:   { label: "Refunded",   dot: "bg-info",    text: "text-info" },
};

/** Transaction status with a colored dot — clearer than color-only (accessibility). */
export function StatusPill({ status, className }: { status: Status; className?: string }) {
  const s = map[status] ?? map.PENDING;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", s.text, className)}>
      <span className={cn("h-2 w-2 rounded-full", s.dot)} aria-hidden /> {s.label}
    </span>
  );
}

/** Larger status display with the MEDA brand icon — for confirmation screens / result pages. */
export function StatusResult({ status, title, description }: { status: "SUCCESS" | "FAILED" | "PROCESSING"; title: string; description?: string }) {
  const Icon = status === "SUCCESS" ? SuccessIcon : status === "FAILED" ? ErrorIcon : WaitingIcon;
  return (
    <div className="flex flex-col items-center text-center gap-3 py-6">
      <Icon size={64} />
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      {description && <p className="text-sm text-fg-secondary max-w-sm">{description}</p>}
    </div>
  );
}
