"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { InputOTP } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/toast";
import { MedaLogo } from "./meda-logo";
import { cn } from "@/lib/cn";
import { beneficiaryActivate, beneficiaryStart, validateOtp } from "@/lib/api/auth";
import { MedaApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { isValidEmail } from "@/lib/utils/validators";

type Step = "email" | "otp" | "password" | "nip";

const STEPS: { key: Step; label: string }[] = [
  { key: "email", label: "Identidad" },
  { key: "otp", label: "Verificación" },
  { key: "password", label: "Contraseña" },
  { key: "nip", label: "NIP" },
];

export function ActivateView({ initialEmail = "" }: { initialEmail?: string }) {
  const router = useRouter();
  const { show } = useToast();
  const startPreAuth = useAuthStore((s) => s.startPreAuth);
  const completeAuth = useAuthStore((s) => s.completeAuth);

  const [step, setStep] = React.useState<Step>("email");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [email, setEmail] = React.useState(initialEmail);
  const [otp, setOtp] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPw, setConfirmPw] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [nip, setNip] = React.useState("");
  const [confirmNip, setConfirmNip] = React.useState("");

  const [info, setInfo] = React.useState<{ name: string; holderName: string; otpTarget: string } | null>(null);

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const startEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    setBusy(true);
    setError(null);
    try {
      const res = await beneficiaryStart(email);
      setInfo({ name: res.name, holderName: res.holderName, otpTarget: res.otpTarget });
      setStep("otp");
    } catch (err) {
      setError(err instanceof MedaApiError && err.message ? err.message : "No se pudo iniciar la activación.");
    } finally {
      setBusy(false);
    }
  };

  const confirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setBusy(true);
    setError(null);
    try {
      await validateOtp(otp);
      setStep("password");
    } catch (err) {
      setError(err instanceof MedaApiError && err.message ? err.message : "Código incorrecto.");
    } finally {
      setBusy(false);
    }
  };

  const pwMismatch = confirmPw.length > 0 && password !== confirmPw;
  const pwReady = password.length >= 8 && password === confirmPw;

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwReady) setStep("nip");
  };

  const nipMismatch = confirmNip.length === 6 && nip !== confirmNip;
  const nipReady = nip.length === 6 && nip === confirmNip;

  const finish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nipReady) return;
    setBusy(true);
    setError(null);
    try {
      const res = await beneficiaryActivate(email, password, nip);
      startPreAuth(
        { name: res.user.name, email: res.user.email, role: res.role, holderName: res.holderName },
        "",
      );
      completeAuth(res.accessToken);
      show("success", "¡Acceso activado! Bienvenido a Medá.");
      router.replace("/movimientos");
    } catch (err) {
      setError(err instanceof MedaApiError && err.message ? err.message : "No se pudo activar el acceso.");
      setBusy(false);
    }
  };

  const field = (hasError?: boolean) =>
    cn(
      "flex items-center gap-2 rounded-control border bg-bg px-3 h-12 transition-colors focus-within:ring-2 focus-within:ring-brand/50",
      hasError ? "border-error" : "border-border-default focus-within:border-brand",
    );

  return (
    <main className="flex min-h-screen flex-col bg-bg">
      <header className="flex items-center justify-between px-6 py-6 sm:px-12">
        <MedaLogo className="h-9" />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-start justify-center px-4 pb-16">
        <div className="meda-fade-in w-full max-w-md rounded-meda border border-border-default bg-surface p-8 shadow-sm">
          <div className="mb-5 flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-meda bg-brand/15">
              <HeartHandshake className="h-7 w-7 text-brand-dark" />
            </span>
          </div>

          {/* Progreso */}
          <div className="mb-2 flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i <= stepIndex ? "w-8 bg-brand" : "w-4 bg-border-default",
                )}
              />
            ))}
          </div>
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-wide text-fg-tertiary">
            Paso {stepIndex + 1} de {STEPS.length} · {STEPS[stepIndex].label}
          </p>

          {info && step !== "email" && (
            <div className="mb-5 rounded-control bg-muted px-4 py-2.5 text-center text-xs text-fg-secondary">
              Hola <span className="font-medium text-fg">{info.name}</span>, estás activando el
              acceso heredado de <span className="font-medium text-fg">{info.holderName}</span>.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-control border border-error bg-error/10 px-3 py-2 text-sm text-error-dark">
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={startEmail}>
              <h1 className="mb-1 text-center text-2xl font-semibold text-fg">Activa tu acceso</h1>
              <p className="mb-6 text-center text-sm text-fg-secondary">
                Te designaron como beneficiario. Ingresa tu correo para iniciar la activación de tu
                cuenta.
              </p>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fg">
                Correo electrónico
              </label>
              <div className={field()}>
                <input
                  id="email"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 bg-transparent text-sm text-fg outline-none"
                />
              </div>
              <Button type="submit" variant="primary" loading={busy} disabled={!isValidEmail(email)} className="mt-6 h-12 w-full">
                Continuar
              </Button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={confirmOtp} className="flex flex-col items-center">
              <h1 className="mb-1 text-center text-2xl font-semibold text-fg">Verifica tu correo</h1>
              <p className="mb-6 text-center text-sm text-fg-secondary">
                Enviamos un código a <span className="font-medium text-fg">{info?.otpTarget}</span>.
              </p>
              <InputOTP length={6} value={otp} onChange={setOtp} />
              <Button type="submit" variant="primary" loading={busy} disabled={otp.length !== 6} className="mt-6 h-12 w-full">
                Continuar
              </Button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={submitPassword}>
              <h1 className="mb-1 text-center text-2xl font-semibold text-fg">Crea tu contraseña</h1>
              <p className="mb-6 text-center text-sm text-fg-secondary">
                Usarás esta contraseña para iniciar sesión. Mínimo 8 caracteres.
              </p>
              <label className="mb-1.5 block text-sm font-medium text-fg">Contraseña</label>
              <div className={field()}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-fg outline-none"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)} className="text-fg-tertiary hover:text-fg" aria-label="Mostrar/ocultar">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <label className="mb-1.5 mt-4 block text-sm font-medium text-fg">Confirmar contraseña</label>
              <div className={field(pwMismatch)}>
                <input
                  type={showPw ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-fg outline-none"
                />
              </div>
              {pwMismatch && <p className="mt-1 text-xs text-error">Las contraseñas no coinciden.</p>}
              <Button type="submit" variant="primary" disabled={!pwReady} className="mt-6 h-12 w-full">
                Continuar
              </Button>
            </form>
          )}

          {step === "nip" && (
            <form onSubmit={finish} className="flex flex-col items-center">
              <h1 className="mb-1 text-center text-2xl font-semibold text-fg">Crea tu NIP</h1>
              <p className="mb-6 text-center text-sm text-fg-secondary">
                Un NIP de 6 dígitos para autorizar tus transacciones.
              </p>
              <div className="mb-4 w-full">
                <span className="mb-1.5 block text-sm font-medium text-fg">NIP</span>
                <InputOTP length={6} value={nip} onChange={setNip} />
              </div>
              <div className="w-full">
                <span className="mb-1.5 block text-sm font-medium text-fg">Confirmar NIP</span>
                <InputOTP length={6} value={confirmNip} onChange={setConfirmNip} error={nipMismatch} />
              </div>
              {nipMismatch && <p className="mt-2 self-start text-xs text-error">Los NIP no coinciden.</p>}
              <Button type="submit" variant="primary" loading={busy} disabled={!nipReady} className="mt-6 h-12 w-full">
                Activar mi acceso
              </Button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
