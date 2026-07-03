"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { MedaLogo } from "./meda-logo";

const schema = z.object({
  username: z.string().min(1, "Ingresa tu usuario"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
type LoginValues = z.infer<typeof schema>;

interface LoginFormProps {
  onSubmit: (values: LoginValues) => Promise<void> | void;
  /** Server-side error (e.g. invalid credentials). */
  error?: string;
  title?: string;
  subtitle?: string;
  /** Label for the identifier field. Default "Usuario". Use "Correo" for email login. */
  usernameLabel?: string;
  footer?: React.ReactNode;
}

/**
 * Login card: identifier + password with leading icons, password visibility toggle, validation,
 * loading state. Reusable across MEDA apps (admin, API docs, etc.). Pass your own onSubmit.
 */
export function LoginForm({ onSubmit, error, title = "Iniciar sesión", subtitle = "Accede a tu cuenta MEDA", usernameLabel = "Usuario", footer }: LoginFormProps) {
  const [showPw, setShowPw] = React.useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({ resolver: zodResolver(schema) });

  const fieldWrap = (hasError?: boolean) =>
    cn("flex items-center gap-2 rounded-control border bg-bg px-3 h-11 transition-colors focus-within:ring-2 focus-within:ring-brand/50",
      hasError ? "border-error" : "border-border-default focus-within:border-brand");

  return (
    <div className="meda-fade-in mx-auto w-full max-w-sm rounded-meda border border-border-default bg-surface p-8 shadow-sm">
      <div className="mb-6 flex justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-meda bg-brand/15"><MedaLogo className="h-7" /></span>
      </div>
      <h1 className="mb-1 text-center text-2xl font-semibold text-fg">{title}</h1>
      <p className="mb-6 text-center text-sm text-fg-secondary">{subtitle}</p>

      {error && <div className="mb-4 rounded-control border border-error bg-error/10 px-3 py-2 text-sm text-error-dark">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-fg">{usernameLabel}</label>
          <div className={fieldWrap(!!errors.username)}>
            <User className="h-4 w-4 shrink-0 text-fg-tertiary" />
            <input id="username" autoComplete="username" placeholder={usernameLabel}
              className="flex-1 bg-transparent text-sm text-fg outline-none" {...register("username")} />
          </div>
          {errors.username && <p className="mt-1 text-xs text-error">{errors.username.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-fg">Contraseña</label>
          <div className={fieldWrap(!!errors.password)}>
            <Lock className="h-4 w-4 shrink-0 text-fg-tertiary" />
            <input id="password" type={showPw ? "text" : "password"} autoComplete="current-password" placeholder="••••••••"
              className="flex-1 bg-transparent text-sm text-fg outline-none" {...register("password")} />
            <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Ocultar" : "Mostrar"}
              className="shrink-0 text-fg-tertiary hover:text-fg">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
        </div>

        <Button type="submit" variant="primary" loading={isSubmitting} className="mt-2 h-11 w-full">Iniciar sesión</Button>
      </form>

      {footer && <div className="mt-6 text-center text-xs text-fg-tertiary">{footer}</div>}
    </div>
  );
}
