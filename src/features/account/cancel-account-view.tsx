"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { NipDialog } from "@/features/security/nip-dialog";
import { cn } from "@/lib/cn";
import { cancelAccount } from "@/lib/api/profile";
import { MedaApiError } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { isValidCLABE, isValidEmail } from "@/lib/utils/validators";

const BANKS = ["STP", "BBVA", "Banorte", "HSBC", "Santander", "Banamex", "Scotiabank", "Nu México"];

const input = (err?: boolean) =>
  cn(
    "h-11 w-full rounded-control border bg-bg px-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-brand/40",
    err ? "border-error" : "border-border-default focus:border-brand",
  );

export function CancelAccountView() {
  const router = useRouter();
  const { show } = useToast();
  const logout = useAuthStore((s) => s.logout);
  const [clabe, setClabe] = React.useState("");
  const [bank, setBank] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [nipOpen, setNipOpen] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const clabeError = clabe.length > 0 && !isValidCLABE(clabe);
  const emailError = email.length > 0 && !isValidEmail(email);
  const valid = isValidCLABE(clabe) && !!bank && name.trim().length >= 3 && !emailError;

  const confirm = async (nip: string) => {
    try {
      await cancelAccount({ nip, clabe, bank, beneficiaryName: name.trim(), email: email.trim() || undefined });
      setNipOpen(false);
      setDone(true);
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo cancelar la cuenta.");
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-meda border border-border-default bg-surface p-8 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/12">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </span>
        <h1 className="text-xl font-semibold text-fg">Solicitud recibida</h1>
        <p className="mt-1 text-sm text-fg-secondary">
          Recibimos tu solicitud de cancelación. Dispersaremos tu saldo a la cuenta indicada y
          cerraremos tu cuenta.
        </p>
        <Button
          variant="primary"
          className="mt-6 w-full"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          Entendido
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <div>
        <Link href="/perfil" className="mb-3 inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg">
          <ArrowLeft className="h-4 w-4" /> Perfil
        </Link>
        <h1 className="text-2xl font-semibold text-fg">Cancelar cuenta</h1>
      </div>

      <div className="flex gap-3 rounded-meda border border-error/30 bg-error/5 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-error" />
        <p className="text-sm text-fg-secondary">
          Estás por cancelar tu cuenta. No debes tener aclaraciones pendientes. Si tienes saldo, lo
          dispersaremos a la cuenta CLABE que indiques. <span className="font-medium text-fg">Esta acción es irreversible.</span>
        </p>
      </div>

      <div className="space-y-4 rounded-meda border border-border-default bg-surface p-6">
        <p className="text-sm font-semibold text-fg">¿A qué cuenta enviamos tu saldo?</p>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">CLABE (18 dígitos)</span>
          <input inputMode="numeric" maxLength={18} value={clabe} onChange={(e) => setClabe(e.target.value.replace(/\D/g, "").slice(0, 18))} className={input(clabeError)} placeholder="18 dígitos" />
          {clabeError && <p className="mt-1 text-xs text-error">CLABE inválida.</p>}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-fg">Banco</span>
            <select value={bank} onChange={(e) => setBank(e.target.value)} className={input()}>
              <option value="" disabled>Selecciona…</option>
              {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-fg">Nombre del titular destino</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className={input()} placeholder="Nombre completo" />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-fg">Correo para notificaciones (opcional)</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={input(emailError)} placeholder="correo@ejemplo.com" />
          {emailError && <p className="mt-1 text-xs text-error">Correo inválido.</p>}
        </label>
        <Button variant="danger" className="h-11 w-full" disabled={!valid} onClick={() => setNipOpen(true)}>
          Cancelar mi cuenta
        </Button>
      </div>

      <NipDialog
        open={nipOpen}
        title="Autoriza la cancelación con tu NIP"
        description="Ingresa el código que enviamos a tu correo para confirmar la cancelación de tu cuenta."
        onClose={() => setNipOpen(false)}
        onValid={confirm}
      />
    </div>
  );
}
