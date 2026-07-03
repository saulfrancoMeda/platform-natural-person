"use client";
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: boolean;
  /** Optional placeholder shown as a disabled first option when no value is selected. */
  placeholder?: string;
}

/**
 * Polished native select: custom chevron (lucide), placeholder support, Binance sizing.
 * Native under the hood = accessible + mobile-friendly. For searchable lists use Combobox.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, placeholder, className, value, defaultValue, ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        value={value}
        defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
        className={cn(
          "flex h-10 w-full appearance-none rounded-control border bg-surface pl-3 pr-9 text-sm text-fg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:border-brand",
          "disabled:cursor-not-allowed disabled:opacity-60 transition-colors hover:border-border-strong",
          error ? "border-error" : "border-border-default",
          className
        )}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-tertiary" />
    </div>
  )
);
Select.displayName = "Select";
