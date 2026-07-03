"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface AccordionItem { id: string; title: string; content: React.ReactNode; }
interface AccordionProps { items: AccordionItem[]; defaultOpen?: string; className?: string; }

/** Accordion — one section open at a time. Keyboard accessible via native buttons. */
export function Accordion({ items, defaultOpen, className }: AccordionProps) {
  const [open, setOpen] = React.useState<string | null>(defaultOpen ?? null);
  return (
    <div className={cn("divide-y divide-border-default rounded-meda border border-border-default", className)}>
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id}>
            <button type="button" onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-fg hover:bg-muted">
              {it.title}
              <span className={cn("transition-transform", isOpen && "rotate-180")}>⌄</span>
            </button>
            {isOpen && <div className="meda-fade-in px-4 pb-4 text-sm text-fg-secondary">{it.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
