---
name: meda-fe-init
description: >
  Use to set up, unify, align, or standardize an EXISTING frontend repo to MEDA standards. Triggers
  on "unify this repo", "align to our standards", "set up MEDA in this project", "standardize the
  frontend" / "unifica este repo", "alinea a los estándares", "configura MEDA aquí". Detects what the
  repo already has and proposes only what's missing — never overwrites without showing a diff. NOT
  for new apps (use meda-fe-new). Reply in the user's language.
---

# /meda-fe-init — Unify an existing frontend repo

Align an existing repo to MEDA standards without breaking it. **Reply in the user's language.**

## STEP 1 — Detect what exists (report it)
Inspect package.json and the tree:
- Framework/version (Next.js? version? App or Pages Router?).
- Package manager (pnpm/npm/yarn) — MEDA prefers pnpm.
- Tailwind present? ESLint/Prettier config?
- State management present (Zustand/Redux/none)?
- Data fetching (TanStack/SWR/none)?
- Folder structure vs MEDA standard.
- API client to MEDA Java APIs present?

Print a checklist: ✓ present / ✗ missing-or-divergent.

## STEP 2 — Ask what to unify (only the divergent items)
Offer a multi-select: structure, ESLint+Prettier, state management, API client, MEDA UI, testing
setup. Let the developer pick. Default to non-destructive.

## STEP 3 — Apply, showing diffs for anything risky
- Additive changes (new files, new deps) → apply directly.
- Structural changes (moving folders, renaming) → SHOW the plan/diff first, confirm, then apply.
- Never overwrite an existing config without backup or explicit confirmation.

## Rules
- Detect, don't assume. Respect existing choices (if they use SWR, don't force TanStack).
- Reorganizing files is opt-in and always shown before applying.
- Report what was changed and what was intentionally left as-is.
