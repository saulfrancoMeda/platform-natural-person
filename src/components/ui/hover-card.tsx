"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
interface HoverCardProps { trigger: React.ReactNode; children: React.ReactNode; className?: string; }
/** Card shown on hover/focus — for previews (user, merchant, asset details). */
export function HoverCard({ trigger, children, className }: HoverCardProps) {
  const [show, setShow] = React.useState(false);
  return (
    <span className="relative inline-flex"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {trigger}
      {show && (
        <div className={cn("meda-pop absolute z-30 top-full mt-1 left-0 w-64 rounded-meda border border-border-default bg-surface p-4 shadow-lg", className)}>
          {children}
        </div>
      )}
    </span>
  );
}
