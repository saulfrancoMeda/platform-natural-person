---
name: fe-auth
description: >
  MEDA frontend standard: session/token handling, route guards, token refresh, and integration with
  MEDA auth. Use whenever implementing login, protected routes, or session management. Triggers on
  auth, login, session, token, route guard, protected route, refresh / "autenticación", "login",
  "sesión", "token", "ruta protegida".
---
# Authentication

## Token handling (security-first)
- Prefer **httpOnly cookies** for tokens (not localStorage) — protects against XSS reading the token.
  If the architecture requires client access, store with care and short TTL (see `fe-security`).
- The API client attaches the token; components never read it directly.
- Refresh: handle 401/expired by refreshing once, then retry; on failure, redirect to login.

## Route guard
- Middleware checks the token for `(private)` routes (see `fe-project-structure`).
- Server-side verification on protected pages — never rely on client-only checks.
- A client `useAuth()` hook (backed by a Zustand store or context) exposes `user`/`isAuthenticated`
  for UI, but is NOT the security boundary.

## Rules
- Tokens out of localStorage when possible; never in code or logs.
- Guard on the server; client guard is UX only.
- On logout, clear session everywhere (cookie, store, query cache).
