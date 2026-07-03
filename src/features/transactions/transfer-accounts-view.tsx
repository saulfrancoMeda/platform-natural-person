"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { sendSpei } from "@/lib/api/account";
import { MedaApiError } from "@/lib/api/client";
import { useBalance } from "@/lib/hooks/use-account";
import { formatMXN } from "@/lib/utils/format";
import { isValidCLABE } from "@/lib/utils/validators";
import { NipModal } from "./nip-modal";

const schema = z.object({
  reference: z
    .string()
    .regex(/^\d*$/, "Solo dígitos")
    .max(7, "Máximo 7 dígitos")
    .optional()
    .or(z.literal("")),
  receiverClabe: z.string().refine(isValidCLABE, "La CLABE debe tener 18 dígitos"),
  concept: z.string().min(1, "Ingresa un concepto").max(40, "Máximo 40 caracteres"),
  amount: z.number({ error: "Ingresa un monto válido" }).positive("El monto debe ser mayor a 0"),
});
type Values = z.infer<typeof schema>;

const input = (err?: boolean) =>
  cn(
    "h-11 w-full rounded-control border bg-bg px-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-brand/40",
    err ? "border-error" : "border-border-default focus:border-brand",
  );

export function TransferAccountsView() {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const { data: balance } = useBalance();
  const [done, setDone] = React.useState<{ trackingKey: string; amount: number } | null>(null);
  const [pending, setPending] = React.useState<Values | null>(null);
  const [sending, setSending] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema), mode: "onChange" });

  const amount = watch("amount");
  const numericAmount = Number.isFinite(amount) ? amount : 0;
  const available = balance?.balance ?? 0;
  const remaining = available - numericAmount;
  const insufficient = numericAmount > 0 && remaining < 0;

  const digitsOnly = (name: "receiverClabe" | "reference", max: number) => {
    const field = register(name);
    return {
      ...field,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, max);
        return field.onChange(e);
      },
    };
  };

  const onSubmit = (values: Values) => {
    if (insufficient) {
      show("error", "Saldo insuficiente para esta transferencia.");
      return;
    }
    setPending(values);
  };

  const confirmWithNip = async (nip: string) => {
    if (!pending) return;
    setSending(true);
    try {
      const res = await sendSpei({
        amount: pending.amount,
        receiverClabe: pending.receiverClabe,
        concept: pending.concept,
        reference: pending.reference || undefined,
        nip,
      });
      await queryClient.invalidateQueries({ queryKey: ["movements"] });
      await queryClient.invalidateQueries({ queryKey: ["balance"] });
      setDone({ trackingKey: res.trackingKey, amount: res.amount });
      setPending(null);
      show("success", "Transferencia realizada correctamente.");
      reset();
    } catch (err) {
      show("error", err instanceof MedaApiError && err.message ? err.message : "No se pudo transferir.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-meda border border-border-default bg-surface p-8 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/12">
          <CheckCircle2 className="h-9 w-9 text-success" />
        </span>
        <h1 className="text-xl font-semibold text-fg">Transferencia en proceso</h1>
        <p className="mt-1 text-sm text-fg-secondary">
          Moviste {formatMXN(done.amount)} entre tus cuentas. Aparecerá en tus movimientos en segundos.
        </p>
        <div className="mt-4 w-full rounded-control bg-muted px-4 py-3 text-left">
          <p className="text-[11px] uppercase tracking-wide text-fg-tertiary">Clave de rastreo</p>
          <p className="font-mono text-sm text-fg">{done.trackingKey}</p>
        </div>
        <Button variant="primary" className="mt-6 w-full" onClick={() => setDone(null)}>
          Hacer otra transferencia
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-fg">Transacción entre cuentas</h1>
        <p className="mt-1 text-sm text-fg-secondary">Mueve dinero entre tus propias cuentas Medá.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        <section className="rounded-meda border border-border-default bg-surface p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-control bg-brand/12 text-brand-dark">
              <Repeat className="h-4 w-4" />
            </span>
            <h2 className="text-sm font-semibold text-fg">Datos de la transferencia</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="No. de referencia (opcional)" error={errors.reference?.message}>
              <input inputMode="numeric" maxLength={7} placeholder="Se genera automáticamente" className={input(!!errors.reference)} {...digitsOnly("reference", 7)} />
            </Field>
            <Field label="Cuenta beneficiario (CLABE)" error={errors.receiverClabe?.message}>
              <input inputMode="numeric" maxLength={18} placeholder="18 dígitos" className={input(!!errors.receiverClabe)} {...digitsOnly("receiverClabe", 18)} />
            </Field>
            <Field label="Concepto" error={errors.concept?.message}>
              <input maxLength={40} placeholder="Concepto" className={input(!!errors.concept)} {...register("concept")} />
            </Field>
            <Field label="Monto (MXN)" error={errors.amount?.message}>
              <input type="number" step="0.01" min="0" placeholder="0.00" className={input(!!errors.amount)} {...register("amount", { valueAsNumber: true })} />
            </Field>
          </div>
        </section>

        <aside className="lg:sticky lg:top-2 h-fit space-y-4 rounded-meda border border-border-default bg-surface p-5">
          <p className="text-sm font-semibold text-fg">Resumen</p>
          <SummaryRow label="Saldo disponible" value={formatMXN(available)} />
          <SummaryRow label="Monto a transferir" value={formatMXN(numericAmount)} />
          <div className="border-t border-border-default pt-3">
            <SummaryRow label="Saldo después" value={formatMXN(remaining)} tone={insufficient ? "error" : "muted"} />
          </div>
          {insufficient && (
            <p className="rounded-control bg-error/10 px-3 py-2 text-xs text-error-dark">
              El monto supera tu saldo disponible.
            </p>
          )}
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={insufficient} className="h-11 w-full">
            Transferir <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </aside>
      </form>

      <NipModal
        open={!!pending}
        amount={pending?.amount ?? 0}
        receiverName="tu otra cuenta"
        submitting={sending}
        onClose={() => setPending(null)}
        onConfirm={confirmWithNip}
      />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </label>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: "error" | "muted" }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-fg-secondary">{label}</span>
      <span className={cn("text-fg", tone === "error" && "font-semibold text-error-dark", tone === "muted" && "text-fg-secondary")}>
        {value}
      </span>
    </div>
  );
}
