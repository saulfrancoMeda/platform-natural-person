"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { HeartHandshake, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { NipDialog } from "@/features/security/nip-dialog";
import { cn } from "@/lib/cn";
import { activateSuccession, revokeBeneficiary, saveBeneficiary } from "@/lib/api/profile";
import { resetDemo } from "@/lib/api/auth";
import { MedaApiError } from "@/lib/api/client";
import { useProfile } from "@/lib/hooks/use-profile";
import { useAuthStore } from "@/lib/stores/auth-store";
import { isValidEmail } from "@/lib/utils/validators";

const RELATIONSHIPS = ["Cónyuge", "Hijo(a)", "Padre/Madre", "Hermano(a)", "Otro"];

const schema = z.object({
  name: z.string().min(3, "Ingresa el nombre completo"),
  email: z.string().refine(isValidEmail, "Correo no válido"),
  relationship: z.string().min(1, "Selecciona el parentesco"),
});
type Values = z.infer<typeof schema>;

const input = (err?: boolean) =>
  cn(
    "h-11 w-full rounded-control border bg-bg px-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-brand/40",
    err ? "border-error" : "border-border-default focus:border-brand",
  );

export function BeneficiaryView() {
  const { data, isLoading } = useProfile();
  const role = useAuthStore((s) => s.user?.role);

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (role === "BENEFICIARY") return <EstateView holderName={data.profile.name} />;

  const active = data.beneficiary && data.beneficiary.status === "ACTIVE";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Beneficiario</h1>
        <p className="mt-1 text-sm text-fg-secondary">
          Designa a la persona que heredará tu cuenta. En caso de fallecimiento, tras activarse el
          protocolo de sucesión, tu beneficiario podrá acceder a los fondos.
        </p>
      </div>

      {active ? (
        <ActiveBeneficiary beneficiary={data.beneficiary!} />
      ) : (
        <RegisterBeneficiary />
      )}
    </div>
  );
}

function RegisterBeneficiary() {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    try {
      await saveBeneficiary({ ...values, percentage: 100 });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      show("success", "Beneficiario registrado correctamente.");
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo registrar.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-meda border border-border-default bg-surface p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-control bg-brand/12 text-brand-dark">
          <UserPlus className="h-4 w-4" />
        </span>
        <h2 className="text-sm font-semibold text-fg">Dar de alta beneficiario</h2>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-fg">Nombre completo</span>
        <input className={input(!!errors.name)} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-error">{errors.name.message}</p>}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">Correo electrónico</span>
          <input className={input(!!errors.email)} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">Parentesco</span>
          <select className={input(!!errors.relationship)} defaultValue="" {...register("relationship")}>
            <option value="" disabled>Selecciona…</option>
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.relationship && <p className="mt-1 text-xs text-error">{errors.relationship.message}</p>}
        </label>
      </div>
      <Button type="submit" variant="primary" loading={isSubmitting} className="h-11">
        <UserPlus className="mr-1.5 h-4 w-4" /> Registrar beneficiario
      </Button>
    </form>
  );
}

function ActiveBeneficiary({
  beneficiary,
}: {
  beneficiary: { name: string; email: string; relationship: string; percentage: number; registeredAt: string };
}) {
  const { show } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const [revoking, setRevoking] = React.useState(false);
  const [nipOpen, setNipOpen] = React.useState(false);
  const [successionConfirm, setSuccessionConfirm] = React.useState(false);
  const [working, setWorking] = React.useState(false);

  const revoke = async () => {
    setWorking(true);
    try {
      await revokeBeneficiary();
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      show("success", "Beneficiario dado de baja.");
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo dar de baja.");
    } finally {
      setWorking(false);
      setRevoking(false);
    }
  };

  const doSuccession = async (nip: string) => {
    setWorking(true);
    try {
      await activateSuccession(nip);
      setNipOpen(false);
      show("success", "Protocolo de sucesión activado.");
      // La cuenta del titular queda cerrada: se cierra la sesión.
      logout();
      router.replace("/login");
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo activar.");
      setWorking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-meda border border-border-default bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-control bg-brand/12 text-brand-dark">
            <HeartHandshake className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold text-fg">Beneficiario designado</h2>
          <span className="ml-auto rounded-full bg-success/12 px-2.5 py-0.5 text-xs font-medium text-success-dark">
            Activo
          </span>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <Row label="Nombre" value={beneficiary.name} />
          <Row label="Parentesco" value={beneficiary.relationship} />
          <Row label="Correo" value={beneficiary.email} />
          <Row label="Porcentaje" value={`${beneficiary.percentage}%`} />
        </dl>
        <Button variant="outline" className="mt-5" onClick={() => setRevoking(true)} loading={working}>
          <Trash2 className="mr-1.5 h-4 w-4" /> Dar de baja
        </Button>
      </div>

      {/* Protocolo de sucesión */}
      <div className="rounded-meda border border-error/30 bg-error/5 p-6">
        <div className="mb-2 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-error" />
          <h2 className="text-sm font-semibold text-fg">Protocolo de sucesión</h2>
        </div>
        <p className="text-sm text-fg-secondary">
          Al activarlo, la cuenta se cierra por fallecimiento del titular: tu acceso quedará
          bloqueado y <span className="font-medium text-fg">{beneficiary.name}</span> podrá ingresar
          para disponer de los fondos. Esta acción es irreversible desde tu sesión.
        </p>
        <Button variant="danger" className="mt-4" onClick={() => setSuccessionConfirm(true)}>
          Activar protocolo de sucesión
        </Button>
      </div>

      <ConfirmDialog
        open={successionConfirm}
        onClose={() => setSuccessionConfirm(false)}
        onConfirm={() => {
          setSuccessionConfirm(false);
          setNipOpen(true);
        }}
        title="Activar protocolo de sucesión"
        description="La cuenta del titular se cerrará y el beneficiario obtendrá el acceso. ¿Deseas continuar?"
        confirmLabel="Sí, activar"
        danger
      />
      <ConfirmDialog
        open={revoking}
        onClose={() => setRevoking(false)}
        onConfirm={revoke}
        title="Dar de baja al beneficiario"
        description="El beneficiario dejará de tener derecho a heredar la cuenta. Podrás registrar otro después."
        confirmLabel="Dar de baja"
        danger
      />
      <NipDialog
        open={nipOpen}
        title="Autoriza la sucesión con tu NIP"
        description="Ingresa tu NIP de 4 dígitos para activar el protocolo de sucesión."
        onClose={() => setNipOpen(false)}
        onValid={doSuccession}
      />
    </div>
  );
}

/** Vista para el beneficiario que ya heredó la cuenta. */
function EstateView({ holderName }: { holderName: string }) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [resetting, setResetting] = React.useState(false);

  const restore = async () => {
    setResetting(true);
    await resetDemo();
    logout();
    router.replace("/login");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Sucesión</h1>
        <p className="mt-1 text-sm text-fg-secondary">
          Accediste como beneficiario de <span className="font-medium text-fg">{holderName}</span>.
        </p>
      </div>
      <div className="rounded-meda border border-border-default bg-surface p-6">
        <div className="mb-2 flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-brand-dark" />
          <h2 className="text-sm font-semibold text-fg">Herencia recibida</h2>
        </div>
        <p className="text-sm text-fg-secondary">
          Los fondos y el historial de <span className="font-medium text-fg">{holderName}</span> están
          ahora bajo tu resguardo. Consulta el saldo y los movimientos en la sección{" "}
          <span className="font-medium text-fg">Movimientos</span>, y descarga los estados de cuenta.
        </p>
      </div>
      <button
        onClick={restore}
        disabled={resetting}
        className="text-xs text-fg-tertiary underline hover:text-fg-secondary"
      >
        Revertir sucesión y reiniciar la demostración
      </button>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-fg-tertiary">{label}</dt>
      <dd className="mt-0.5 font-medium text-fg">{value}</dd>
    </div>
  );
}
