---
name: fe-project-structure
description: >
  MEDA frontend standard: Next.js 16 App Router folder structure, file conventions, and feature
  organization. UNIVERSAL frontend skill: applies to any frontend change. Triggers on project
  structure, folder layout, where to put files, app directory, feature organization / "estructura",
  "carpetas", "dónde va este archivo".
---
# Frontend Project Structure (Next.js 16 App Router)

## Folder layout
```
src/
├── app/                    # App Router: routes, layouts, pages
│   ├── (public)/           # route groups: public routes
│   ├── (private)/          # route groups: auth-guarded routes
│   ├── layout.tsx          # root layout
│   ├── loading.tsx         # global loading UI
│   └── error.tsx           # global error boundary
├── components/
│   ├── ui/                 # MEDA UI primitives (Button, Input, Card...)
│   └── shared/             # shared composite components
├── features/               # feature-based modules (each: components, hooks, api, types)
│   └── payments/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── types/
├── lib/                    # api client, utils, config
│   └── api/                # API client + per-service functions
├── hooks/                  # global reusable hooks
├── stores/                 # Zustand stores (or store/ for Redux)
├── types/                  # shared TS types
└── styles/                 # global styles, tokens
```

## Conventions
- **Feature-first**: code that changes together lives together (components+hooks+api+types per feature).
- Route files: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- `'use client'` only at the top of files that truly need client interactivity (see `fe-components`).
- Barrel `index.ts` per feature for clean imports; avoid deep relative paths.
- One component per file; PascalCase filenames for components, camelCase for hooks (`useX`).

## Rules
- Don't dump everything in `app/`. Routes in `app/`, logic in `features/` and `lib/`.
- Shared only when used by 2+ features; otherwise keep it in the feature.
- pnpm workspace if it grows to multiple packages.

## Routing & navigation (App Router) — structure of routes
- Route groups: `(public)` and `(private)` to separate guarded routes without affecting the URL.
- Each segment can have: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Dynamic segments: `[id]`; catch-all `[...slug]`. In Next 16, route params and `cookies()`/`headers()`
  are async — await them.
- `<Link>` for navigation (auto-prefetch); `useRouter()` for programmatic nav (client). Shared UI in
  layouts (don't re-render across child routes).
- Auth guard in `middleware.ts` (redirect unauthenticated from private paths) AND verify on the server
  — never trust the client alone. Use `loading.tsx`/`error.tsx` per segment for streaming + boundaries.
