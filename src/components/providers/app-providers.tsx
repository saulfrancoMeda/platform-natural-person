"use client";
import * as React from "react";
import { MSWProvider } from "./msw-provider";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "@/components/ui/toast";

/** Providers de cliente que envuelven toda la app: MSW → Query → Toasts. */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <QueryProvider>
        <ToastProvider>{children}</ToastProvider>
      </QueryProvider>
    </MSWProvider>
  );
}
