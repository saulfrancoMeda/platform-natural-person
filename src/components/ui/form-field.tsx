"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { Input } from "./input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const fieldId = id || React.useId();
    const errId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={fieldId} className="text-sm font-medium text-fg">{label}</label>
        <Input
          ref={ref}
          id={fieldId}
          error={!!error}
          aria-invalid={!!error}
          aria-describedby={cn(error && errId, hint && hintId) || undefined}
          {...props}
        />
        {hint && !error && <p id={hintId} className="text-xs text-fg-secondary">{hint}</p>}
        {error && <p id={errId} className="text-xs text-error">{error}</p>}
      </div>
    );
  }
);
FormField.displayName = "FormField";
