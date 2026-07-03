---
name: fe-testing
description: >
  MEDA frontend testing standard with Vitest + Testing Library, focused on fintech-critical cases:
  money amounts, rounding, currency formatting, transaction states, form validation (RFC/CURP/CLABE),
  and the four UI states. Use when writing or reviewing tests, or when asked to add test coverage.
  Triggers on test, testing, Vitest, unit test, coverage, spec, assertion / "prueba", "test",
  "cobertura", "pruebas unitarias".
---
# Frontend Testing (Vitest + Testing Library) — fintech focus

Test behavior, not implementation. In fintech, the highest-value tests cover money, state, and
validation — where a bug means wrong amounts or a blocked user.

## Stack
- **Vitest** (runner) + **@testing-library/react** (component testing) + **@testing-library/user-event**.
- Test files next to the code: `Component.test.tsx`, `useHook.test.ts`, `format.test.ts`.

## What to test (priority for fintech)
1. **Money & formatting** — the highest risk. Test `formatCurrency`, rounding, and edge values:
   - zero, negative, very large amounts, fractional cents, different currencies.
   - `expect(formatCurrency(1234.5)).toBe("$1,234.50")` — never lose or add a cent.
2. **Validators** — RFC, CURP, CLABE, phone. Test valid AND invalid inputs, boundary lengths.
3. **Transaction/state logic** — a status mapping (SUCCESS/PROCESSING/FAILED) renders the right badge;
   a state machine transitions correctly; an idempotent action doesn't double-apply.
4. **Forms** — required fields show errors; valid submit calls the handler with the right shape;
   invalid submit does NOT call it. (RHF + Zod.)
5. **The four UI states** — loading shows a spinner, error shows a message + retry, empty shows the
   empty copy, success renders data. Mock the hook/query to drive each.
6. **Hooks** — `renderHook` for custom hooks (pagination, debounce): correct state transitions.

## What NOT to over-test
- Don't test third-party libs (TanStack, RHF internals). Don't snapshot huge trees (brittle).
- Don't test exact class names. Test what the user sees/does.

## Example — money (the test that matters most)
```ts
import { formatCurrency } from "@/lib/utils/format";
describe("formatCurrency", () => {
  it("formats MXN with two decimals", () => expect(formatCurrency(1234.5)).toBe("$1,234.50"));
  it("handles zero", () => expect(formatCurrency(0)).toBe("$0.00"));
  it("handles negatives", () => expect(formatCurrency(-50)).toBe("-$50.00"));
  it("rounds fractional cents", () => expect(formatCurrency(1.005)).toBe("$1.01"));
});
```

## Example — component four states
```tsx
it("shows error + retry when the query fails", () => {
  vi.mocked(useTransactions).mockReturnValue({ isError: true } as any);
  render(<TransactionList />);
  expect(screen.getByText(/couldn't load/i)).toBeInTheDocument();
});
```

## Rules
- Every money/validator utility has tests covering edge cases (zero, negative, boundary).
- Every data-driven component tests the four states.
- Forms test both valid and invalid submit paths.
- Coverage target is meaningful coverage of logic, not a vanity %.
