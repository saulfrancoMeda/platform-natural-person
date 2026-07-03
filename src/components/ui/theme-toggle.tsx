"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

/** Toggles light/dark by adding/removing `.dark` on <html>. Persists in localStorage. */
export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem("meda-theme");
    const isDark = stored ? stored === "dark" : document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("meda-theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-meda border border-border-default",
        "bg-surface text-fg transition-colors hover:bg-muted",
        className
      )}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
