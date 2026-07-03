"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-control border bg-surface px-3 py-2 text-sm text-fg font-sans",
        "placeholder:text-fg-secondary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:border-brand",
        "disabled:cursor-not-allowed disabled:opacity-60",
        error ? "border-error focus-visible:ring-error/40 focus-visible:border-error" : "border-border-default",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
