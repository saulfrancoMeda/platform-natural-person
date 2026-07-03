"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/stores/auth-store";

// Umbral de inactividad (5 minutos) — cumplimiento IFPE.
const SESSION_TIMEOUT_MS = 5 * 60 * 1000;
const STORAGE_KEY = "meda-pf-last-activity";
const ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

/**
 * Cierra la sesión tras 5 minutos de inactividad. Sincroniza entre pestañas (storage event)
 * y revisa al volver el foco a la pestaña. Renderiza null; solo corre estando autenticado.
 */
export function SessionTimeout() {
  const router = useRouter();
  const { show } = useToast();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastResetRef = React.useRef(0);
  const resetRef = React.useRef<(isSync?: boolean) => void>(() => {});

  const doLogout = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    logout();
    show("info", "Cerramos tu sesión por inactividad. Vuelve a iniciar sesión.");
    router.replace("/login");
  }, [logout, router, show]);

  const resetTimer = React.useCallback(
    (isSync = false) => {
      const now = Date.now();
      if (!isSync && now - lastResetRef.current < 1000) return;
      lastResetRef.current = now;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!isSync) localStorage.setItem(STORAGE_KEY, String(now));

      timerRef.current = setTimeout(() => {
        const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
        const elapsed = Date.now() - last;
        if (elapsed >= SESSION_TIMEOUT_MS) doLogout();
        else resetRef.current(true);
      }, SESSION_TIMEOUT_MS);
    },
    [doLogout],
  );

  React.useEffect(() => {
    resetRef.current = resetTimer;
  }, [resetTimer]);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    resetTimer();

    const onActivity = () => resetTimer();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) resetTimer(true);
    };
    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      const last = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
      if (Date.now() - last >= SESSION_TIMEOUT_MS) doLogout();
      else resetTimer(true);
    };

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, onActivity));
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [isAuthenticated, resetTimer, doLogout]);

  return null;
}
