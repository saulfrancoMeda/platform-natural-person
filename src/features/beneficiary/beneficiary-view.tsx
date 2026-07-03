"use client";
import * as React from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, HeartHandshake, Pencil, Trash2, UserPlus } from "lucide-react";
import { DetailModal } from "@/components/ui/detail-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { NipDialog } from "@/features/security/nip-dialog";
import { cn } from "@/lib/cn";
import { revokeBeneficiary, saveBeneficiary, updateBeneficiary, type Beneficiary } from "@/lib/api/profile";
import { MedaApiError } from "@/lib/api/client";
import { useProfile } from "@/lib/hooks/use-profile";
import { isValidEmail } from "@/lib/utils/validators";

const RELATIONSHIPS = ["Cónyuge", "Hijo(a)", "Padre/Madre", "Hermano(a)", "Otro"];

const input = (err?: boolean) =>
  cn(
    "h-11 w-full rounded-control border bg-bg px-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-brand/40",
    err ? "border-error" : "border-border-default focus:border-brand",
  );

export function BeneficiaryView() {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useProfile();
  const [form, setForm] = React.useState<{ mode: "add" } | { mode: "edit"; b: Beneficiary } | null>(null);
  const [toRevoke, setToRevoke] = React.useState<Beneficiary | null>(null);

  const revoke = async () => {
    if (!toRevoke) return;
    try {
      await revokeBeneficiary(toRevoke.id);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      show("success", "Beneficiario dado de baja.");
      setToRevoke(null);
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo dar de baja.");
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const beneficiaries = data.beneficiaries;
  const usedPct = beneficiaries.reduce((s, b) => s + b.percentage, 0);
  const available = 100 - usedPct;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/perfil" className="mb-3 inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> Perfil
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-fg">Beneficiarios</h1>
            <p className="mt-1 text-sm text-fg-secondary">
              Designa a quién heredará tu cuenta. Puedes registrar más de uno y repartir el porcentaje.
            </p>
          </div>
          {beneficiaries.length > 0 && (
            <Button variant="primary" onClick={() => setForm({ mode: "add" })} disabled={available <= 0}>
              <UserPlus className="mr-1.5 h-4 w-4" /> Agregar
            </Button>
          )}
        </div>
      </div>

      {beneficiaries.length > 0 && (
        <div className="flex items-center justify-between rounded-meda border border-border-default bg-surface px-4 py-3 text-sm">
          <span className="text-fg-secondary">Porcentaje asignado</span>
          <span className={cn("font-semibold", usedPct > 100 ? "text-error" : "text-fg")}>
            {usedPct}% · disponible {available}%
          </span>
        </div>
      )}

      {beneficiaries.length === 0 ? (
        <div className="rounded-meda border border-dashed border-border-strong bg-surface p-8 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/12 text-brand-dark">
            <HeartHandshake className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-fg">Aún no tienes beneficiarios</p>
          <p className="mt-1 text-sm text-fg-secondary">Registra a quién heredará tu cuenta.</p>
          <Button variant="primary" className="mt-4" onClick={() => setForm({ mode: "add" })}>
            <UserPlus className="mr-1.5 h-4 w-4" /> Dar de alta beneficiario
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {beneficiaries.map((b) => (
            <div key={b.id} className="rounded-meda border border-border-default bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/12 text-sm font-semibold text-brand-dark">
                    {b.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">{b.name}</p>
                    <p className="text-xs text-fg-secondary">{b.relationship} · {b.email}</p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                    b.activated ? "bg-info/12 text-info" : "bg-success/12 text-success-dark",
                  )}
                >
                  {b.activated ? "Acceso activado" : "Activo"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-fg-secondary">
                  Hereda <span className="font-semibold text-fg">{b.percentage}%</span>
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setForm({ mode: "edit", b })}>
                    <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setToRevoke(b)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Baja
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <BeneficiaryFormModal
          form={form}
          available={form.mode === "edit" ? available + form.b.percentage : available}
          onClose={() => setForm(null)}
        />
      )}

      <NipDialog
        open={!!toRevoke}
        title="Autoriza la baja con tu código"
        description={`${toRevoke?.name ?? "El beneficiario"} dejará de tener derecho a heredar la cuenta. Ingresa el código que enviamos a tu correo para confirmar.`}
        onClose={() => setToRevoke(null)}
        onValid={revoke}
      />
    </div>
  );
}

function BeneficiaryFormModal({
  form,
  available,
  onClose,
}: {
  form: { mode: "add" } | { mode: "edit"; b: Beneficiary };
  available: number;
  onClose: () => void;
}) {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const editing = form.mode === "edit" ? form.b : null;
  const [name, setName] = React.useState(editing?.name ?? "");
  const [email, setEmail] = React.useState(editing?.email ?? "");
  const [relationship, setRelationship] = React.useState(editing?.relationship ?? "");
  const [percentage, setPercentage] = React.useState(String(editing?.percentage ?? available));
  const [nipOpen, setNipOpen] = React.useState(false);

  const pct = Number(percentage);
  const pctError = !Number.isFinite(pct) || pct <= 0 || pct > available;
  const valid = name.trim().length >= 3 && isValidEmail(email) && !!relationship && !pctError;

  const authorize = async () => {
    try {
      if (editing) {
        await updateBeneficiary(editing.id, { name, email, relationship, percentage: pct });
        show("success", "Beneficiario actualizado.");
      } else {
        await saveBeneficiary({ name, email, relationship, percentage: pct });
        show("success", "Beneficiario registrado.");
      }
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      onClose();
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo guardar.");
    }
  };

  return (
    <DetailModal
      open
      onClose={onClose}
      title={editing ? "Editar beneficiario" : "Dar de alta beneficiario"}
      icon={<HeartHandshake className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">Nombre completo</span>
          <input className={input()} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre completo" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">Correo electrónico</span>
          <input className={input()} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-fg">Parentesco</span>
            <select className={input()} value={relationship} onChange={(e) => setRelationship(e.target.value)}>
              <option value="" disabled>Selecciona…</option>
              {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-fg">Porcentaje (máx. {available}%)</span>
            <input type="number" min="1" max={available} className={input(pctError && percentage !== "")} value={percentage} onChange={(e) => setPercentage(e.target.value)} />
          </label>
        </div>
        <Button variant="primary" className="h-11 w-full" disabled={!valid} onClick={() => setNipOpen(true)}>
          Continuar
        </Button>
      </div>

      <NipDialog
        open={nipOpen}
        title="Autoriza con tu código"
        description={
          editing
            ? "Ingresa el código que enviamos a tu correo para guardar los cambios del beneficiario."
            : "Ingresa el código que enviamos a tu correo para dar de alta al beneficiario."
        }
        onClose={() => setNipOpen(false)}
        onValid={authorize}
      />
    </DetailModal>
  );
}
