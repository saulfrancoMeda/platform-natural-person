"use client";
import * as React from "react";
import { FormRenderer, type FormValues } from "@/components/ui/form-renderer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { transferSchema } from "@/lib/forms/transfer-schema";
import { formatMXN } from "@/lib/utils/format";

/**
 * New transfer = FormRenderer (schema-driven) + a confirm step. The schema lives in
 * lib/forms/transfer-schema.ts (async bank options + bank→account dependency). This component
 * only wires the schema to a submit + confirmation — no per-field JSX, no hand-rolled validation.
 */
export function TransferForm({ onSubmit }: { onSubmit?: (v: FormValues) => Promise<void> | void }) {
  const [pending, setPending] = React.useState<FormValues | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const doSubmit = async () => {
    if (!pending) return;
    setSubmitting(true);
    try { await onSubmit?.(pending); setPending(null); } finally { setSubmitting(false); }
  };

  return (
    <>
      <FormRenderer schema={transferSchema} onSubmit={(v) => setPending(v)} />
      <ConfirmDialog
        open={!!pending}
        onClose={() => setPending(null)}
        onConfirm={doSubmit}
        loading={submitting}
        title="Confirmar transferencia"
        description={pending
          ? `Vas a enviar ${formatMXN(Number(pending.amount) || 0)} a ${pending.beneficiary || "el beneficiario"}. Esta acción no se puede deshacer.`
          : ""}
        confirmLabel="Enviar transferencia"
      />
    </>
  );
}
