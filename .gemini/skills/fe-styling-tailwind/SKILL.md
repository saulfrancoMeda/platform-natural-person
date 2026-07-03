---
name: fe-styling-tailwind
description: >
  MEDA frontend standard: Tailwind CSS with MEDA design tokens, responsive design, dark mode, and
  avoiding magic values. Use whenever styling components or pages. Triggers on tailwind, styling,
  css, design tokens, responsive, dark mode, theme / "estilos", "tailwind", "colores", "responsive".
---
# Styling (Tailwind + MEDA tokens)

## Design tokens (MEDA UI)
Use semantic token classes, NOT raw hex/arbitrary values. Tokens are defined in the Tailwind config
(extracted from MEDA branding — colors to be filled from meda.com.mx):
```
bg-brand, text-brand, bg-surface, text-muted, border-default, bg-danger, text-success ...
```
(Placeholder until MEDA UI tokens are finalized; do not hardcode #hex in components.)

## Rules
- No magic values: `bg-[#1a2b3c]` is a smell — use a token (`bg-brand`). Add a token if missing.
- Mobile-first responsive: base styles for mobile, `md:`/`lg:` for larger.
- Dark mode via `dark:` variants tied to tokens (not duplicated hardcoded colors).
- Keep class lists readable; extract repeated combos into a component or `cn()` helper, not copy-paste.
- No inline `style={{}}` except for truly dynamic values (e.g. computed width).
