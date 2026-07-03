---
name: fe-migration
description: >
  How to migrate a legacy MEDA frontend to the current standard: JavaScript→TypeScript (adding types)
  and old/ad-hoc styles→MEDA UI (the Binance-style design system with tokens + components). Use when
  the user asks to migrate, modernize, convert, or "pasar a TS" / "adoptar MEDA UI" on an existing
  project or screen. Triggers on migrate, migration, convert, modernize, legacy, JS to TS, TypeScript
  migration / "migrar", "modernizar", "convertir a TS", "proyecto viejo".
---
# Migrating a legacy frontend to the MEDA standard

Two independent tracks. Migrate INCREMENTALLY — file by file, screen by screen — keeping the app
shippable at every step. Never rewrite the whole app in one pass. Full details in docs/migration.md.

## Track A — JavaScript → TypeScript
1. Add TS tooling with `allowJs: true` + `strict: false` so .js and .ts coexist (nothing breaks day one).
2. Rename one file at a time (.js→.ts/.tsx), fix that file's errors, commit, next.
3. Type the obvious first: component props → interface; API responses from the contract (fe-api-client);
   remove `any` as you go (a temporary `any` with `// TODO: type` is acceptable to keep moving).
4. Order: utilities → API layer → hooks → components → pages (leaf-first; each file depends only on
   already-typed files).
5. Finish line: flip `strict: true`, fix nullables, remove `allowJs` when no .js remains.

## Track B — Old styles → MEDA UI (Binance design)
1. `meda-fe add all` to bring components/tokens/icons into the repo; wire meda-tokens.css at the top
   of global CSS.
2. Replace, don't rewrite: old `<button class="btn">` → `<Button>`, custom modal → `<Dialog>`,
   hand-made dropdown → `<DropdownMenu>`, etc.
3. Replace hardcoded colors with tokens — this is what makes dark mode work and aligns to Binance:
   `#fff`/`#000` → `bg-surface`/`text-fg`, brand hex → `bg-brand`, green/red prices → `text-price-up`/
   `text-price-down`. NEVER leave hardcoded hex.
4. Apply Binance sizing as you touch each component (fe-meda-ui): h-10 controls, rounded-control 4px,
   rounded-meda 8px cards, text-sm inputs.
5. Verify per screen: compiles, correct in BOTH dark and light, keyboard works. Commit. Next screen.

## Doing both on one screen
Sequence: type it (A) → restyle it (B) → verify → commit. One screen at a time.

## Rules
- Incremental only. Each commit leaves the app working. No big-bang rewrites.
- Don't mix old CSS and MEDA tokens on the same element (half-themed, breaks in dark).
- Don't keep hardcoded hex "for now" — it's exactly what breaks dark mode.
- Migrate what you're already touching + a planned screen-by-screen pass; don't churn working screens
  with no reason.
- Reuse existing MEDA UI components; if a primitive is missing, add it to components/ui/ in MEDA style.
