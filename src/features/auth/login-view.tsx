"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MedaLogo } from "./meda-logo";
import { cn } from "@/lib/cn";
import { login, resetDemo } from "@/lib/api/auth";
import { MedaApiError } from "@/lib/api/client";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/lib/stores/auth-store";

const schema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Correo no válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
type LoginValues = z.infer<typeof schema>;

export function LoginView() {
  const router = useRouter();
  const { show } = useToast();
  const startPreAuth = useAuthStore((s) => s.startPreAuth);
  const [showPw, setShowPw] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const handleReset = async () => {
    try {
      await resetDemo();
      show("success", "Demo reiniciada. La cuenta del titular vuelve a estar activa.");
    } catch {
      show("error", "No se pudo reiniciar la demo.");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema), mode: "onChange" });

  const onSubmit = async (values: LoginValues) => {
    setServerError(null);
    try {
      const res = await login(values.email, values.password);
      startPreAuth(
        { name: res.user.name, email: res.user.email, role: res.role, holderName: res.holderName },
        res.otpTarget,
      );
      router.push("/verificar");
    } catch (err) {
      setServerError(
        err instanceof MedaApiError && err.message
          ? err.message
          : "No se pudo iniciar sesión. Inténtalo de nuevo.",
      );
    }
  };

  const fieldWrap = (hasError?: boolean) =>
    cn(
      "flex items-center gap-2 rounded-control border bg-bg px-3 h-12 transition-colors focus-within:ring-2 focus-within:ring-brand/50",
      hasError ? "border-error" : "border-border-default focus-within:border-brand",
    );

  return (
    <main className="grid min-h-screen bg-bg lg:grid-cols-2">
      {/* Columna izquierda: formulario */}
      <div className="relative flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <MedaLogo className="h-9" />
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center meda-fade-in">
          <h1 className="text-center text-3xl font-semibold text-fg">
            ¡Qué gusto tenerte aquí!
          </h1>
          <p className="mt-2 mb-8 text-center text-sm text-fg-secondary">
            Ingresa tu correo y contraseña para acceder.
          </p>

          {serverError && (
            <div className="mb-4 rounded-control border border-error bg-error/10 px-3 py-2 text-sm text-error-dark">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fg">
                Correo electrónico
              </label>
              <div className={fieldWrap(!!errors.email)}>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  autoFocus
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 bg-transparent text-sm text-fg outline-none"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-fg">
                Contraseña
              </label>
              <div className={fieldWrap(!!errors.password)}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm text-fg outline-none"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="shrink-0 text-fg-tertiary hover:text-fg"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-error">{errors.password.message}</p>
              )}
            </div>

            <a href="#" className="text-sm font-medium text-brand-dark hover:underline">
              ¿Olvidaste tu contraseña?
            </a>

            <Button type="submit" variant="primary" loading={isSubmitting} className="mt-2 h-12 w-full">
              Continuar
            </Button>
          </form>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-fg-tertiary underline hover:text-fg-secondary"
          >
            Reiniciar demo de sucesión
          </button>
        </div>
      </div>

      {/* Columna derecha: panel de marca (persona física) */}
      <aside className="relative hidden overflow-hidden bg-[#0B0E11] lg:flex lg:items-center lg:justify-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(135deg, transparent 46%, #FCD535 46%, #FCD535 54%, transparent 54%)",
            backgroundSize: "80px 80px",
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col items-center px-12 text-center">
          <MedaLogo className="mb-10 h-10 text-white" />
          <h2 className="max-w-md text-4xl font-semibold leading-tight text-white">
            Simplifica tus finanzas{" "}
            <span className="text-brand">personales</span> con Medá
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Envía y recibe SPEI, consulta tus movimientos y descarga tus estados
            de cuenta desde un solo lugar.
          </p>
        </div>
      </aside>
    </main>
  );
}
