---
name: fe-prohibited-practices
description: >
  MEDA frontend standard: prohibited practices that are P0 defects blocking merge. UNIVERSAL skill,
  verified at implementation and review. Triggers on prohibited, P0, forbidden, anti-pattern, bad
  practice / "prohibido", "P0", "antipatrón", "mala práctica".
---
# Frontend Prohibited Practices (P0)

| # | Prohibited | Reason |
|---|---|---|
| 1 | `any` in TypeScript (or `@ts-ignore` to hide errors) | Defeats type safety; hides bugs |
| 2 | Secrets / API keys in client code or NEXT_PUBLIC_* | Shipped to the browser = leak |
| 3 | Tokens/PII in localStorage or in logs | XSS-readable / compliance red line |
| 4 | `dangerouslySetInnerHTML` with untrusted data | XSS |
| 5 | fetch/mutation without error handling | Silent failures, broken UX |
| 6 | Not handling status:"ERROR" from MEDA APIs | Treats failures as success |
| 7 | Everything as a Client Component | Ships unnecessary JS, hurts perf |
| 8 | Server data stored in a global store (Zustand/Redux) | Stale data, duplicate source of truth |
| 9 | Clickable `<div>`/`<span>` instead of `<button>` | Breaks a11y/keyboard |
| 10 | Magic hex/arbitrary Tailwind values instead of tokens | Inconsistent UI, unmaintainable |
| 11 | Both Redux and Zustand in the same app | Two sources of truth, confusion |
| 12 | Inline business logic in presentational components | Untestable, not reusable |
| 13 | Swallowing errors / unhandled promise rejections | Impossible to debug |
| 14 | Missing loading/error/empty states on data UI | Broken UX on failure |
| 15 | Untyped API responses (no interface mirroring the contract) | Runtime errors, no safety |

## Verification
- At implementation: self-check all 15.
- At review (`meda-fe-review`): re-verify independently. Any ✘ = P0 = blocked.
