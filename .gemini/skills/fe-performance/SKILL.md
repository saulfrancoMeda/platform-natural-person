---
name: fe-performance
description: >
  MEDA frontend standard: performance — lazy loading, code splitting, image optimization,
  memoization, bundle size, Core Web Vitals. Use whenever performance matters or for review.
  Triggers on performance, lazy load, code splitting, bundle size, memo, web vitals, optimize /
  "rendimiento", "performance", "lazy", "bundle", "optimizar".
---
# Performance

## Server-first (biggest win in App Router)
- Keep components as Server Components when possible — zero client JS. Push `'use client'` to leaves.
- Fetch on the server for initial data; stream with Suspense/`loading.tsx`.

## Client-side
- **Code splitting**: `next/dynamic` for heavy client-only components (charts, editors).
- **Images**: `next/image` (sizing, lazy, modern formats).
- **Memoization**: with React Compiler stable in Next 16, manual `useMemo`/`memo` is rarely needed;
  don't over-memoize. Profile before optimizing.
- **Bundle**: watch imports (don't import a whole lib for one function); use the bundle analyzer.

## Core Web Vitals
- Mind LCP (server render + image priority), CLS (reserve space for images/ads), INP (avoid heavy
  client work on interaction).

## Rules
- Don't make everything a Client Component (ships JS, hurts LCP/INP).
- Don't pre-optimize; measure first. But do lazy-load obviously heavy client components.
