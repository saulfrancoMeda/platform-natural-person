---
name: meda-fe-new
description: >
  Use to create, scaffold, bootstrap, or start a NEW MEDA frontend app (Next.js + TypeScript).
  Triggers on "create a frontend app", "new next project", "scaffold a dashboard", "start a new UI" /
  "crea un front nuevo", "nuevo proyecto next", "arma un dashboard". Runs an INTERACTIVE setup that
  asks the architecture decisions before generating. NOT for existing repos (use meda-fe-init).
  Reply in the user's language.
---

# /meda-fe-new — New frontend app (interactive)

Create a new MEDA frontend app. **Ask the architecture questions first, then generate only what was
chosen.** Reply in the user's language.

## STEP 1 — Interactive setup (ask these, one block; accept natural answers)
1. **Project type:** Full app (dashboard/portal with auth & private routes) · Landing/marketing ·
   Internal component library.
2. **State management:** Zustand (recommended for small/medium) · Redux Toolkit (complex global) ·
   None for now. (If unsure, recommend by size — see `fe-state-management`.)
3. **Data fetching:** TanStack Query + Server Components (recommended) · Server Components only · SWR.
4. **Include MEDA UI base components?** Yes / No.
5. **Authentication?** Yes (with route guard) / No.
6. **Connect to MEDA Java APIs?** Yes (generate API client) / No.

If the developer already gave some answers in their prompt, don't re-ask those; confirm and proceed.

## STEP 2 — Generate per answers (load the matching skill for each piece)
- Base: Next.js 16 App Router + TS + pnpm + Tailwind → `fe-project-structure`, `fe-styling-tailwind`.
  Scripts use Turbopack (default in Next 16).
- State: scaffold Zustand store OR Redux Toolkit store per choice → `fe-state-management`.
- Data: set up TanStack Query provider OR SWR OR plain RSC → `fe-data-fetching`.
- API client: if "connect to MEDA APIs" → `fe-api-client` (base client + APIResponse handling).
- Auth: if yes → `fe-auth` (session, route guard, middleware).
- MEDA UI: if yes → install base tokens + a starter set of components.
- Always: `fe-data-fetching` (error.tsx/loading.tsx), `fe-prohibited-practices`, `fe-security`.

## STEP 3 — Deliver
- Runnable app (`pnpm dev`).
- Folder structure per `fe-project-structure`.
- A short README: what was set up, how to run, where to add features.
- Summary table of the choices made.

## Rules
- Generate ONLY what was chosen. No auth code if they said no. No Redux if they chose Zustand.
- pnpm always. Next 16 App Router always (not Pages Router for new apps).
- Don't load all 15 skills; load the one per piece.
