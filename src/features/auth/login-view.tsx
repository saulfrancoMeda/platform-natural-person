"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, MapPin, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MedaLogo } from "./meda-logo";
import { cn } from "@/lib/cn";
import { login } from "@/lib/api/auth";
import { MedaApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useGeolocation, type GeoState } from "@/lib/hooks/use-geolocation";

const schema = z.object({
  email: z.string().min(1, "Ingresa tu correo").email("Correo no válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
type LoginValues = z.infer<typeof schema>;

export function LoginView() {
  const router = useRouter();
  const startPreAuth = useAuthStore((s) => s.startPreAuth);
  const geo = useGeolocation();
  const geoReady = geo.status === "granted";
  const [showPw, setShowPw] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showVerified, setShowVerified] = React.useState(false);
  const geoHadIssue = React.useRef(false);

  // Muestra "Ubicación verificada" SOLO cuando hay un cambio (se habilitó tras estar
  // bloqueada/no disponible) y luego desaparece en segundos. Si ya estaba habilitada, no sale.
  React.useEffect(() => {
    if (geo.status === "denied" || geo.status === "unavailable") {
      geoHadIssue.current = true;
      return;
    }
    if (geo.status === "granted" && geoHadIssue.current) {
      geoHadIssue.current = false;
      setShowVerified(true);
      const t = setTimeout(() => setShowVerified(false), 3500);
      return () => clearTimeout(t);
    }
  }, [geo.status]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(schema), mode: "onChange" });

  const onSubmit = async (values: LoginValues) => {
    if (!geoReady) return;
    setServerError(null);
    try {
      const res = await login(values.email, values.password);
      startPreAuth(
        { name: res.user.name, email: res.user.email, role: res.role, holderName: res.holderName },
        res.otpTarget,
      );
      router.push("/verificar");
    } catch (err) {
      // Beneficiario sin activar → llévalo al proceso de activación.
      if (err instanceof MedaApiError && err.code === "AUTH_BENEF_ACTIVATE") {
        router.push(`/activar?email=${encodeURIComponent(values.email)}`);
        return;
      }
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
      {/* Aviso transitorio de ubicación verificada (parte superior) */}
      {showVerified && (
        <div className="meda-pop fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-meda border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success-dark shadow-lg">
          <MapPin className="h-4 w-4" /> Ubicación verificada
        </div>
      )}

      {/* Columna izquierda: formulario */}
      <div className="relative flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <MedaLogo className="h-9" />
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center meda-fade-in">
          {/* Requisito de ubicación (arriba del nombre) */}
          {!geoReady && (
            <div className="mb-6">
              <GeoPrompt geo={geo} />
            </div>
          )}

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

            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={!geoReady}
              className="mt-2 h-12 w-full"
            >
              {geoReady ? "Continuar" : "Activa tu ubicación para continuar"}
            </Button>
          </form>
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

/** Requisito de geolocalización para acceder (regulatorio). Solo estados sin conceder. */
function GeoPrompt({ geo }: { geo: GeoState }) {
  if (geo.status === "granted") return null;

  if (geo.status === "checking") {
    return (
      <div className="flex items-center gap-2 rounded-control border border-border-default bg-muted px-3 py-2 text-sm text-fg-secondary">
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-border-strong border-t-brand" />
        Verificando tu ubicación…
      </div>
    );
  }

  const denied = geo.status === "denied";
  const unavailable = geo.status === "unavailable";
  return (
    <div className="rounded-control border border-warning/40 bg-warning/10 p-3">
      <div className="flex items-start gap-2.5">
        <MapPinOff className="mt-0.5 h-5 w-5 shrink-0 text-warning-dark" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-fg">Necesitamos tu ubicación</p>
          <p className="mt-0.5 text-xs text-fg-secondary">
            {denied
              ? "Bloqueaste el permiso de ubicación. Actívalo en el navegador (icono junto a la URL) y reintenta."
              : unavailable
                ? "No pudimos obtener tu ubicación. Activa los Servicios de ubicación del sistema (en Mac: Ajustes → Privacidad y seguridad → Localización, y habilita tu navegador) y reintenta."
                : "Por seguridad y por regulación, verificamos tu ubicación al iniciar sesión."}
          </p>
        </div>
      </div>
      <Button type="button" variant="outline" onClick={geo.request} className="mt-3 h-10 w-full">
        {denied || unavailable ? "Reintentar" : "Permitir ubicación"}
      </Button>
    </div>
  );
}
