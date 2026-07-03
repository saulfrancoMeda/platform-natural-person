"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export interface DetailField { label: string; value: React.ReactNode; }

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  /** Key-value summary grid at the top (like the CEP header: Concepto, Estado, Clave de rastreo…). */
  fields?: DetailField[];
  /** Optional actions row at the bottom (download, open external, etc.). */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Open in a wider panel for dense detail (default md). */
  size?: "md" | "lg" | "xl";
}

/**
 * Rich detail modal for record inspection (e.g. transaction receipt / CEP, user detail).
 * Header with icon + title + close, a key-value summary grid, free content, and a footer actions row.
 * Closes on overlay click and Escape.
 */
export function DetailModal({ open, onClose, title, icon, fields, footer, children, size = "md" }: DetailModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;
  const width = size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4 sm:p-8" onClick={onClose}>
      <div className={cn("meda-pop w-full rounded-meda border border-border-default bg-surface shadow-xl", width)} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border-default px-6 py-4">
          {icon && <span className="flex h-9 w-9 items-center justify-center rounded-meda bg-brand text-brand-foreground">{icon}</span>}
          <h2 className="flex-1 text-lg font-semibold text-fg">{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-fg-tertiary hover:text-fg text-xl leading-none">×</button>
        </div>
        {/* Summary grid */}
        {fields && fields.length > 0 && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-border-default px-6 py-4 sm:grid-cols-3">
            {fields.map((f, i) => (
              <div key={i}>
                <p className="text-[11px] uppercase tracking-wide text-fg-tertiary">{f.label}</p>
                <p className="mt-0.5 text-sm font-medium text-fg break-words">{f.value}</p>
              </div>
            ))}
          </div>
        )}
        {/* Content */}
        {children && <div className="px-6 py-4">{children}</div>}
        {/* Footer */}
        {footer && <div className="flex items-center justify-end gap-2 border-t border-border-default px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
