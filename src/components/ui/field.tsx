"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Composable field primitives (shadcn's newer pattern). More flexible than FormField:
 * compose any control (Input, Select, Combobox, etc.) with label/description/error.
 *
 *   <Field>
 *     <FieldLabel htmlFor="email">Email</FieldLabel>
 *     <Input id="email" />
 *     <FieldDescription>We'll never share it.</FieldDescription>
 *     <FieldError>Invalid email</FieldError>
 *   </Field>
 *
 * Use FieldGroup to stack multiple fields with consistent spacing.
 */
export function Field({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}

export function FieldGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-4", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-medium text-fg", className)} {...props} />;
}

export function FieldDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-xs text-fg-secondary", className)} {...props} />;
}

export function FieldError({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return <p role="alert" className={cn("text-xs text-error", className)} {...props}>{children}</p>;
}
