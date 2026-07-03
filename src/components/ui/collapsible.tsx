"use client";
import * as React from "react";
interface CollapsibleProps { trigger: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; }
export function Collapsible({ trigger, children, defaultOpen }: CollapsibleProps) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div>
      <div role="button" tabIndex={0} onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); } }}
        aria-expanded={open} className="w-full cursor-pointer text-left">
        {trigger}
      </div>
      {open && <div className="meda-fade-in mt-2">{children}</div>}
    </div>
  );
}
