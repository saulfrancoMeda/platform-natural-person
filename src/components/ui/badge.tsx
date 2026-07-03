import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info" | "brand";

const variants: Record<BadgeVariant, string> = {
  default: "bg-muted text-fg-secondary",
  success: "bg-success/15 text-success-dark",
  error: "bg-error/15 text-error-dark",
  warning: "bg-warning/15 text-warning-dark",
  info: "bg-info/15 text-info-dark",
  brand: "bg-brand/20 text-brand-dark",
};

export function Badge({ variant = "default", className, ...props }:
  React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
}
