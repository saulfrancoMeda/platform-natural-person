---
name: meda-fe-endpoint
description: >
  Use to integrate a backend API endpoint into the MEDA frontend: consume a MEDA Java service,
  generate TypeScript types, an API client function, and a TanStack Query/SWR hook. Triggers on
  "integrate this endpoint", "consume the API", "connect to the payment service", "call this
  endpoint", "wire up the API" / "integra este endpoint", "consume la API", "conecta el servicio".
  This is the most common frontend task. Reply in the user's language.
---

# /meda-fe-endpoint — Integrate a Java API endpoint into the UI

Turn a MEDA Java endpoint into typed TS client + hook, ready to use in components.
**Reply in the user's language.** Loads `fe-api-client` + `fe-data-fetching`.

## STEP 1 — Get the contract (in priority order)
1. **OpenAPI/Swagger spec or Postman collection** (preferred): if the dev provides a URL/file, parse
   it and extract the path, method, request and response shapes. This is the team's source of truth.
2. **Java repo available**: read the Feign interface + Request/Response VOs to mirror them.
3. **Manual**: if neither is available, ask the dev for: method, path, request fields, response fields.

Remember MEDA's convention: internal RPC is POST+JSON, wrapped in APIRequest<T>/APIResponse<T>, and
**business errors return HTTP 200 with status:"ERROR"** — the client must check `status`, not just
the HTTP code. Response VO fields are strings.

## STEP 2 — Generate the three layers
1. **Types** (mirror the Java contract; response fields as string when the VO uses String):
```typescript
// types/payment.ts
export interface CreatePaymentRequest { merchantId: string; merchantOrderNo: string; amount: number; currency: string; }
export interface CreatePaymentResponse { paymentNo: string; status: string; }
```
2. **API client function** (handles the APIResponse envelope and status:"ERROR"):
```typescript
// lib/api/payment.ts
export async function createPayment(body: CreatePaymentRequest): Promise<CreatePaymentResponse> {
  const res = await apiClient.post<APIResponse<CreatePaymentResponse>>('/payment/order/v1/create', { merchantId, body });
  if (res.status === 'ERROR') throw new MedaApiError(res.errorCode, res.errorMessage);
  return res.data;
}
```
3. **Hook** (TanStack Query by default; mutation for writes, query for reads):
```typescript
// hooks/usePayment.ts
export function useCreatePayment() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createPayment, onSuccess: () => qc.invalidateQueries({ queryKey: ['payments'] }) });
}
```

## STEP 3 — Show usage and wire error/loading
- Show a minimal component example using the hook, with loading and error states wired to the
  project's error handling (`fe-data-fetching`).
- For reads, set sensible queryKey + staleTime. For writes, invalidate affected queries.

## Rules
- Always handle status:"ERROR" — never assume HTTP 200 means success in MEDA.
- Type everything; no `any` (that's a prohibited practice).
- If the repo uses SWR instead of TanStack, generate the SWR equivalent — don't force TanStack.
- Keep secrets/tokens out of client code; the API client attaches auth per `fe-auth`/`fe-security`.

## When the endpoint isn't ready yet
If the backend hasn't delivered the endpoint, don't hardcode a fake. Set up an MSW handler for the
agreed contract (see `fe-mocking`), build the full TS types + client + hook against it, and flip the
env flag to use the real endpoint when it lands. No fake code to remove later.

## Example — "integrate GET /account/v1/balance"

The full three-layer output any dev should produce. The component asks the hook; the hook asks the
service; the service handles the MEDA APIResponse envelope.

```ts
// 1. src/lib/api/account.ts — the service (handles the envelope + types)
import { get } from "@/lib/api/client";

export interface Balance { available: number; pending: number; currency: string; }

export function getBalance(): Promise<Balance> {
  return get<Balance>("/account/v1/balance");   // unwraps APIResponse, throws MedaApiError on status:ERROR
}
```

```ts
// 2. src/features/account/hooks/useBalance.ts — the logic (state, cache, edge cases)
import { useQuery } from "@tanstack/react-query";
import { getBalance } from "@/lib/api/account";

export function useBalance() {
  return useQuery({ queryKey: ["balance"], queryFn: getBalance, staleTime: 30_000 });
}
```

```tsx
// 3. src/features/account/components/BalancePanel.tsx — presentational, four states
"use client";
import { useBalance } from "../hooks/useBalance";
import { BalanceCard } from "./BalanceCard";
import { Spinner } from "@/components/ui/spinner";

export function BalancePanel() {
  const { data, isLoading, isError, refetch } = useBalance();
  if (isLoading) return <Spinner />;
  if (isError) return <button onClick={() => refetch()} className="text-error">Couldn't load. Retry</button>;
  if (!data) return <p className="text-fg-secondary">No balance available.</p>;
  return <BalanceCard available={data.available} currency={data.currency} />;
}
```

Why: each file one responsibility (SRP), types from the contract (no `any`), the envelope handled in
the client (status:ERROR → MedaApiError → caught as isError), all four states covered. When the
endpoint isn't ready, mock it first (see `fe-mocking`) — the three layers don't change.
