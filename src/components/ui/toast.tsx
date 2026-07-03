"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

type ToastType = "success" | "error" | "info" | "warning";
interface ToastAction { label: string; onClick: () => void; }
interface Toast { id: string; type: ToastType; message: string; action?: ToastAction; }
interface ShowOptions { action?: ToastAction; duration?: number; }

const ToastCtx = React.createContext<{ show: (t: ToastType, m: string, o?: ShowOptions) => void } | null>(null);
export const useToast = () => {
  const c = React.useContext(ToastCtx);
  if (!c) throw new Error("useToast must be used within ToastProvider");
  return c;
};

// Binance-style: a single colored dot per status, clean surface, subtle. No heavy borders.
const dot: Record<ToastType, string> = {
  success: "bg-success",
  error: "bg-error",
  info: "bg-info",
  warning: "bg-warning",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const remove = React.useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = React.useCallback((type: ToastType, message: string, o?: ShowOptions) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message, action: o?.action }]);
    setTimeout(() => remove(id), o?.duration ?? 5000);
  }, [remove]);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[340px]" role="region" aria-label="Notifications">
        {toasts.map((t) => (
          <div key={t.id} role="alert"
            className="meda-pop flex items-center gap-3 rounded-meda bg-surface px-4 py-3 shadow-lg ring-1 ring-border-default">
            <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dot[t.type])} aria-hidden />
            <p className="flex-1 text-sm text-fg leading-snug">{t.message}</p>
            {t.action && (
              <button onClick={() => { t.action!.onClick(); remove(t.id); }}
                className="shrink-0 text-xs font-semibold text-brand-dark hover:text-brand">{t.action.label}</button>
            )}
            <button onClick={() => remove(t.id)} aria-label="Dismiss"
              className="shrink-0 text-fg-tertiary hover:text-fg text-lg leading-none">×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
