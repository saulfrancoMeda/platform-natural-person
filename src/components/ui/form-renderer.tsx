"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { Input } from "./input";
import { Select } from "./select";
import { Textarea } from "./textarea";
import { Switch } from "./switch";
import { Checkbox } from "./checkbox";
import { AmountInput } from "./amount-input";
import { Combobox, type ComboboxOption } from "./combobox";
import { Field, FieldLabel, FieldDescription, FieldError } from "./field";
import { Button } from "./button";

export type FieldType = "text" | "email" | "password" | "number" | "amount" | "select" | "combobox" | "textarea" | "switch" | "checkbox";

export type Option = { value: string; label: string };
export type FormValues = Record<string, unknown>;

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  /** Static options for select/combobox. */
  options?: Option[];
  /** Async options from an endpoint. Receives current values (for dependent fetches). Cached per dependency key. */
  loadOptions?: (values: FormValues) => Promise<Option[]>;
  /** Parent→child dependency: re-run loadOptions / recompute when ANY of these field names change. */
  dependsOn?: string[];
  /** Derive options synchronously from other field values (parent→child without a fetch). */
  optionsFrom?: (values: FormValues) => Option[];
  /** Conditional visibility: only render when this returns true. */
  visibleIf?: (values: FormValues) => boolean;
  /** Span full row in a 2-col grid. */
  full?: boolean;
  /** Custom validator: return an error string or null. */
  validate?: (value: unknown, values: FormValues) => string | null;
  min?: number; max?: number; pattern?: string;
  disabled?: boolean;
}

export interface FormSchema {
  fields: FormFieldSchema[];
  submitLabel?: string;
  columns?: 1 | 2;
}

interface FormRendererProps {
  schema: FormSchema;
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void | Promise<void>;
  /** Show a busy state on the submit button. */
  submitting?: boolean;
  /** Hide the built-in submit button (e.g. when the parent renders its own footer/confirm flow). */
  hideSubmit?: boolean;
  /** Imperative submit trigger from a parent (see useFormRendererRef pattern in docs). */
  onValuesChange?: (values: FormValues) => void;
  className?: string;
}

/**
 * Config-driven form from a JSON schema. Supports static + ASYNC options (endpoints),
 * PARENT→CHILD dependencies (dependsOn + optionsFrom/loadOptions), conditional visibility (visibleIf),
 * and built-in validation. Define forms as data; keep schemas in their own files (separation of concerns).
 */
export function FormRenderer({ schema, initialValues = {}, onSubmit, submitting, hideSubmit, onValuesChange, className }: FormRendererProps) {
  const [values, setValues] = React.useState<FormValues>(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [asyncOptions, setAsyncOptions] = React.useState<Record<string, Option[]>>({});
  const [loadingOptions, setLoadingOptions] = React.useState<Record<string, boolean>>({});
  const cols = schema.columns ?? 2;

  const setVal = (name: string, v: unknown) => {
    setValues((prev) => {
      const next = { ...prev, [name]: v };
      onValuesChange?.(next);
      return next;
    });
  };

  // Load async options on mount and whenever a field's dependencies change.
  React.useEffect(() => {
    schema.fields.forEach((f) => {
      if (!f.loadOptions) return;
      setLoadingOptions((p) => ({ ...p, [f.name]: true }));
      f.loadOptions(values)
        .then((opts) => setAsyncOptions((p) => ({ ...p, [f.name]: opts })))
        .catch(() => setAsyncOptions((p) => ({ ...p, [f.name]: [] })))
        .finally(() => setLoadingOptions((p) => ({ ...p, [f.name]: false })));
    });
    // Re-run when any dependsOn value changes (serialized) or on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(schema.fields.map((f) => (f.dependsOn ?? []).map((d) => values[d])))]);

  const optionsFor = (f: FormFieldSchema): Option[] => {
    if (f.loadOptions) return asyncOptions[f.name] ?? [];
    if (f.optionsFrom) return f.optionsFrom(values);
    return f.options ?? [];
  };

  const validateField = (f: FormFieldSchema, v: unknown): string | null => {
    if (f.required && (v === undefined || v === "" || v === null)) return "Campo obligatorio";
    if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v))) return "Correo inválido";
    if (f.pattern && v && !new RegExp(f.pattern).test(String(v))) return "Formato inválido";
    if (f.type === "amount" && f.min != null && Number(v) < f.min) return `Mínimo ${f.min}`;
    if (f.validate) return f.validate(v, values);
    return null;
  };

  const visibleFields = schema.fields.filter((f) => !f.visibleIf || f.visibleIf(values));

  const submit = async () => {
    const next: Record<string, string> = {};
    for (const f of visibleFields) {
      const err = validateField(f, values[f.name]);
      if (err) next[f.name] = err;
    }
    setErrors(next);
    if (Object.keys(next).length === 0) await onSubmit(values);
  };

  // Expose submit to parents via a hidden form (so a custom footer/confirm can trigger it).
  const formRef = React.useRef<HTMLFormElement>(null);

  const renderControl = (f: FormFieldSchema) => {
    const v = values[f.name];
    const err = !!errors[f.name];
    const opts = optionsFor(f);
    const loading = loadingOptions[f.name];
    switch (f.type) {
      case "select":
        return <Select id={f.name} error={err} disabled={f.disabled || loading} placeholder={loading ? "Cargando…" : f.placeholder}
          options={opts} value={(v as string) ?? ""} onChange={(e) => setVal(f.name, e.target.value)} />;
      case "combobox":
        return <Combobox id={f.name} error={err} options={opts as ComboboxOption[]} value={(v as string) ?? ""}
          onChange={(val) => setVal(f.name, val)} placeholder={loading ? "Cargando…" : f.placeholder} />;
      case "textarea":
        return <Textarea id={f.name} error={err} placeholder={f.placeholder} value={(v as string) ?? ""} onChange={(e) => setVal(f.name, e.target.value)} />;
      case "switch":
        return <Switch checked={!!v} onChange={(val) => setVal(f.name, val)} />;
      case "checkbox":
        return <Checkbox id={f.name} checked={!!v} onChange={(e) => setVal(f.name, e.target.checked)} label={f.placeholder} />;
      case "amount":
        return <AmountInput id={f.name} error={err} value={(v as number) ?? ""} onChange={(val) => setVal(f.name, val)} />;
      default:
        return <Input id={f.name} type={f.type} error={err} disabled={f.disabled} placeholder={f.placeholder} value={(v as string) ?? ""} onChange={(e) => setVal(f.name, e.target.value)} />;
    }
  };

  return (
    <form ref={formRef} onSubmit={(e) => { e.preventDefault(); submit(); }} className={cn("space-y-4", className)}>
      <div className={cn("grid gap-4", cols === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
        {visibleFields.map((f) => (
          <Field key={f.name} className={cn(f.full && "sm:col-span-2", (f.type === "switch" || f.type === "checkbox") && "flex-row items-center gap-3")}>
            {f.type !== "checkbox" && <FieldLabel htmlFor={f.name}>{f.label}{f.required && <span className="text-error"> *</span>}</FieldLabel>}
            {renderControl(f)}
            {f.description && <FieldDescription>{f.description}</FieldDescription>}
            <FieldError>{errors[f.name]}</FieldError>
          </Field>
        ))}
      </div>
      {!hideSubmit && <Button type="submit" loading={submitting} className="w-full sm:w-auto">{schema.submitLabel ?? "Enviar"}</Button>}
    </form>
  );
}
