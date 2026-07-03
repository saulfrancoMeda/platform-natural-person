"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { maskAmount, parseAmount } from "@/lib/utils/mask";

interface AmountInputProps {
  value: number | "";
  onChange: (value: number | "") => void;
  currency?: string;
  error?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Money input with live thousands-grouping mask: typing "1234567.5" shows "1,234,567.50".
 * Keeps two decimals max. Emits a clean number (or "" when empty) via onChange.
 */
export function AmountInput({ value, onChange, currency = "MXN", error, placeholder = "0.00", className, id }: AmountInputProps) {
  // Display the masked string; keep the numeric value as source of truth.
  const display = value === "" ? "" : maskAmount(String(value));

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskAmount(e.target.value);
    if (masked === "") return onChange("");
    onChange(parseAmount(masked));
  };

  return (
    <div className={cn("flex items-center rounded-control border bg-surface px-3 h-10",
      error ? "border-error" : "border-border-default focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/50", className)}>
      <span className="mr-2 text-fg-secondary text-sm">{currency === "MXN" ? "$" : currency}</span>
      <input
        id={id}
        inputMode="decimal"
        value={display}
        onChange={handle}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-fg outline-none text-sm"
      />
      <span className="ml-2 text-fg-tertiary text-xs">{currency}</span>
    </div>
  );
}
