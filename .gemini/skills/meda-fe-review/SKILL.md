---
name: meda-fe-review
description: >
  Use to review or audit MEDA frontend code (a PR or a component/page) against the frontend
  standards. Triggers on "review this component", "audit the frontend", "does this follow our FE
  standards", "check this PR" / "revisa este componente", "audita el front", "checa si cumple".
  Produces a findings report with file:line and severity. Does NOT implement changes. Reply in the
  user's language.
---

# /meda-fe-review — Frontend code review

Audit frontend code against MEDA standards. Report only, no implementation.
**Reply in the user's language.**

## Checklist (load the skills the code touches)
- **Principles (`fe-react-principles`):** SRP (one responsibility per component/hook); logic in
  custom hooks not inline; separation of concerns (presentational vs hook vs service); no premature
  abstraction; DRY where it pays. Flag a component that fetches + computes + renders all inline.
- **Edge cases:** loading/error/empty states present; race conditions handled; debounce on search.
- **DevOps security (`fe-security`):** no plaintext secrets in Dockerfile/k8s/CI (P0, rotate);
  no NEXT_PUBLIC_ on secrets; no env vars echoed in build logs; package manager in deploy matches the
  repo (flag mismatch + explain reproducibility risk, don't auto-change); /health doesn't leak config.
- **Components (`fe-components`):** Server/Client used correctly; no unnecessary `'use client'`;
  props typed; composition over config.
- **TypeScript (`fe-prohibited-practices`):** no `any`; no non-null `!` abuse; types for API data.
- **State (`fe-state-management`):** right tool (Zustand/Redux); no global state for local concerns;
  no derived state duplicated.
- **Data (`fe-data-fetching` / `fe-api-client`):** API errors handled (status:"ERROR"); loading/error
  states; queryKeys sane; no fetch without error handling.
- **Styling (`fe-styling-tailwind`):** tokens not magic values; responsive; no inline style hacks.
- **A11y (`fe-quality`):** semantic HTML, labels, keyboard nav, contrast.
- **Security (`fe-security`):** no secrets in client; tokens handled safely; no dangerouslySetInnerHTML
  with untrusted data; inputs sanitized.
- **Performance (`fe-quality`):** no obvious bundle bloat; images optimized; heavy components lazy.
- **Prohibited practices:** verify the FE P0 list.

## Report
```
## Summary
{target} — {N} findings: {X} P0, {Y} high, {Z} minor. Verdict: PASS / FAIL.
## Findings
| # | Severity | File:line | Rule | Problem | Fix |
## What's done well
## Verdict
```

## Rules
- Report only; don't fix unless asked next.
- Always file:line. Acknowledge what's done well.
- Respect the repo's stack choices; flag violations, not different-but-valid tools.
