"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Building2, CheckCircle2, Hash, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/cn";
import { sendSpei } from "@/lib/api/account";
import { MedaApiError } from "@/lib/api/client";
import { useBalance } from "@/lib/hooks/use-account";
import { formatMXN } from "@/lib/utils/format";
import { isValidCLABE, isValidCURP, isValidRFC } from "@/lib/utils/validators";
import { NipModal } from "./nip-modal";

const BANKS = [
  "STP",
  "BBVA",
  "Banorte",
  "HSBC",
  "Santander",
  "Banamex",
  "Scotiabank",
  "Banco Azteca",
  "BanCoppel",
  "Nu México",
];

const schema = z.object({
  receiverName: z.string().min(3, "Ingresa el nombre del beneficiario"),
  receiverClabe: z.string().refine(isValidCLABE, "La CLABE debe tener 18 dígitos"),
  bank: z.string().min(1, "Selecciona el banco"),
  rfcCurp: z
    .string()
    .refine((v) => !v || isValidRFC(v) || isValidCURP(v), "RFC o CURP no válido")
    .optional()
    .or(z.literal("")),
  amount: z.number({ error: "Ingresa un monto válido" }).positive("El monto debe ser mayor a 0"),
  concept: z.string().min(1, "Ingresa un concepto").max(40, "Máximo 40 caracteres"),
  reference: z
    .string()
    .regex(/^\d*$/, "Solo dígitos")
    .max(7, "Máximo 7 dígitos")
    .optional()
    .or(z.literal("")),
});
type SpeiValues = z.infer<typeof schema>;

interface Props {
  title: string;
  description: string;
  ownAccounts?: boolean;
}

export function SendSpeiView({ title, description, ownAccounts }: Props) {
  const { show } = useToast();
  const queryClient = useQueryClient();
  const { data: balance } = useBalance();
  const [done, setDone] = React.useState<{ trackingKey: string; amount: number } | null>(null);
  const [pending, setPending] = React.useState<SpeiValues | null>(null);
  const [sending, setSending] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SpeiValues>({ resolver: zodResolver(schema), mode: "onChange" });

  const amount = watch("amount");
  const numericAmount = Number.isFinite(amount) ? amount : 0;
  const available = balance?.balance ?? 0;
  const remaining = available - numericAmount;
  const insufficient = numericAmount > 0 && remaining < 0;

  // Solo dígitos, longitud máxima. Reusa la lógica para CLABE (18) y referencia (7).
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

  // Paso 1: validado el formulario, pide NIP.
  const onSubmit = (values: SpeiValues) => {
    if (insufficient) {
      show("error", "Saldo insuficiente para esta transferencia.");
      return;
    }
    setPending(values);
  };

  // Paso 2: con NIP, ejecuta la transferencia.
  const confirmWithNip = async (nip: string) => {
    if (!pending) return;
    setSending(true);
    try {
      const res = await sendSpei({
        amount: pending.amount,
        receiverClabe: pending.receiverClabe,
        receiverName: pending.receiverName,
        bank: pending.bank,
        concept: pending.concept,
        reference: pending.reference || undefined,
        rfcCurp: pending.rfcCurp || undefined,
        nip,
      });
      // Refresca saldo y movimientos para que la transferencia aparezca.
      await queryClient.invalidateQueries({ queryKey: ["movements"] });
      await queryClient.invalidateQueries({ queryKey: ["balance"] });
      setDone({ trackingKey: res.trackingKey, amount: res.amount });
      setPending(null);
      show("success", "Transferencia enviada correctamente.");
      reset();
    } catch (err) {
      show(
        "error",
        err instanceof MedaApiError && err.message
          ? err.message
          : "No se pudo enviar la transferencia.",
      );
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
          Enviaste {formatMXN(done.amount)}. Aparecerá en tus movimientos en segundos.
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
        <h1 className="text-2xl font-semibold text-fg">{title}</h1>
        <p className="mt-1 text-sm text-fg-secondary">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 lg:grid-cols-[1fr_20rem]">
        {/* Formulario */}
        <div className="space-y-5">
          <Card
            icon={<User className="h-4 w-4" />}
            title={ownAccounts ? "Cuenta destino" : "Beneficiario"}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={ownAccounts ? "Titular" : "Nombre del beneficiario"} error={errors.receiverName?.message} full>
                <input placeholder="Nombre completo" className={input(!!errors.receiverName)} {...register("receiverName")} />
              </Field>
              <Field label="Cuenta CLABE" error={errors.receiverClabe?.message}>
                <input inputMode="numeric" maxLength={18} placeholder="18 dígitos" className={input(!!errors.receiverClabe)} {...digitsOnly("receiverClabe", 18)} />
              </Field>
              <Field label="Banco" error={errors.bank?.message}>
                <select className={input(!!errors.bank)} defaultValue="" {...register("bank")}>
                  <option value="" disabled>
                    Selecciona un banco
                  </option>
                  {BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
              {!ownAccounts && (
                <Field label="RFC / CURP (opcional)" error={errors.rfcCurp?.message} full>
                  <input placeholder="RFC o CURP del beneficiario" className={input(!!errors.rfcCurp)} {...register("rfcCurp")} />
                </Field>
              )}
            </div>
          </Card>

          <Card icon={<Hash className="h-4 w-4" />} title="Detalle de la transferencia">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Monto (MXN)" error={errors.amount?.message}>
                <input type="number" step="0.01" min="0" placeholder="0.00" className={input(!!errors.amount)} {...register("amount", { valueAsNumber: true })} />
              </Field>
              <Field label="No. de referencia (opcional)" error={errors.reference?.message}>
                <input inputMode="numeric" maxLength={7} placeholder="Se genera automáticamente" className={input(!!errors.reference)} {...digitsOnly("reference", 7)} />
              </Field>
              <Field label="Concepto" error={errors.concept?.message} full>
                <input maxLength={40} placeholder="Concepto del pago" className={input(!!errors.concept)} {...register("concept")} />
              </Field>
            </div>
          </Card>
        </div>

        {/* Resumen */}
        <aside className="lg:sticky lg:top-2 h-fit space-y-4 rounded-meda border border-border-default bg-surface p-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-fg-tertiary" />
            <p className="text-sm font-semibold text-fg">Resumen</p>
          </div>
          <SummaryRow label="Saldo disponible" value={formatMXN(available)} />
          <SummaryRow label="Monto a enviar" value={formatMXN(numericAmount)} />
          <SummaryRow label="Comisión" value={formatMXN(0)} />
          <div className="border-t border-border-default pt-3">
            <SummaryRow label="Total" value={formatMXN(numericAmount)} strong />
            <SummaryRow
              label="Saldo después"
              value={formatMXN(remaining)}
              tone={insufficient ? "error" : "muted"}
            />
          </div>
          {insufficient && (
            <p className="rounded-control bg-error/10 px-3 py-2 text-xs text-error-dark">
              El monto supera tu saldo disponible.
            </p>
          )}
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={insufficient} className="h-11 w-full">
            {ownAccounts ? "Transferir" : "Enviar SPEI"} <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
          <p className="flex items-center justify-center gap-1 text-[11px] text-fg-tertiary">
            <Send className="h-3 w-3" /> Transferencia protegida por Medá
          </p>
        </aside>
      </form>

      <NipModal
        open={!!pending}
        amount={pending?.amount ?? 0}
        receiverName={pending?.receiverName ?? ""}
        submitting={sending}
        onClose={() => setPending(null)}
        onConfirm={confirmWithNip}
      />
    </div>
  );
}

function input(hasError?: boolean) {
  return cn(
    "h-11 w-full rounded-control border bg-bg px-3 text-sm text-fg outline-none transition-colors focus:ring-2 focus:ring-brand/40",
    hasError ? "border-error" : "border-border-default focus:border-brand",
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-meda border border-border-default bg-surface p-5">
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

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", full && "sm:col-span-2")}>
      <span className="mb-1.5 block text-sm font-medium text-fg">{label}</span>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </label>
  );
}

function SummaryRow({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "error" | "muted";
}) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-fg-secondary">{label}</span>
      <span
        className={cn(
          strong ? "text-base font-semibold text-fg" : "text-fg",
          tone === "error" && "font-semibold text-error-dark",
          tone === "muted" && "text-fg-secondary",
        )}
      >
        {value}
      </span>
    </div>
  );
}
