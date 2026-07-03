"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface CommandItem { id: string; label: string; onSelect: () => void; }
interface CommandProps { items: CommandItem[]; placeholder?: string; emptyText?: string; className?: string; }

/** Command/search palette: type to filter, arrow keys to navigate, Enter to select. */
export function Command({ items, placeholder = "Search...", emptyText = "No results", className }: CommandProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && filtered[active]) filtered[active].onSelect();
  };

  return (
    <div className={cn("rounded-meda border border-border-default bg-surface", className)}>
      <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }} onKeyDown={onKey}
        placeholder={placeholder}
        className="w-full border-b border-border-default bg-transparent px-4 py-3 text-sm text-fg outline-none" />
      <ul role="listbox" className="max-h-64 overflow-auto p-1">
        {filtered.length === 0 ? (
          <li className="px-3 py-2 text-sm text-fg-secondary">{emptyText}</li>
        ) : filtered.map((it, i) => (
          <li key={it.id} role="option" aria-selected={i === active}
            onMouseEnter={() => setActive(i)} onClick={it.onSelect}
            className={cn("cursor-pointer rounded px-3 py-2 text-sm", i === active ? "bg-brand text-brand-foreground" : "text-fg")}>
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
