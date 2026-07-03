"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface SheetProps { open: boolean; onClose: () => void; title?: string; side?: "right" | "left"; children: React.ReactNode; }

/** Side drawer (filters, detail panels). Closes on overlay click and Escape. */
export function Sheet({ open, onClose, title, side = "right", children }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="meda-fade-in absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div role="dialog" aria-label={title}
        className={cn("absolute top-0 h-full w-full max-w-md bg-surface border-border-default p-6 shadow-xl",
          side === "right" ? "right-0 border-l meda-slide-left" : "left-0 border-r meda-slide-right")}>
        {title && <h2 className="mb-4 text-lg font-semibold text-fg">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
