---
name: fe-accessibility
description: >
  MEDA frontend standard: accessibility (a11y) — semantic HTML, ARIA roles, keyboard navigation,
  contrast, labels. Mandatory in fintech. Use whenever building UI. Triggers on accessibility, a11y,
  aria, keyboard, screen reader, contrast, label / "accesibilidad", "a11y", "teclado", "contraste".
---
# Accessibility (a11y)

## Baseline (required in fintech)
- **Semantic HTML first**: `<button>`, `<nav>`, `<main>`, `<label>` — not `<div onClick>`.
- **Keyboard**: everything operable by keyboard; visible focus states; logical tab order.
- **Labels**: every input has an associated `<label>` or `aria-label`; errors via `aria-describedby`.
- **ARIA only when needed**: prefer native elements; add roles/states (`aria-expanded`, `aria-live`)
  for custom widgets (modals, dropdowns, toasts).
- **Contrast**: meet WCAG AA (4.5:1 text). Don't rely on color alone to convey meaning.
- **Modals/dialogs**: focus trap, `Esc` to close, focus returns to trigger, `role="dialog"`.

## Rules
- No clickable `<div>`/`<span>` for actions — use `<button>`.
- Images need `alt`; decorative images `alt=""`.
- Test with keyboard only and a screen reader for critical flows (login, payments).
