---
name: fe-state-management
description: >
  MEDA frontend standard: when to use Zustand vs Redux Toolkit, how to structure stores, and avoiding
  unnecessary global state. Use whenever there is shared/global state or a store decision. Triggers
  on state management, store, zustand, redux, global state, context / "estado global", "store",
  "zustand", "redux".
---
# State Management (Zustand vs Redux — the rule)

## The decision rule
**Default: Zustand** (small/medium apps, simple shared state, few slices).
**Redux Toolkit** when: complex global state, many cross-feature slices, strict action/event
traceability, heavy DevTools/time-travel needs, or a large team needing rigid structure.

If unsure: start with Zustand; migrate to Redux only when the complexity genuinely demands it.
Don't use BOTH in the same app (pick one). The router/`meda-fe-new` asks this at setup.

## What does NOT belong in global state
- Server data → use TanStack Query/SWR cache, NOT a store (see `fe-data-fetching`).
- Local UI state (open/closed, input value) → useState in the component.
- Derived values → compute, don't store.

## Zustand structure
```typescript
// stores/useAuthStore.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```
- One store per domain; selectors to avoid re-renders; keep actions inside the store.

## Redux Toolkit structure
- `createSlice` per domain; typed `RootState`/`AppDispatch`; RTK Query optional for data.
- Configure store once in `lib/store`; provider at root.

## Rules
- Global state is a last resort, not the default. Prefer local + server cache.
- Never store server data you can refetch in a global store.
