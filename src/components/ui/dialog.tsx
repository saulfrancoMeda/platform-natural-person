"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="meda-fade-in absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn("meda-dialog-in relative z-10 w-full max-w-md rounded-meda bg-surface border border-border-default shadow-xl", className)}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border-default p-5">
            <h2 className="text-lg font-semibold text-fg">{title}</h2>
            <button onClick={onClose} aria-label="Close" className="text-fg-secondary hover:text-fg rounded p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">✕</button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
