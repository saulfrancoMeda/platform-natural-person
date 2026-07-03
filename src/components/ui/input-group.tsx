"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Input with addons inside the field: leading/trailing icon, text prefix/suffix, or a button.
 * Examples: search (leading icon), amount ($ prefix), URL (https:// prefix), password (trailing toggle).
 * Compose: <InputGroup><InputGroupAddon>$</InputGroupAddon><InputGroupInput /></InputGroup>
 */
export function InputGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn(
      "flex h-10 items-center rounded-control border border-border-default bg-surface",
      "focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/50",
      className
    )}>
      {children}
    </div>
  );
}

export function InputGroupAddon({ position = "leading", className, children }: {
  position?: "leading" | "trailing"; className?: string; children: React.ReactNode;
}) {
  return (
    <span className={cn(
      "flex shrink-0 items-center text-sm text-fg-secondary",
      position === "leading" ? "pl-3" : "pr-3",
      className
    )}>
      {children}
    </span>
  );
}

export const InputGroupInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn("h-full w-full bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-tertiary", className)} {...props} />
  )
);
InputGroupInput.displayName = "InputGroupInput";
