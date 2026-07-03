"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
interface SliderProps { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; className?: string; }
export function Slider({ value, onChange, min = 0, max = 100, step = 1, className }: SliderProps) {
  return (
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn("h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-brand", className)} />
  );
}
