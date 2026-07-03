"use client";
import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Wraps page content with a fade/slide transition on route change.
 * Uses CSS animations (no heavy dependency). Place inside the layout, around {children}.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="meda-page-enter">
      {children}
    </div>
  );
}
