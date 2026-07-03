"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { KeyRound, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyField } from "@/components/ui/copy-field";
import { Spinner } from "@/components/ui/spinner";
import { InputOTP } from "@/components/ui/input-otp";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { changeNip } from "@/lib/api/auth";
import { updateProfile } from "@/lib/api/profile";
import { MedaApiError } from "@/lib/api/client";
import { useProfile } from "@/lib/hooks/use-profile";
import { isValidEmail, isValidPhoneMX, isValidRFC } from "@/lib/utils/validators";

const contactSchema = z.object({
  email: z.string().refine(isValidEmail, "Correo no válido"),
  phone: z.string().refine(isValidPhoneMX, "Teléfono de 10 dígitos"),
  rfc: z.string().refine((v) => !v || isValidRFC(v), "RFC no válido").or(z.literal("")),
});
type ContactValues = z.infer<typeof contactSchema>;

const input = (err?: boolean) =>
  cn(
    "h-11 w-full rounded-control border bg-bg px-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-brand/40",
    err ? "border-error" : "border-border-default focus:border-brand",
  );

export function ProfileView() {
  const { data, isLoading } = useProfile();

  if (isLoading || !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Mi perfil</h1>
        <p className="mt-1 text-sm text-fg-secondary">Consulta y actualiza tu información.</p>
      </div>

      <IdentityCard name={data.profile.name} email={data.profile.email} />
      <ContactCard profile={data.profile} />
      <SecurityCard />
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-meda border border-border-default bg-surface p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-control bg-brand/12 text-brand-dark">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-fg">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function IdentityCard({ name, email }: { name: string; email: string }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  return (
    <section className="flex items-center gap-4 rounded-meda border border-border-default bg-surface p-6">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-xl font-semibold text-brand-foreground">
        {initials}
      </span>
      <div>
        <p className="text-lg font-semibold text-fg">{name}</p>
        <p className="text-sm text-fg-secondary">{email}</p>
      </div>
    </section>
  );
}

function ContactCard({ profile }: { profile: { email: string; phone: string; rfc: string; curp: string; clabe: string } }) {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: profile.email, phone: profile.phone, rfc: profile.rfc },
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      await updateProfile({ email: values.email, phone: values.phone, rfc: values.rfc || undefined });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      show("success", "Datos actualizados correctamente.");
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo actualizar.");
    }
  };

  return (
    <Card icon={<User className="h-4 w-4" />} title="Datos de contacto">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-fg">
            <Mail className="h-3.5 w-3.5 text-fg-tertiary" /> Correo electrónico
          </span>
          <input className={input(!!errors.email)} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-fg">
            <Phone className="h-3.5 w-3.5 text-fg-tertiary" /> Teléfono
          </span>
          <input inputMode="numeric" maxLength={10} className={input(!!errors.phone)} {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">RFC</span>
          <input className={input(!!errors.rfc)} {...register("rfc")} />
          {errors.rfc && <p className="mt-1 text-xs text-error">{errors.rfc.message}</p>}
        </label>
        <div className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">CURP</span>
          <input value={profile.curp} disabled className={cn(input(), "opacity-60")} />
        </div>
        <div className="sm:col-span-2">
          <CopyField label="CLABE" value={profile.clabe} />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty} className="h-11">
            Guardar cambios
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SecurityCard() {
  const { show } = useToast();
  const [currentNip, setCurrentNip] = React.useState("");
  const [newNip, setNewNip] = React.useState("");
  const [confirmNip, setConfirmNip] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const mismatch = confirmNip.length === 4 && newNip !== confirmNip;
  const ready = currentNip.length === 4 && newNip.length === 4 && confirmNip.length === 4 && !mismatch;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setSaving(true);
    try {
      await changeNip(currentNip, newNip);
      show("success", "NIP actualizado correctamente.");
      setCurrentNip("");
      setNewNip("");
      setConfirmNip("");
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo cambiar el NIP.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card icon={<ShieldCheck className="h-4 w-4" />} title="Seguridad · NIP de transacciones">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <NipField label="NIP actual" value={currentNip} onChange={setCurrentNip} />
          <NipField label="Nuevo NIP" value={newNip} onChange={setNewNip} />
          <NipField label="Confirmar NIP" value={confirmNip} onChange={setConfirmNip} error={mismatch} />
        </div>
        {mismatch && <p className="text-xs text-error">Los NIP nuevos no coinciden.</p>}
        <Button type="submit" variant="primary" loading={saving} disabled={!ready} className="h-11">
          <KeyRound className="mr-1.5 h-4 w-4" /> Cambiar NIP
        </Button>
      </form>
    </Card>
  );
}

function NipField({
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
      <InputOTP length={4} value={value} onChange={onChange} error={error} />
    </div>
  );
}
