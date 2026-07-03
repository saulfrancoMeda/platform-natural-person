"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { InputOTP } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/toast";
import { MedaLogo } from "./meda-logo";
import { requestOtp, validateOtp } from "@/lib/api/auth";
import { MedaApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";

const RESEND_SECONDS = 60;

export function OtpView() {
  const router = useRouter();
  const { show } = useToast();
  const preAuth = useAuthStore((s) => s.preAuth);
  const otpTarget = useAuthStore((s) => s.otpTarget);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const completeAuth = useAuthStore((s) => s.completeAuth);
  const logout = useAuthStore((s) => s.logout);

  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [seconds, setSeconds] = React.useState(RESEND_SECONDS);

  // Sin credenciales validadas (y sin sesión ya iniciada) no hay OTP: de vuelta al login.
  React.useEffect(() => {
    if (!preAuth && !isAuthenticated) router.replace("/login");
  }, [preAuth, isAuthenticated, router]);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6 || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const res = await validateOtp(code);
      completeAuth(res.accessToken);
      show("success", "Código confirmado. Bienvenido a Medá.");
      router.replace("/movimientos");
    } catch (err) {
      setError(true);
      show(
        "error",
        err instanceof MedaApiError && err.message
          ? err.message
          : "No se pudo validar el código.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    if (seconds > 0) return;
    try {
      await requestOtp();
      setSeconds(RESEND_SECONDS);
      setCode("");
      show("success", "Código reenviado a tu correo electrónico.");
    } catch {
      show("error", "No se pudo reenviar el código.");
    }
  };

  const onCancel = () => {
    logout();
    router.replace("/login");
  };

  return (
    <main className="flex min-h-screen flex-col bg-bg">
      <header className="flex items-center justify-between px-6 py-6 sm:px-12">
        <MedaLogo className="h-9" />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="meda-fade-in w-full max-w-md rounded-meda border border-border-default bg-surface p-8 shadow-sm">
          <div className="mb-6 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-meda bg-brand/15">
              <ShieldCheck className="h-7 w-7 text-brand-dark" />
            </span>
          </div>

          <h1 className="mb-1 text-center text-2xl font-semibold text-fg">
            Verifica tu identidad
          </h1>
          <p className="mb-6 text-center text-sm text-fg-secondary">
            Enviamos un código de verificación por correo electrónico a{" "}
            <span className="font-medium text-fg">{otpTarget ?? "tu correo"}</span>. Escríbelo aquí.
          </p>

          <form onSubmit={onSubmit} className="flex flex-col items-center gap-5">
            <InputOTP length={6} value={code} onChange={setCode} error={error} />

            <p className="text-xs text-fg-tertiary">El código es válido por 10 minutos.</p>

            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={code.length !== 6}
              className="h-11 w-full"
            >
              Continuar
            </Button>

            <div className="flex w-full items-center justify-between text-sm">
              <button
                type="button"
                onClick={onCancel}
                className="text-fg-secondary hover:text-fg"
              >
                Cancelar
              </button>
              {seconds > 0 ? (
                <span className="text-fg-tertiary">Reenviar en {seconds}s</span>
              ) : (
                <button
                  type="button"
                  onClick={onResend}
                  className="font-medium text-brand-dark hover:underline"
                >
                  Reenviar código
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
