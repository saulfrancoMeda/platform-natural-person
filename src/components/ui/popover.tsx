"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface PopoverProps { trigger: React.ReactNode; children: React.ReactNode; align?: "left" | "right"; className?: string; }

/** Popover — floating panel for rich content (filters, forms). Closes on outside-click/Escape. */
export function Popover({ trigger, children, align = "left", className }: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div ref={ref} className="relative inline-block">
      <span onClick={() => setOpen((o) => !o)} className="inline-flex cursor-pointer" aria-expanded={open}>{trigger}</span>
      {open && (
        <div className={cn("meda-pop absolute z-20 mt-1 w-64 rounded-meda border border-border-default bg-surface p-3 shadow-lg",
          align === "right" ? "right-0" : "left-0", className)}>
          {children}
        </div>
      )}
    </div>
  );
}
