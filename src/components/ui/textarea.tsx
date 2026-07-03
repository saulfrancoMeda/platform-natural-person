import * as React from "react";
import { cn } from "@/lib/cn";
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  ({ className, error, ...props }, ref) => (
    <textarea ref={ref}
      className={cn("flex min-h-20 w-full rounded-control border bg-surface px-3 py-2 text-sm text-fg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:border-brand",
        error ? "border-error" : "border-border-default", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";
