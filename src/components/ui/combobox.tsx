"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export interface ComboboxOption { value: string; label: string; description?: string; }
interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: boolean;
  className?: string;
  id?: string;
}

/**
 * Searchable select (combobox). For long lists where a plain Select is unusable:
 * merchants, currencies, beneficiaries, countries. Keyboard: type to filter, ↑/↓ to move, Enter to pick.
 */
export function Combobox({
  options, value, onChange, placeholder = "Select...", searchPlaceholder = "Search...",
  emptyText = "No results", error, className, id,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  React.useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const pick = (v: string) => { onChange(v); setOpen(false); setQuery(""); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && filtered[active]) { e.preventDefault(); pick(filtered[active].value); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button type="button" id={id} onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}
        className={cn("flex h-10 w-full items-center justify-between rounded-control border bg-surface px-3 text-sm",
          error ? "border-error" : "border-border-default focus-visible:border-brand",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50")}>
        <span className={cn(selected ? "text-fg" : "text-fg-secondary")}>{selected ? selected.label : placeholder}</span>
        <span className="text-fg-tertiary">⌄</span>
      </button>
      {open && (
        <div className="meda-pop absolute z-30 mt-1 w-full rounded-control border border-border-default bg-surface shadow-lg">
          <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); setActive(0); }} onKeyDown={onKey}
            placeholder={searchPlaceholder}
            className="w-full border-b border-border-default bg-transparent px-3 py-2 text-sm text-fg outline-none" />
          <ul role="listbox" className="max-h-60 overflow-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-fg-secondary">{emptyText}</li>
            ) : filtered.map((o, i) => (
              <li key={o.value} role="option" aria-selected={o.value === value}
                onMouseEnter={() => setActive(i)} onClick={() => pick(o.value)}
                className={cn("cursor-pointer rounded px-3 py-2 text-sm",
                  i === active ? "bg-muted" : "", o.value === value ? "text-brand-dark font-medium" : "text-fg")}>
                <div>{o.label}</div>
                {o.description && <div className="text-xs text-fg-secondary">{o.description}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
