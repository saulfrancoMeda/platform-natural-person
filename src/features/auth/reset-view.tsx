"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { MedaLogo } from "./meda-logo";
import { resetDemo } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth-store";

/** Restablece el estado de la cuenta (revierte sucesión, beneficiario y datos) y vuelve al login. */
export function ResetView() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    resetDemo()
      .catch(() => {})
      .finally(() => {
        if (!active) return;
        logout();
        setDone(true);
        setTimeout(() => router.replace("/login"), 1200);
      });
    return () => {
      active = false;
    };
  }, [logout, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <MedaLogo className="h-9" />
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/15">
        <RotateCcw className={done ? "h-6 w-6 text-brand-dark" : "h-6 w-6 animate-spin text-brand-dark"} />
      </span>
      <p className="text-fg">
        {done ? "Cuenta restablecida. Redirigiendo al inicio de sesión…" : "Restableciendo la cuenta…"}
      </p>
    </main>
  );
}
