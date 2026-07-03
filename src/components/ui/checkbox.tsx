"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> { label?: string; }
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ label, className, id, ...props }, ref) => (
  <label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-fg cursor-pointer">
    <input ref={ref} id={id} type="checkbox"
      className={cn("h-4 w-4 rounded border-border-strong text-brand accent-brand focus-visible:ring-2 focus-visible:ring-brand/50", className)} {...props} />
    {label}
  </label>
));
Checkbox.displayName = "Checkbox";
