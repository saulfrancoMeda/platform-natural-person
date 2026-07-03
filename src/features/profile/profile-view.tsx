"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, Check, ChevronRight, Copy, HeartHandshake, KeyRound, Mail, Phone } from "lucide-react";
import { DetailModal } from "@/components/ui/detail-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { InputOTP } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/toast";
import { NipDialog } from "@/features/security/nip-dialog";
import { cn } from "@/lib/cn";
import { changeNip } from "@/lib/api/auth";
import { updateProfile } from "@/lib/api/profile";
import { MedaApiError } from "@/lib/api/client";
import { useProfile } from "@/lib/hooks/use-profile";
import { isValidEmail, isValidPhoneMX } from "@/lib/utils/validators";

type Modal = null | "email" | "phone" | "nip";

export function ProfileView() {
  const router = useRouter();
  const { data, isLoading } = useProfile();
  const [modal, setModal] = React.useState<Modal>(null);

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const p = data.profile;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Mi perfil</h1>
        <p className="mt-1 text-sm text-fg-secondary">Consulta y actualiza tu información.</p>
      </div>

      {/* Identidad */}
      <section className="flex items-center gap-4 rounded-meda border border-border-default bg-surface p-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-xl font-semibold text-brand-foreground">
          {p.name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()}
        </span>
        <div>
          <p className="text-lg font-semibold text-fg">{p.name}</p>
          <p className="text-sm text-fg-secondary">{p.email}</p>
        </div>
      </section>

      {/* Información personal (solo lectura) */}
      <SectionCard title="Información personal">
        <InfoRow label="Correo" value={p.email} />
        <InfoRow label="Teléfono" value={p.phone} mono />
        <InfoRow label="RFC" value={p.rfc} mono />
        <InfoRow label="CURP" value={p.curp} mono />
        <InfoRow label="CLABE" value={p.clabe} mono copy />
      </SectionCard>

      {/* Acciones de cambio */}
      <SectionCard title="Seguridad y datos de acceso">
        <ActionRow
          icon={<Mail className="h-5 w-5" />}
          title="Cambiar mi correo"
          subtitle="Usas este correo para recibir la información de tu cuenta"
          onClick={() => setModal("email")}
        />
        <ActionRow
          icon={<Phone className="h-5 w-5" />}
          title="Cambiar mi teléfono"
          subtitle="Usas este número para recibir tus códigos de acceso"
          onClick={() => setModal("phone")}
        />
      </SectionCard>

      {/* Cuenta */}
      <SectionCard title="Cuenta">
        <ActionRow
          icon={<HeartHandshake className="h-5 w-5" />}
          title="Beneficiario"
          subtitle="Designa quién heredará tu cuenta"
          onClick={() => router.push("/beneficiario")}
        />
        <ActionRow
          icon={<Ban className="h-5 w-5" />}
          title="Cancelar cuenta"
          subtitle="Cierra tu cuenta y dispersa tu saldo"
          onClick={() => router.push("/cancelar")}
          danger
          last
        />
      </SectionCard>

      <ChangeEmailModal open={modal === "email"} current={p.email} onClose={() => setModal(null)} />
      <ChangePhoneModal open={modal === "phone"} current={p.phone} onClose={() => setModal(null)} />
      <ChangeNipModal open={modal === "nip"} onClose={() => setModal(null)} />
    </div>
  );
}

/* ---------- Layout helpers ---------- */

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wide text-fg-tertiary">
        {title}
      </p>
      <div className="rounded-meda border border-border-default bg-surface px-5">{children}</div>
    </section>
  );
}

function InfoRow({ label, value, mono, copy }: { label: string; value: string; mono?: boolean; copy?: boolean }) {
  const [copied, setCopied] = React.useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border-default py-3.5 last:border-0">
      <span className="text-sm text-fg-secondary">{label}</span>
      <span className="flex items-center gap-2">
        <span className={cn("text-sm text-fg", mono && "font-mono")}>{value}</span>
        {copy && (
          <button onClick={onCopy} aria-label="Copiar" className="text-fg-tertiary hover:text-fg">
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
      </span>
    </div>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  onClick,
  last,
  danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  last?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 py-4 text-left transition-colors hover:opacity-80",
        !last && "border-b border-border-default",
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          danger ? "bg-error/10 text-error" : "bg-brand/12 text-brand-dark",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm font-semibold", danger ? "text-error" : "text-fg")}>{title}</span>
        <span className="block text-xs text-fg-secondary">{subtitle}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-fg-tertiary" />
    </button>
  );
}

const input = (err?: boolean) =>
  cn(
    "h-11 w-full rounded-control border bg-bg px-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-brand/40",
    err ? "border-error" : "border-border-default focus:border-brand",
  );

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
    </label>
  );
}

/* ---------- Cambiar correo (autoriza con NIP) ---------- */

function ChangeEmailModal({ open, current, onClose }: { open: boolean; current: string; onClose: () => void }) {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [nipOpen, setNipOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setEmail("");
      setConfirm("");
      setNipOpen(false);
    }
  }, [open]);

  const mismatch = confirm.length > 0 && email !== confirm;
  const valid = isValidEmail(email) && email === confirm && email !== current;

  const authorize = async () => {
    try {
      await updateProfile({ email });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      show("success", "Tu correo se actualizó correctamente.");
      onClose();
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo actualizar.");
    }
  };

  return (
    <DetailModal open={open} onClose={onClose} title="Cambiar mi correo" icon={<Mail className="h-5 w-5" />}>
      <div className="space-y-4">
        <Field label="Nuevo correo">
          <input className={input()} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@ejemplo.com" />
        </Field>
        <Field label="Confirmar correo">
          <input className={input(mismatch)} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="correo@ejemplo.com" />
        </Field>
        {mismatch && <p className="text-xs text-error">Los correos no coinciden.</p>}
        <Button variant="primary" className="h-11 w-full" disabled={!valid} onClick={() => setNipOpen(true)}>
          Continuar
        </Button>
      </div>
      <NipDialog
        open={nipOpen}
        description="Ingresa el código que enviamos a tu correo para autorizar el cambio de correo."
        onClose={() => setNipOpen(false)}
        onValid={authorize}
      />
    </DetailModal>
  );
}

/* ---------- Cambiar teléfono (autoriza con NIP) ---------- */

function ChangePhoneModal({ open, current, onClose }: { open: boolean; current: string; onClose: () => void }) {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const [phone, setPhone] = React.useState("");
  const [nipOpen, setNipOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setPhone("");
      setNipOpen(false);
    }
  }, [open]);

  const valid = isValidPhoneMX(phone) && phone !== current;

  const authorize = async () => {
    try {
      await updateProfile({ phone });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      show("success", "Tu teléfono se actualizó correctamente.");
      onClose();
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo actualizar.");
    }
  };

  return (
    <DetailModal open={open} onClose={onClose} title="Cambiar mi teléfono" icon={<Phone className="h-5 w-5" />}>
      <div className="space-y-4">
        <Field label="Nuevo número (10 dígitos)">
          <input
            className={input()}
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="10 dígitos"
          />
        </Field>
        <Button variant="primary" className="h-11 w-full" disabled={!valid} onClick={() => setNipOpen(true)}>
          Continuar
        </Button>
      </div>
      <NipDialog
        open={nipOpen}
        description="Ingresa el código que enviamos a tu correo para autorizar el cambio de número."
        onClose={() => setNipOpen(false)}
        onValid={authorize}
      />
    </DetailModal>
  );
}

/* ---------- Cambiar NIP (NIP actual autoriza) ---------- */

function ChangeNipModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { show } = useToast();
  const [currentNip, setCurrentNip] = React.useState("");
  const [newNip, setNewNip] = React.useState("");
  const [confirmNip, setConfirmNip] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setCurrentNip("");
      setNewNip("");
      setConfirmNip("");
    }
  }, [open]);

  const mismatch = confirmNip.length === 6 && newNip !== confirmNip;
  const ready = currentNip.length === 6 && newNip.length === 6 && confirmNip.length === 6 && !mismatch;

  const submit = async () => {
    if (!ready) return;
    setSaving(true);
    try {
      await changeNip(currentNip, newNip);
      show("success", "Tu NIP se actualizó correctamente.");
      onClose();
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo cambiar el NIP.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DetailModal open={open} onClose={onClose} title="Cambiar mi NIP" icon={<KeyRound className="h-5 w-5" />}>
      <div className="space-y-5">
        <NipBlock label="NIP actual" value={currentNip} onChange={setCurrentNip} />
        <NipBlock label="Nuevo NIP" value={newNip} onChange={setNewNip} />
        <NipBlock label="Confirmar nuevo NIP" value={confirmNip} onChange={setConfirmNip} error={mismatch} />
        {mismatch && <p className="text-xs text-error">Los NIP nuevos no coinciden.</p>}
        <Button variant="primary" className="h-11 w-full" loading={saving} disabled={!ready} onClick={submit}>
          Guardar NIP
        </Button>
      </div>
    </DetailModal>
  );
}

function NipBlock({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      <InputOTP length={6} value={value} onChange={onChange} error={error} />
    </div>
  );
}
