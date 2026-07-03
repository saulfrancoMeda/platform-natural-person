---
name: fe-mocking
description: >
  MEDA standard for API mocking with MSW (Mock Service Worker) when the backend hasn't delivered an
  endpoint yet. Mocks at the NETWORK layer (not hardcoded in app code) and is controlled by an env
  var, so switching from fake to real endpoint is flipping a flag — never editing production code. Use
  when an endpoint isn't ready, when building against a contract, or setting up dev/test mocks.
  Triggers on mock, MSW, fake endpoint, stub, backend not ready, handler, mockServiceWorker /
  "mock", "endpoint falso", "simular API", "backend no listo".
---
# API Mocking with MSW (Mock Service Worker)

> The pain this solves: hardcoding a fake response inside your component/service means you later have
> to FIND and REMOVE it to use the real endpoint — error-prone, and fake code leaks to production.
> MSW intercepts at the network layer, lives OUTSIDE your app code, and is toggled by an env var.
> Your app code calls the real endpoint URL the whole time; MSW just answers it in dev when enabled.

## Why MSW (not a hardcoded JSON or a fake fetch)
- Your `lib/api` code never changes — it always calls the real path. No `if (fake) return {...}`.
- One env var turns mocking on/off. To go live: set the flag to false. Nothing to delete in code.
- Same handlers work in the browser (dev) and in tests (Vitest) — single source of truth.
- You see mocked responses in DevTools Network like real requests.

## Setup (Next.js App Router)
1. Install (exact version): `pnpm add -E -D msw` then `npx msw init public/ --save` (creates
   `public/mockServiceWorker.js` — auto-generated, don't edit).
2. Structure under `src/mocks/`:
   - `handlers/` — one file per domain (e.g. `transactions.ts`, `auth.ts`) + an `index.ts` barrel.
   - `browser.ts` — `setupWorker(...handlers)`.
   - `server.ts` — `setupServer(...handlers)` (for RSC/tests).
3. Control by env var (NEVER on in production):
   `NEXT_PUBLIC_ENABLE_MSW=true` only in `.env.development`/`.env.test`. A helper `isMSWEnabled()`
   returns false unless that flag is true AND not production.
4. A client `MSWProvider` defers rendering until the worker is ready (avoids race conditions).

## Handler example (matches MEDA APIResponse envelope)
```ts
// src/mocks/handlers/transactions.ts
import { http, HttpResponse } from "msw";
const BASE = process.env.NEXT_PUBLIC_API_URI_BASE;
export const transactionHandlers = [
  http.get(`${BASE}/transaction/v1/list`, () =>
    HttpResponse.json({
      status: "OK", errorCode: null, errorMessage: null,
      data: [{ orderNo: "ORD-1001", amount: 10000, status: "SUCCESS", date: "2026-06-22T10:00:00" }],
    })
  ),
];
```
Mock the SAME shape the backend will return (the APIResponse envelope), so when the real endpoint
arrives, your hook/component already handles it correctly. You can also mock errors and latency:
```ts
http.post(`${BASE}/transaction/v1/create`, async () => {
  await delay(800);                                   // simulate latency
  return HttpResponse.json({ status: "ERROR", errorCode: "330001", errorMessage: "Insufficient funds", data: null });
});
```

## Switching fake → real (the whole point)
1. Backend delivers the endpoint.
2. Set `NEXT_PUBLIC_ENABLE_MSW=false` (or remove that handler).
3. Done. Your `lib/api` and components never referenced the mock — nothing to clean up.

## Rules
- MSW is dev/test only. NEVER enable in production (guard with env + NODE_ENV check).
- Mock the real APIResponse envelope + real endpoint URL, not a simplified shape.
- Mocks live in `src/mocks/`, never inside `lib/api` or components.
- Commit `public/mockServiceWorker.js` (it's the generated worker).
- Keep handlers per domain; reuse the same handlers for tests (see fe-testing).
- Use `onUnhandledRequest: "bypass"` so un-mocked endpoints hit the real backend (partial mocking).

## Full example — develop a feature whose endpoint doesn't exist yet

Backend hasn't built `GET /account/v1/movements`. You agree the contract, mock it, and build the whole
feature. When the real endpoint lands, you flip one flag — nothing in your app code changes.

```ts
// src/mocks/handlers/movements.ts — the mock (OUTSIDE app code)
import { http, HttpResponse, delay } from "msw";
const BASE = process.env.NEXT_PUBLIC_API_URI_BASE;

export const movementHandlers = [
  http.get(`${BASE}/account/v1/movements`, async () => {
    await delay(400);                              // simulate latency so you test the loading state
    return HttpResponse.json({
      status: "OK", errorCode: null, errorMessage: null,
      data: [
        { id: "MOV-1", amount: 1500, type: "DEPOSIT", date: "2026-06-22T09:00:00" },
        { id: "MOV-2", amount: -320, type: "WITHDRAWAL", date: "2026-06-22T14:30:00" },
      ],
    });
  }),
];
```

```ts
// src/mocks/handlers/index.ts — register it
import { movementHandlers } from "./movements";
export const handlers = [...movementHandlers];
```

```ts
// src/lib/api/account.ts — your REAL service. Note: it calls the real path, knows nothing about MSW.
import { get } from "@/lib/api/client";
export interface Movement { id: string; amount: number; type: string; date: string; }
export const getMovements = () => get<Movement[]>("/account/v1/movements");
```

Now build the hook + component normally (see `meda-fe-endpoint`). In dev, with
`NEXT_PUBLIC_ENABLE_MSW=true`, MSW answers the request. You can develop and test all four states
(including the latency-driven loading and an error variant if you add one).

**When the real endpoint ships:** set `NEXT_PUBLIC_ENABLE_MSW=false` (or remove the handler). Your
`getMovements`, hook, and component are untouched — the mock never lived in them. That's the whole
point: no fake code to find and delete.

## Also use the handlers in tests
The same `handlers` work in Vitest via `setupServer` (see `fe-testing`), so your tests run against the
agreed contract without hitting a real backend.
