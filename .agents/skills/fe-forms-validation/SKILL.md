---
name: fe-forms-validation
description: >
  MEDA frontend standard: forms with React Hook Form + Zod, validation, error messages, and complex
  form patterns. Use whenever building a form or input validation. Triggers on form, validation, zod,
  react hook form, input error, submit / "formulario", "validación", "zod", "campos".
---
# Forms & Validation

## Stack
- **React Hook Form** for form state + **Zod** for schema validation (`zodResolver`).
- Define the Zod schema once; infer the TS type from it (`z.infer`) — single source of truth.

## Pattern
```typescript
const schema = z.object({
  amount: z.number().positive(),
  currency: z.enum(['MXN', 'USD']),
});
type FormValues = z.infer<typeof schema>;
const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
```

## Rules
- Validate on the client for UX, but NEVER trust the client — the backend re-validates.
- Show field-level error messages tied to inputs (accessible: `aria-describedby`).
- Disable submit while submitting; show a spinner; handle the API error (status:"ERROR").
- For money inputs: validate currency/amount precisely; don't use floats loosely for amounts.
- Reuse MEDA UI form primitives (Input, Select, FormField) for consistent styling + a11y.
