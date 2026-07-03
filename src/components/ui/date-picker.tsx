"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface DatePickerProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  locale?: string;
  error?: boolean;
  className?: string;
  id?: string;
}

const DAYS_ES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

/**
 * Date picker with a real month calendar (no external lib). For transaction date filters, scheduling.
 * Closes on outside-click. Locale-aware label formatting.
 */
export function DatePicker({ value, onChange, placeholder = "Select date", locale = "es-MX", error, className, id }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => value ?? new Date());
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isSelected = (d: number) =>
    value && value.getFullYear() === year && value.getMonth() === month && value.getDate() === d;

  const pick = (d: number) => { onChange(new Date(year, month, d)); setOpen(false); };
  const monthLabel = view.toLocaleDateString(locale, { month: "long", year: "numeric" });
  const valueLabel = value ? value.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" }) : placeholder;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button type="button" id={id} onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open}
        className={cn("flex h-10 w-full items-center justify-between rounded-control border bg-surface px-3 text-sm",
          error ? "border-error" : "border-border-default focus-visible:border-brand",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50")}>
        <span className={value ? "text-fg" : "text-fg-secondary"}>{valueLabel}</span>
        <span className="text-fg-tertiary">📅</span>
      </button>
      {open && (
        <div role="dialog" className="meda-pop absolute z-30 mt-1 w-72 rounded-control border border-border-default bg-surface p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" onClick={() => setView(new Date(year, month - 1, 1))} className="rounded px-2 py-1 text-fg-secondary hover:bg-muted" aria-label="Previous month">‹</button>
            <span className="text-sm font-medium text-fg capitalize">{monthLabel}</span>
            <button type="button" onClick={() => setView(new Date(year, month + 1, 1))} className="rounded px-2 py-1 text-fg-secondary hover:bg-muted" aria-label="Next month">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS_ES.map((d) => <div key={d} className="py-1 text-xs text-fg-tertiary">{d}</div>)}
            {cells.map((d, i) => d === null ? <div key={i} /> : (
              <button key={i} type="button" onClick={() => pick(d)}
                className={cn("rounded py-1.5 text-sm hover:bg-muted",
                  isSelected(d) ? "bg-brand text-brand-foreground hover:bg-brand" : "text-fg")}>
                {d}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
