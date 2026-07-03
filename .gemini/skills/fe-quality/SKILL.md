---
name: fe-quality
description: >
  MEDA frontend quality standard — performance (Server Components, code splitting, Core Web Vitals)
  and accessibility (semantic HTML, keyboard, ARIA, contrast). Both are required quality gates,
  especially for fintech critical flows (login, payments). Use when building UI, optimizing, or
  reviewing for performance/a11y. Triggers on performance, optimize, bundle, lazy load, Core Web
  Vitals, accessibility, a11y, keyboard, ARIA, contrast, screen reader / "rendimiento", "accesibilidad",
  "optimizar", "teclado".
---
# Quality: Performance + Accessibility

Both are non-negotiable quality gates. Performance affects conversion; accessibility is required and,
in fintech, often a compliance expectation.

## Performance
### Server-first (biggest win in App Router)
- Keep components as Server Components when possible — zero client JS. Push `'use client'` to leaves.
- Fetch on the server for initial data; stream with Suspense/`loading.tsx`.
### Client-side
- **Code splitting**: `next/dynamic` for heavy client-only components (charts, editors).
- **Images**: `next/image` (sizing, lazy, modern formats).
- **Memoization**: with React Compiler stable in Next 16, manual `useMemo`/`memo` is rarely needed;
  don't over-memoize. Profile before optimizing.
- **Bundle**: don't import a whole lib for one function; use the bundle analyzer.
- **Long lists**: virtualize (ledgers, transaction feeds).
### Core Web Vitals
- LCP (server render + image priority), CLS (reserve space), INP (avoid heavy work on interaction).

## Accessibility (a11y)
### Baseline (required in fintech)
- **Semantic HTML first**: `<button>`, `<nav>`, `<main>`, `<label>` — not `<div onClick>`.
- **Keyboard**: everything operable by keyboard; visible focus; logical tab order.
- **Labels**: every input has a `<label>` or `aria-label`; errors via `aria-describedby`.
- **ARIA only when needed**: prefer native elements; add roles/states (`aria-expanded`, `aria-live`)
  for custom widgets (modals, dropdowns, toasts).
- **Contrast**: WCAG AA (4.5:1 text). Don't rely on color alone.
- **Modals/dialogs**: focus trap, `Esc` to close, focus returns to trigger, `role="dialog"`.

## Rules
- Don't make everything a Client Component (ships JS, hurts LCP/INP). Lazy-load heavy client comps.
- Don't pre-optimize; measure first.
- No clickable `<div>`/`<span>` for actions — use `<button>`. Images need `alt`.
- Test critical flows (login, payments) with keyboard only and a screen reader.
