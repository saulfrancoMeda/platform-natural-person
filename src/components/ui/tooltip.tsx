"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

/** Tooltip shown on hover AND keyboard focus (accessible). */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [show, setShow] = React.useState(false);
  return (
    <span className="relative inline-flex"
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {show && (
        <span role="tooltip"
          className={cn("meda-fade-in absolute z-30 whitespace-nowrap rounded-meda bg-fg px-2 py-1 text-xs text-bg shadow-lg left-1/2 -translate-x-1/2",
            side === "top" ? "bottom-full mb-1" : "top-full mt-1", className)}>
          {content}
        </span>
      )}
    </span>
  );
}
