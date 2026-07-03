"use client";
import * as React from "react";
import Link from "next/link";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MedaLogo } from "./meda-logo";
import { cn } from "@/lib/cn";
import { requestSuccession, type SuccessionRequestResult } from "@/lib/api/profile";
import { MedaApiError } from "@/lib/api/client";
import { isValidEmail } from "@/lib/utils/validators";

/** Flujo externo de sucesión por URL: reporta el fallecimiento del titular por correo. */
export function SuccessionView({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = React.useState(initialEmail);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<SuccessionRequestResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    setBusy(true);
    setError(null);
    try {
      setResult(await requestSuccession(email));
    } catch (err) {
      setError(err instanceof MedaApiError && err.message ? err.message : "No se pudo procesar la solicitud.");
    } finally {
      setBusy(false);
    }
  };

  const field = cn(
    "flex items-center gap-2 rounded-control border bg-bg px-3 h-12 transition-colors focus-within:ring-2 focus-within:ring-brand/50",
    error ? "border-error" : "border-border-default focus-within:border-brand",
  );

  return (
    <main className="flex min-h-screen flex-col bg-bg">
      <header className="flex items-center justify-between px-6 py-6 sm:px-12">
        <MedaLogo className="h-9" />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="meda-fade-in w-full max-w-md rounded-meda border border-border-default bg-surface p-8 shadow-sm">
          {result ? (
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/12">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </span>
              <h1 className="text-2xl font-semibold text-fg">Protocolo de sucesión activado</h1>
              <p className="mt-2 text-sm text-fg-secondary">
                La cuenta de <span className="font-medium text-fg">{result.holderName}</span> quedó
                cerrada. {result.beneficiaries.length > 1 ? "Los beneficiarios designados" : "El beneficiario designado"} ya {result.beneficiaries.length > 1 ? "pueden" : "puede"} activar su acceso a los fondos.
              </p>
              <div className="mt-5 w-full space-y-2">
                {result.beneficiaries.map((b) => (
                  <Link
                    key={b.email}
                    href={`/activar?email=${encodeURIComponent(b.email)}`}
                    className="flex items-center justify-between gap-3 rounded-control border border-border-default bg-surface px-4 py-3 text-left transition-colors hover:border-brand"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-fg">{b.name}</span>
                      <span className="block truncate text-xs text-fg-secondary">{b.email}</span>
                    </span>
                    <span className="shrink-0 text-xs font-medium text-brand-dark">Activar →</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="mb-5 flex justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-meda bg-error/10">
                  <ShieldAlert className="h-7 w-7 text-error" />
                </span>
              </div>
              <h1 className="mb-1 text-center text-2xl font-semibold text-fg">Protocolo de sucesión</h1>
              <p className="mb-6 text-center text-sm text-fg-secondary">
                Reporta el fallecimiento del titular. Ingresa el correo de la cuenta; validaremos que
                exista un beneficiario designado y habilitaremos su acceso.
              </p>

              {error && (
                <div className="mb-4 rounded-control border border-error bg-error/10 px-3 py-2 text-sm text-error-dark">
                  {error}
                </div>
              )}

              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fg">
                Correo del titular
              </label>
              <div className={field}>
                <input
                  id="email"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="titular@ejemplo.com"
                  className="flex-1 bg-transparent text-sm text-fg outline-none"
                />
              </div>

              <Button type="submit" variant="danger" loading={busy} disabled={!isValidEmail(email)} className="mt-6 h-12 w-full">
                Activar protocolo de sucesión
              </Button>
              <Link href="/login" className="mt-4 block text-center text-sm text-fg-secondary hover:text-fg">
                Volver al inicio de sesión
              </Link>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
