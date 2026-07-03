---
name: meda-fe-component
description: >
  Use to build a new React/TypeScript component under MEDA standards. Triggers on "build a
  component", "create a card/table/modal", "make a UI element" / "crea un componente", "haz una
  tarjeta/tabla/modal". Applies Server/Client component rules, typing, Tailwind tokens, and
  accessibility. Reply in the user's language.
---

# /meda-fe-component — Build a component under standards

Loads `fe-components`, `fe-styling-tailwind`, `fe-quality`.
**Reply in the user's language.**

## Steps
1. Decide **Server vs Client Component**: default to Server; use `'use client'` only when it needs
   state, effects, event handlers, or browser APIs (`fe-components`).
2. Type props explicitly (no `any`); provide sensible defaults; prefer composition over config bloat.
3. Style with Tailwind + MEDA design tokens (no magic hex values; use token classes). Responsive and
   dark-mode aware (`fe-styling-tailwind`).
4. Accessibility: semantic HTML, ARIA where needed, keyboard navigation, labels, focus states
   (`fe-quality`) — mandatory in fintech.
5. Co-locate: component + its types + its test in the feature/component folder (`fe-project-structure`).
6. If it's a reusable primitive (button/input/etc.), align it to MEDA UI conventions.

## Rules
- Don't make everything a Client Component (hurts performance). Default Server.
- No inline business logic in presentational components; data comes via props or hooks.
- Leave a basic test (`fe-testing`) for interactive components.

## Example — "build a balance card that shows the user's available balance"

A reviewer should see this exact shape from any dev. Server-first; if it needs no interactivity, no
`'use client'`.

```tsx
// src/features/account/components/BalanceCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils/format";

interface BalanceCardProps {
  available: number;
  currency?: string;
  label?: string;
}

/** Presentational only — receives the balance via props, renders it. No fetch here (SRP). */
export function BalanceCard({ available, currency = "MXN", label = "Available balance" }: BalanceCardProps) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm text-fg-secondary">{label}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-fg">{formatCurrency(available)}</p>
        <p className="text-xs text-fg-tertiary mt-1">{currency}</p>
      </CardContent>
    </Card>
  );
}
```

Why this passes review instantly: typed props (no `any`), reuses MEDA UI (`Card`) + `formatCurrency`
(DRY), presentational (the balance arrives via props — the fetch lives in a hook, see
`meda-fe-endpoint`), token classes (no hex), Server Component (no `'use client'` because it has no
interactivity).

If it needed interactivity (e.g. a "hide balance" toggle), THEN add `'use client'` and `useState` —
and that's the only reason to.
