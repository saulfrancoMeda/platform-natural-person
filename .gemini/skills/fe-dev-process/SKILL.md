---
name: fe-dev-process
description: >
  MEDA standard development PROCESS for any frontend work — the steps to follow before, during, and
  after building, so development is deliberate and consistent, not ad-hoc. Use at the START of any
  feature, component, endpoint integration, or fix. Triggers on "how do I start", "develop a
  feature", "new task", "process", "where do I begin", "build X" / "cómo empiezo", "desarrollar",
  "proceso", "nueva tarea".
---
# Development Process (follow for ANY frontend work)

Don't develop by just writing code. Follow these phases so the result is consistent, reviewable, and
right. This is the backbone the other skills plug into.

## Phase 1 — Understand before coding
1. What's the goal? (the user-facing outcome, not the implementation)
2. Is there a contract/API? Read the OpenAPI/Postman or ask. If the endpoint isn't ready → use MSW
   (see `fe-mocking`) to build against the agreed shape, NOT a hardcoded fake.
3. Which architecture layer does this touch? (feature folder, shared component, lib util)
4. Does MEDA UI / lib already have this? (don't rebuild — see `fe-meda-ui`, DRY in `fe-react-principles`)

## Phase 2 — Plan the structure (before writing)
Decide the three layers up front (`fe-react-principles`):
- **Service** (`lib/api`): the call(s), typed, handling the APIResponse envelope.
- **Hook** (`useX`): state, fetching, logic, edge cases.
- **Component**: presentational, renders the four states.
Name them, know where each file goes. If it's a known pattern (table, infinite scroll, form, modal),
follow its structure in `fe-react-principles`.

## Phase 3 — Build
1. Types first (from the contract). No `any` (`fe-prohibited-practices`).
2. Service → hook → component, in that order.
3. Handle loading/error/empty/success from the start, not later.
4. Reuse MEDA UI + lib/utils. Forms → RHF + Zod (`fe-forms-validation`).
5. Security as you go (`fe-security`): no secrets client-side, no PII in logs, validate input.

## Phase 4 — Verify
1. `npx tsc --noEmit` compiles clean.
2. Tests for the risky parts (`fe-testing`): money, validators, states, form paths.
3. Self-review against `/meda-fe-review` checklist.
4. `pnpm dev` runs; the four states work; keyboard + a11y on critical flows (`fe-quality`).

## Phase 5 — Ship
1. Exact dependency versions, lockfile committed (`fe-security`).
2. Deploy config consistent (same package manager as repo; no secrets in Dockerfile/k8s).
3. PR small and focused; the consistent structure makes review fast.

## The decision: mock or wait?
If the backend endpoint isn't ready, DON'T block and DON'T hardcode a fake in your code. Agree on the
response contract with backend, mock it with MSW (`fe-mocking`), build the full feature, and flip the
env flag when the real endpoint lands. You develop in parallel without fake code leaking.

## Rules
- No coding before you know the goal and the data contract.
- Always three layers; always the four states; always types first.
- Mock with MSW, never hardcode fakes in app code.
- Verify (tsc + tests + review) before shipping.
