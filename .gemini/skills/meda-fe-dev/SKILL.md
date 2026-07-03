---
name: meda-fe-dev
description: >
  Use for any MEDA FRONTEND development task: create/scaffold a new Next.js/TypeScript app, set up or
  unify an existing frontend repo, build components or pages, integrate an API/endpoint into the UI,
  manage state, style with Tailwind, write frontend tests, or review frontend code. Triggers on
  "create a frontend", "new next app", "build a component", "integrate this endpoint", "consume the
  API", "set up the project", "review this component" / "crea un front", "nueva app next", "integra
  este endpoint", "consume la API", "componente". Entry point that routes to the right MEDA frontend
  skills. Reply in the user's language.
---

# MEDA Frontend Dev — Entry point / router

Routes MEDA frontend work. The developer writes naturally (EN/ES); you apply MEDA frontend
standards even if unmentioned. **Reply in the user's language.**

## Stack (MEDA frontend baseline)
- Next.js 16 (App Router), TypeScript, React 19.
- Package manager: **pnpm**.
- Styling: Tailwind CSS + MEDA UI design tokens.
- State: **Zustand by default** (small/medium); **Redux Toolkit** when global state is complex
  (large app, many cross-feature slices, time-travel/devtools needs). See `fe-state-management`.
- Data fetching: **TanStack Query + Server Components** recommended baseline; SWR / RTK Query / pure
  Server Components are valid alternatives per project. See `fe-data-fetching`.

## STEP 1 — Classify and route (load 1-4 skills, never all 15; no subagents)
- **New app** → `/meda-fe-new` (interactive: asks project type, state mgmt, data fetching, auth, API).
- **Existing repo (unify)** → `/meda-fe-init` (detects what exists, proposes what to unify).
- **New component** → `/meda-fe-component` (+ `fe-components`, `fe-styling-tailwind`, `fe-quality`).
- **Integrate an endpoint (most common)** → `/meda-fe-endpoint` (+ `fe-api-client`, `fe-data-fetching`).
- **New page/route** → `fe-project-structure` + `fe-components`.
- **Tests** → `/meda-fe-test`.
- **Review** → `/meda-fe-review`.

## STEP 2 — Always-on conventions
Start any task by following `fe-dev-process` (the phases: understand → plan → build → verify → ship).
When the backend endpoint isn't ready, use `fe-mocking` (MSW) instead of hardcoding fakes.
When migrating a legacy project (JS→TS or old styles→MEDA UI), follow `fe-migration`.
Apply `fe-react-principles` (SRP, DRY, separation of concerns, edge cases), `fe-project-structure`,
`fe-prohibited-practices`, `fe-security`, `fe-security` (incl. supply-chain + devops) as the baseline for any
change. Detect the repo's real choices (Zustand vs Redux, TanStack vs SWR) and follow them; don't
impose a different one without reason.

## STEP 3 — Cost hygiene
Load few skills. No subagents for what fits in the thread. Long tasks → /compact.

## /meda-fe-* commands
- `/meda-fe-new` — scaffold a new Next.js app (interactive).
- `/meda-fe-init` — unify an existing frontend repo.
- `/meda-fe-component` — build a component under standards.
- `/meda-fe-endpoint` — integrate a Java API endpoint into the UI (types + client + hook).
- `/meda-fe-review` — review frontend code against standards.
- `/meda-fe-test` — generate frontend tests.
