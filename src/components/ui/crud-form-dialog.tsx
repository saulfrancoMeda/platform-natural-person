"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { FormRenderer, type FormSchema, type FormValues } from "./form-renderer";

interface CrudFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** The same schema drives create AND edit. */
  schema: FormSchema;
  /** Pass existing record for edit; omit/empty for create. */
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => Promise<void> | void;
  /** "create" | "edit" — drives the title/subtitle defaults. */
  mode?: "create" | "edit";
  title?: string;
  subtitle?: string;
  size?: "md" | "lg";
}

/**
 * Reusable CRUD create/edit dialog: a polished modal wrapping FormRenderer. One schema → both
 * create (empty) and edit (initialValues) flows. Handles submit state, closes on overlay/Escape.
 * This is the standard way to do create/edit in MEDA admin — don't hand-build forms in modals.
 */
export function CrudFormDialog({ open, onClose, schema, initialValues, onSubmit, mode = "create", title, subtitle, size = "md" }: CrudFormDialogProps) {
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !submitting && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose, submitting]);

  if (!open) return null;
  const heading = title ?? (mode === "edit" ? "Editar registro" : "Nuevo registro");
  const sub = subtitle ?? (mode === "edit" ? "Modifica los campos y guarda los cambios." : "Completa los campos para crear el registro.");
  const width = size === "lg" ? "max-w-2xl" : "max-w-lg";

  const handle = async (values: FormValues) => {
    setSubmitting(true);
    try { await onSubmit(values); onClose(); } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4 sm:p-8" onClick={() => !submitting && onClose()}>
      <div className={cn("meda-pop w-full rounded-meda border border-border-default bg-surface shadow-xl", width)} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-border-default px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-fg">{heading}</h2>
            <p className="mt-0.5 text-sm text-fg-secondary">{sub}</p>
          </div>
          <button onClick={onClose} disabled={submitting} aria-label="Cerrar" className="text-fg-tertiary hover:text-fg disabled:opacity-40"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-6 py-5">
          <FormRenderer
            key={mode + JSON.stringify(initialValues ?? {})}
            schema={{ ...schema, submitLabel: mode === "edit" ? "Guardar cambios" : (schema.submitLabel ?? "Crear") }}
            initialValues={initialValues}
            submitting={submitting}
            onSubmit={handle}
          />
        </div>
      </div>
    </div>
  );
}
