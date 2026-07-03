"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

/** Accessible dropdown menu. Closes on outside-click and Escape. */
export function DropdownMenu({ trigger, children, align = "left", className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <span onClick={() => setOpen((o) => !o)} className="inline-flex cursor-pointer" aria-haspopup="menu" aria-expanded={open}>
        {trigger}
      </span>
      {open && (
        <div role="menu"
          className={cn("meda-pop absolute z-20 mt-1 min-w-44 rounded-meda border border-border-default bg-surface p-1 shadow-lg",
            align === "right" ? "right-0" : "left-0", className)}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, danger }: { children: React.ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button role="menuitem" onClick={onClick}
      className={cn("flex w-full items-center rounded px-3 py-2 text-left text-sm hover:bg-muted",
        danger ? "text-error" : "text-fg")}>
      {children}
    </button>
  );
}
