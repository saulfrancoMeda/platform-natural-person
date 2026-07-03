---
name: fe-components
description: >
  MEDA frontend standard: Server vs Client Components, composition, typed props, and when to use
  'use client'. Use whenever building or modifying React components. Triggers on component, server
  component, client component, use client, props, composition / "componente", "use client", "props".
---
# Components (Server/Client, composition, typing)

## Server vs Client (Next 16 App Router)
- **Default: Server Component.** No `'use client'`. Can fetch data, runs on server, zero JS to client.
- **Client Component** (`'use client'` at top) only when it needs: useState/useReducer, useEffect,
  event handlers (onClick...), browser APIs, or client-only libraries.
- Push `'use client'` to the leaves: keep pages/layouts as Server Components; make only the
  interactive piece a Client Component.

## Typing
- Explicit prop interfaces; no `any`. Default values for optional props.
- Discriminated unions for variant props (e.g. `variant: 'primary' | 'secondary'`).

## Composition
- Prefer composition (children, slots) over giant config objects.
- Presentational components receive data via props; data fetching lives in hooks/Server Components.
- Extract repeated markup into MEDA UI primitives or shared components.

## Rules
- Don't make everything a Client Component — it ships more JS and hurts performance.
- No business logic inside presentational components.
- Co-locate the component with its test and types (see `fe-project-structure`).
