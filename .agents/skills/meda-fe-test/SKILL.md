---
name: meda-fe-test
description: >
  Command to generate or improve tests for MEDA frontend code using Vitest + Testing Library,
  following the fe-testing standard (money, validators, transaction states, forms, four UI states).
  Invoke when the user asks to write tests, add coverage, or test a component/hook/utility. Triggers
  on "write tests", "add tests", "test this", "meda-fe-test", "genera pruebas", "agrega tests".
---
# /meda-fe-test — generate tests

Generate real, runnable tests for the target code. Load `fe-testing` for the standard.

## Steps
1. Read the target (component, hook, or utility) and identify what carries risk:
   money/formatting, validators, state logic, forms, data-driven UI.
2. Generate a `*.test.ts(x)` file next to it using Vitest + Testing Library.
3. Cover, in priority order: money/rounding edge cases → validators (valid + invalid) → transaction
   state mapping → form valid/invalid submit → the four UI states (mock the hook/query).
4. Mock external calls (the API client, TanStack). Don't hit real endpoints.
5. Use real assertions on behavior the user sees, not implementation details.

## Fintech must-cover (don't skip)
- Amounts: zero, negative, large, fractional cents — formatting never loses/adds a cent.
- Validators: RFC/CURP/CLABE/phone with valid and boundary-invalid inputs.
- Transaction status → correct UI (badge/variant).
- Forms: invalid input does NOT call the submit handler; valid input calls it with the right shape.

## Output
- The test file(s), runnable with `pnpm test` (Vitest).
- If Vitest isn't set up, note the deps to add (exact versions): vitest, @testing-library/react,
  @testing-library/user-event, jsdom — and a minimal vitest.config.ts.

## Example — tests for the balance feature (service + hook + component)

```ts
// src/lib/utils/format.test.ts — money is the highest-risk thing to test
import { describe, it, expect } from "vitest";
import { formatCurrency } from "@/lib/utils/format";

describe("formatCurrency", () => {
  it("formats MXN with two decimals", () => expect(formatCurrency(1234.5)).toBe("$1,234.50"));
  it("handles zero", () => expect(formatCurrency(0)).toBe("$0.00"));
  it("handles negatives", () => expect(formatCurrency(-50)).toBe("-$50.00"));
});
```

```tsx
// src/features/account/components/BalancePanel.test.tsx — the four states
import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { BalancePanel } from "./BalancePanel";
import * as hook from "../hooks/useBalance";

describe("BalancePanel", () => {
  it("shows a spinner while loading", () => {
    vi.spyOn(hook, "useBalance").mockReturnValue({ isLoading: true } as any);
    render(<BalancePanel />);
    expect(screen.getByRole("status")).toBeInTheDocument();  // Spinner has role="status"
  });
  it("shows retry on error", () => {
    vi.spyOn(hook, "useBalance").mockReturnValue({ isError: true, refetch: vi.fn() } as any);
    render(<BalancePanel />);
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });
  it("renders the balance on success", () => {
    vi.spyOn(hook, "useBalance").mockReturnValue({ data: { available: 5000, currency: "MXN" } } as any);
    render(<BalancePanel />);
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
  });
});
```

Why these: the money formatter is tested with edge cases (a wrong cent = a real bug); the component is
tested by mocking the hook to drive each of the four states. We don't test TanStack's internals.
