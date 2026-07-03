"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface InputOTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  className?: string;
}

/**
 * One-time-password input (2FA codes, SMS verification). `length` boxes, auto-advance, paste-aware,
 * backspace moves back. Digits only. Common in fintech auth flows.
 */
export function InputOTP({ length = 6, value, onChange, error, className }: InputOTPProps) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").slice(0, length);
  while (digits.length < length) digits.push("");

  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join(""));
  };

  const onChangeAt = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, "").slice(-1);
    setAt(i, d);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) { onChange(pasted); refs.current[Math.min(pasted.length, length - 1)]?.focus(); }
  };

  return (
    <div className={cn("flex gap-2", className)} onPaste={onPaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => onChangeAt(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "h-12 w-10 rounded-control border bg-surface text-center text-lg font-semibold text-fg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:border-brand",
            error ? "border-error" : "border-border-default"
          )}
        />
      ))}
    </div>
  );
}
