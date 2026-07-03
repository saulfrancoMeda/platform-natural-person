---
name: fe-react-principles
description: >
  MEDA frontend standard: core React engineering principles applied to EVERY component and feature —
  SRP (single responsibility), DRY, component structure, separation of concerns (UI vs logic vs
  data), composition, and handling edge cases (loading/error/empty). UNIVERSAL skill: load it for any
  component, hook, or feature work and for review. Triggers on component design, SRP, DRY, separation
  of concerns, custom hook, refactor, clean code, edge cases / "principios", "SRP", "DRY",
  "componente", "refactor", "separación de responsabilidades".
---
# React Engineering Principles (applied in day-to-day development)

These are the principles MEDA evaluates in interviews AND in every PR. Apply them while building,
not only at review. Goal: every dev produces the same shape of code → reviews get faster.

## 1. SRP — Single Responsibility
Each component/hook/function does ONE thing.
- A component either **presents** UI or **orchestrates**, not both.
- Data fetching lives in a **custom hook** (`useX`), not inline in the component.
- A 300-line component doing fetch + state + render + formatting = split it.
- Signal to split: the component name needs "and" to describe it ("table AND its filters AND its API call").

## 2. Separation of concerns (3 layers per feature)
- **Presentational component**: receives props, renders. No fetch, no business logic.
- **Custom hook**: state + data fetching + logic (`useTransactions`, `usePagination`).
- **API/service**: the call itself (`lib/api`). 
The component asks the hook; the hook asks the service. One direction.

## 3. DRY — but not prematurely
- Repeated logic (formatting, validation, a fetch pattern) → extract to `lib/utils` or a hook.
- Repeated markup → a shared component or a MEDA UI primitive.
- BUT: don't over-abstract two-line similarities; duplication is cheaper than the wrong abstraction.
  Extract on the third repetition, when the pattern is clear.

## 4. Component structure & composition
- Prefer composition (children, slots) over giant prop objects or boolean flags.
- Keep components small and focused; lift shared state to the nearest common parent, not to global.
- Co-locate: component + its hook + its types in the feature folder.

## 5. Edge cases — ALWAYS (this is what separates junior from senior)
Every data-driven UI handles the FOUR states, never assumes the happy path:
- **loading** (skeleton/spinner), **error** (message + retry), **empty** (no data), **success**.
- Plus: race conditions (cancel stale requests), debouncing (search inputs), optimistic updates with
  rollback (mutations), and accessibility (keyboard, ARIA).

## 6. State management discipline (see fe-state-management)
- Local UI state → useState. Server data → query cache (TanStack), NOT a global store.
- Derived state → compute, don't store. Global store → last resort.

## 7. Performance awareness (see fe-quality)
- Default to Server Components; push `'use client'` to leaves.
- Virtualize long lists. Lazy-load heavy client components. With React Compiler, don't over-memoize.

## The 10 reference patterns (detailed — how MEDA builds each)
Each pattern = presentational component + custom hook + service. The agent adapts these to YOUR real
API and data; they are the structure to follow, not fixed components. Fintech notes flag what matters
when money/PII is involved.

1. **Autocomplete search** — `useDebounce` + `useSearch` hook; component renders results only.
   Cancel stale requests (TanStack does this). *Fintech:* never put the query (may contain account
   numbers) in a logged URL; debounce to avoid hammering the backend.
2. **Infinite scroll feed** — `useInfiniteQuery` (TanStack) + `IntersectionObserver` in a hook;
   component renders pages + loading/error/empty. *Fintech:* paginate by cursor (don't expose internal
   offsets); cancel stale pages so you never show movements from a superseded query.
3. **File explorer / tree** — recursive presentational component + `useTree` (expand/collapse state).
   Bound recursion depth. *Fintech:* if it renders permission-scoped data, enforce access per node.
4. **Kanban board** — `useBoard` (state + reordering) + a presentational drag layer. Optimistic
   reorder with rollback on failure. *Fintech:* persist order changes through the API with idempotency.
5. **Data table** — MEDA UI `DataTable` (sort/columns/density) + `useTableState` (filters/pagination).
   *Fintech:* server-side pagination/filtering for large ledgers; mask PII columns by default.
6. **Multi-step form (onboarding/KYC)** — `useWizard` (step + persistence) + RHF/Zod per step; one
   component per step. *Fintech:* validate each step server-side too; never persist sensitive fields
   (password, full PAN) in client state longer than needed; clear on submit.
7. **Modal manager** — `useModal`/context for stacking + Dialog primitive (a11y, Esc, focus trap).
   *Fintech:* confirm destructive/financial actions in a modal with explicit confirm.
8. **Nested comments** — recursive component + `useComments` tree; render bounded depth, lazy-load
   deep threads. *Fintech:* sanitize user content (XSS); never dangerouslySetInnerHTML.
9. **Toast/notifications** — MEDA UI `ToastProvider` (queue, auto-dismiss, timers).
   *Fintech:* don't put sensitive data (amounts tied to identity, tokens) in toast text/logs.
10. **Pagination** — `usePagination` hook; component renders controls only. Prefer cursor pagination
    for ledgers. *Fintech:* the page boundary must be stable so a row isn't shown twice or skipped.

## Rules
- Build with these from the start; don't bolt them on later.
- A component with fetch + business logic + render inline is a finding (split it).
- Missing loading/error/empty states is a finding.
- Reviews check: SRP respected? logic in hooks? edge cases handled? no premature abstraction?
