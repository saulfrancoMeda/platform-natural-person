"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
interface RadioGroupProps { name: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string; }
export function RadioGroup({ name, value, onChange, options, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>
      {options.map((o) => (
        <label key={o.value} className="inline-flex items-center gap-2 text-sm text-fg cursor-pointer">
          <input type="radio" name={name} value={o.value} checked={value === o.value}
            onChange={() => onChange(o.value)} className="h-4 w-4 accent-brand" />
          {o.label}
        </label>
      ))}
    </div>
  );
}
