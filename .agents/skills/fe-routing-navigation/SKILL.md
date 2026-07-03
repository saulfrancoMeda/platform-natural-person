---
name: fe-routing-navigation
description: >
  MEDA frontend standard: Next.js App Router routing — layouts, public/private route groups, dynamic
  params, middleware, loading/error files, navigation. Use whenever adding routes, layouts, or
  navigation. Triggers on routing, route, layout, middleware, navigation, dynamic params, page /
  "rutas", "navegación", "layout", "middleware".
---
# Routing & Navigation (App Router)

## Structure
- Route groups: `(public)` and `(private)` to separate guarded routes without affecting the URL.
- Each route segment can have: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Dynamic segments: `[id]`; catch-all `[...slug]`. In Next 16, route params and `cookies()`/`headers()`
  are async — await them.

## Navigation
- `<Link>` for navigation (prefetches automatically). `useRouter()` for programmatic nav (client).
- Shared UI in layouts (don't re-render across child routes).

## Middleware (auth guard)
```typescript
// middleware.ts
export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth-token');
  if (!token && req.nextUrl.pathname.startsWith('/dashboard'))
    return NextResponse.redirect(new URL('/login', req.url));
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };
```

## Rules
- Guard private routes in middleware AND verify on the server; never trust the client alone.
- Use `loading.tsx`/`error.tsx` per segment for good UX (streaming + boundaries).
- Don't fetch protected data in a Client Component without an auth check.
