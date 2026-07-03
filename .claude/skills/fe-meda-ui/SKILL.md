---
name: fe-meda-ui
description: >
  MEDA UI component library: Binance-style design system (yellow #FCD535) as Tailwind tokens +
  shadcn-style copyable components. Use whenever building UI that should match MEDA's look, adding a
  Button/Input/Card/Table/Dialog/Badge, or theming with MEDA tokens. Triggers on MEDA UI, component
  library, design system, brand colors, Binance style, button/input/card / "MEDA UI", "componentes",
  "diseño", "colores de marca".
---
# MEDA UI — Design system & components (Binance-style)

## Identity (from MEDA's theme)
- **Brand:** #FCD535 (Binance yellow); hover gold #C99400; light #FDDD66. Text on brand: #0A0F14.
- **Dark surfaces:** bg #141518, paper #181a20, sidebar #0a0f14. **Light:** bg #FCFCFC, paper #FFFFFF.
- **Text:** #0A0F14 (light) / #f9fafb (dark). Radius: 8px. Font: Binance Plex.
- **Semantic:** success #10b981, error #ef4444, warning #f59e0b, info #3b82f6.

## Tokens — use semantic classes, NOT raw hex
The Tailwind preset (`meda-tailwind-preset.js`) exposes: `bg-brand`, `text-brand-foreground`,
`bg-surface`, `bg-bg`, `text-fg`, `text-fg-secondary`, `border-border-default`, `bg-muted`,
`bg-success/error/warning/info`, `rounded-meda`, sidebar/table tokens. Dark mode via `.dark` class.
NEVER hardcode `#FCD535` in a component — use `bg-brand`. (Prohibited: magic hex values.)

## Setup in a project
1. `meda-fe add all` (or a specific component) — copies into `components/ui/`, plus `lib/cn.ts`,
   `styles/meda-tokens.css`, `meda-tailwind-preset.js`.
2. In `tailwind.config`: `presets: [require('./meda-tailwind-preset')]`.
3. In the root layout: `import './styles/meda-tokens.css'`.
4. Load Binance Plex font (or fallback to system-ui).

## Components (shadcn-style: copied into the repo, you own the code)
- **Button** — variants: primary (yellow), secondary, outline, link (gold), export, ghost, danger;
  sizes sm/md/lg (md = 44px); `loading` prop.
- **Input / FormField** — FormField adds accessible label + error + hint (aria-describedby).
- **Card** (+ Header/Title/Description/Content/Footer).
- **Badge** — default/success/error/warning/info/brand (great for payment statuses).
- **Table** (THead/TR/TH/TD) — muted head, row hover, matches MEDA table style.
- **Dialog** — accessible modal (role=dialog, Esc to close, overlay).
- **Spinner**.

## Rules
- Use MEDA UI primitives instead of re-styling raw HTML; keeps the Binance look consistent.
- Components are copied (you own them) — customize freely, but keep token classes for theming.
- All interactive components are keyboard-accessible (see `fe-quality`).
- Add new shared primitives to MEDA UI rather than duplicating styles across features.

## Utility layer (lib/) — installed with MEDA UI
Besides components, `meda-fe add` installs reusable utilities under `lib/` (or `src/lib/`):
- `lib/cn.ts` — className merger (clsx + tailwind-merge).
- `lib/utils/format.ts` — `formatCurrency` (MXN), `formatNumber`, `formatDate`, `formatDateTime`.
- `lib/utils/validators.ts` — `isValidRFC`, `isValidCURP`, `isValidCLABE`, `isValidEmail`, `isValidPhoneMX`.
- `lib/utils/mask.ts` — `maskAccount`, `maskEmail`, `maskPhone` (PII masking for display).
- `lib/api/client.ts` — `post`/`get` handling the MEDA APIResponse envelope + `MedaApiError`.

Import via the `@/*` alias: `import { formatCurrency } from "@/lib/utils/format"`. Use these instead
of re-implementing currency/date/validation logic per project — they keep MX fintech formatting and
PII handling consistent. The `@/*` alias points to `src/*` (the CLI configures this).

## Extended component catalog (shadcn-level coverage, Binance style)

All live in `components/ui/`, you own the code. How to ask the agent + a usage example for each.

### DropdownMenu — contextual menu
Ask: *"add a row actions dropdown (edit, delete) to the table"*
```tsx
<DropdownMenu trigger={<Button variant="outline">Actions</Button>}>
  <DropdownItem onClick={onEdit}>Edit</DropdownItem>
  <DropdownItem danger onClick={onDelete}>Delete</DropdownItem>
</DropdownMenu>
```

### Tooltip — hint on hover/focus (accessible)
Ask: *"add a tooltip explaining the fee field"*
```tsx
<Tooltip content="Network fee, charged by the blockchain"><span>Fee ⓘ</span></Tooltip>
```

### Accordion — collapsible sections
Ask: *"show the FAQ as an accordion"*
```tsx
<Accordion items={[{ id: "1", title: "How do transfers work?", content: <p>...</p> }]} />
```

### Popover — floating panel for rich content
Ask: *"put the date filters in a popover"*
```tsx
<Popover trigger={<Button variant="outline">Filters</Button>}><FilterForm /></Popover>
```

### Command — keyboard search palette
Ask: *"add a searchable command palette to pick a merchant"*
```tsx
<Command items={merchants.map(m => ({ id: m.id, label: m.name, onSelect: () => pick(m) }))} />
```

### Sheet — side drawer
Ask: *"open the transaction detail in a side drawer"*
```tsx
<Sheet open={open} onClose={() => setOpen(false)} title="Transaction detail"><TxDetail /></Sheet>
```

### RadioGroup, Label, Progress, Breadcrumb
```tsx
<RadioGroup name="type" value={v} onChange={setV} options={[{ value: "spei", label: "SPEI" }, { value: "card", label: "Card" }]} />
<Label htmlFor="amount">Amount</Label>
<Progress value={66} />
<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Transactions" }]} />
```

## Rule
These are the project's base — build features by composing them, don't re-create primitives. If a
needed primitive is missing, add it to `components/ui/` in this same style (token classes, accessible,
typed) so it becomes part of the shared base for everyone.

### ToggleGroup, Slider, Collapsible, HoverCard, Pagination, ScrollArea
- **ToggleGroup** — segmented control. Ask: *"add a 1D/1W/1M range toggle to the chart"*
  ```tsx
  <ToggleGroup value={range} onChange={setRange} options={[{value:"1d",label:"1D"},{value:"1w",label:"1W"}]} />
  ```
- **Slider** — Ask: *"add a slider to set the alert threshold"* → `<Slider value={v} onChange={setV} max={1000} />`
- **Collapsible** — Ask: *"make the advanced options collapsible"* → `<Collapsible trigger={<span>Advanced</span>}>...</Collapsible>`
- **HoverCard** — Ask: *"show merchant details on hover"* → `<HoverCard trigger={<span>{name}</span>}><MerchantInfo/></HoverCard>`
- **Pagination** — numbered (offset). Ask: *"add numbered pagination"* → `<Pagination page={p} totalPages={20} onPage={setP} />`
  (For millions of rows / cursor pagination, use the `DataTable` `pagination` prop instead — see fe-data-fetching.)
- **ScrollArea** — Ask: *"make this list scrollable with a thin scrollbar"* → `<ScrollArea className="max-h-80">...</ScrollArea>`

## Icons — two sources (don't add other icon libraries)
1. **Generic UI icons → lucide-react** (the same set shadcn uses; safe, tree-shakeable, outline style
   matching Binance). Ask the agent normally; import what you need:
   ```tsx
   import { ArrowRight, Copy, Search, X } from "lucide-react";
   <Search className="h-4 w-4 text-fg-secondary" />
   ```
   Size with `h-/w-` (16px=h-4 inline, 20px=h-5). Color inherits via `text-*`.
2. **Brand status icons → MEDA's own SVG** in `components/icons/status-icons.tsx` (SuccessIcon,
   ErrorIcon, WaitingIcon, GeolocationIcon). Brand yellow, no dependency. Use for result/confirmation
   screens via `StatusResult`:
   ```tsx
   <StatusResult status="SUCCESS" title="Transfer sent" description="Your transfer is on its way." />
   ```

Rule: only these two icon sources. Don't add font-awesome, react-icons, heroicons, etc. — keep the
dependency surface small (fintech supply-chain, see fe-security).

## Binance-aligned sizing (use these, don't invent)
The tokens follow Binance's UI system. When building or asking for components, keep to:
- Control height: 40px default (`h-10`), 32px compact (`h-8`), 48px CTA (`h-12`).
- Control radius: 4px (`rounded-control`). Card radius: 8px (`rounded-meda`).
- Input text: 14px (`text-sm`). Horizontal padding: 12px (`px-3`).
- Form field gap: 16px (`gap-4`).
- Price up/down: use `text-price-up` / `text-price-down` (Binance green #0ECB81 / red #F6465D).
- Dark theme is the default (Binance presents dark-first); light is available via the toggle.

## Advanced fintech components (Tanda 2)

### Combobox — searchable select (NOT a plain select)
For long lists where a basic Select is unusable: merchants, currencies, beneficiaries, countries.
Type to filter, ↑/↓ to navigate, Enter to pick.
Ask: *"use a searchable combobox to pick the beneficiary"*
```tsx
import { Combobox } from "@/components/ui/combobox";
<Combobox value={v} onChange={setV} options={beneficiaries.map(b => ({ value: b.id, label: b.name, description: b.clabe }))}
  placeholder="Select beneficiary" searchPlaceholder="Search by name..." />
```

### DatePicker — real month calendar (NOT a plain date input)
For transaction date filters, scheduling. Month navigation, locale-aware, no external lib.
Ask: *"add a date picker to filter transactions by date"*
```tsx
import { DatePicker } from "@/components/ui/date-picker";
<DatePicker value={date} onChange={setDate} locale="es-MX" />
```

### PdfViewer — view + search statements/receipts (opt-in)
Needs `react-pdf` (pdf.js / Mozilla — the standard, safe library). It ships as a `.template` so it
doesn't break builds when react-pdf isn't installed. To activate:
1. `pnpm add -E react-pdf`
2. Rename `components/ui/pdf-viewer.tsx.template` → `pdf-viewer.tsx`
3. Import directly (it's not in the barrel): `import { PdfViewer } from "@/components/ui/pdf-viewer";`
Ask: *"show the account statement PDF with search"*
```tsx
<PdfViewer file={statementUrl} />   // page nav, zoom, in-document text search (highlights matches)
```
Why opt-in: react-pdf is heavy and not every app needs it — keeping it out of the default install
respects the supply-chain rule (fe-security). The worker loads from CDN, pinned to the lib version.

## Charts (Recharts) — fintech data viz
MEDA charts wrap Recharts with the theme colors (price-up green / price-down red / brand).
Opt-in (ships as `meda-charts.tsx.template`): `pnpm add -E recharts` + rename to `meda-charts.tsx`.
Three chart types, each taking `data: { label, value }[]`:
- `AreaTrendChart` — balance / movements over time (the hero fintech chart). `trend="up"|"down"|"brand"`.
- `BarVolumeChart` — volume per period (transactions/day, revenue/month).
- `LineMetricChart` — a metric over time (price, conversion rate).
```tsx
import { AreaTrendChart } from "@/components/ui/meda-charts";
const data = [{ label: "Lun", value: 1200 }, { label: "Mar", value: 1800 }, /* ... */];
<AreaTrendChart data={data} trend="up" height={240} />
```
Ask the agent: *"add an area chart of the last 7 days of movements"*. Colors auto-follow dark/light
because they read CSS tokens at runtime. Why opt-in: recharts is heavy; not every screen needs charts.

## Use-case showcase (/showcase)
The generated `/showcase` page shows REAL fintech screens (account dashboard, new transfer,
transaction detail, login) — click a use-case card to see the actual screen built with MEDA UI.
Use it as a reference for how to compose primitives into real business screens, not just isolated demos.

## New form components (input-otp, input-group, field)

### InputOTP — one-time-password (2FA / SMS codes)
```tsx
import { InputOTP } from "@/components/ui/input-otp";
const [code, setCode] = useState("");
<InputOTP length={6} value={code} onChange={setCode} />   // auto-advance, paste-aware, backspace
```

### InputGroup — input with addons inside (icon / text prefix / button)
```tsx
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
<InputGroup>
  <InputGroupAddon>$</InputGroupAddon>
  <InputGroupInput placeholder="0.00" />
  <InputGroupAddon position="trailing">MXN</InputGroupAddon>
</InputGroup>
```

### Field — composable form field (shadcn's newer pattern)
More flexible than FormField: compose ANY control with label/description/error.
```tsx
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Correo</FieldLabel>
    <Input id="email" />
    <FieldDescription>Nunca lo compartiremos.</FieldDescription>
    <FieldError>{errors.email}</FieldError>   {/* renders only if children present */}
  </Field>
</FieldGroup>
```
Prefer `Field` for new forms (composable, works with any control); `FormField` stays for the simple
label+input+error case.

## Component explorer (/components)
The generated `/components` page is a shadcn-style explorer: a sidebar lists components grouped by
category; clicking one opens a detail panel (with motion) showing MULTIPLE labeled examples per
component, each with a "Ver código" toggle to see the exact usage. The examples live in
`app/components/component-examples.tsx` as a data array — add a new component's examples there.

## Production-grade admin patterns (DataTable, AppShell, DetailModal)
These three make back-office screens look like the real MEDA admin — use them instead of building
basic tables/modals by hand.

### DataTable — the centerpiece for any list/table screen
Built-in toolbar: count badge, summary stat chips, search fields, an actions slot, column visibility
(Columnas visibles), CSV export, zen/fullscreen mode, density toggle, and pagination with rows-per-page.
Don't hand-roll tables — compose columns + pass data.
```tsx
import { DataTable, type Column, type DataTableStat } from "@/components/ui/data-table";
const cols: Column<Mov>[] = [
  { key: "id", header: "ID", render: (m) => <span className="font-mono text-xs">{m.id}</span> },
  { key: "amount", header: "Monto", align: "right", render: (m) => <span className="text-price-up">${m.amount}</span> },
  { key: "status", header: "Estado", render: (m) => <Badge variant="success">{m.status}</Badge> },
];
<DataTable
  title="MOVIMIENTOS" count={50} data={rows} columns={cols} rowKey={(m) => m.id}
  stats={[{ label: "Monto total", value: "$1,850,861 MXN", tone: "success" }]}
  searchFields={[{ placeholder: "ID Transacción", keys: ["id"] }]}
  actions={<Button>+ Nueva</Button>}
  onRowClick={(m) => openDetail(m)}
/>
```
Notes: pagination is client-side by default (set `paginate={false}` for tiny tables); export defaults to
CSV of visible columns (override with `onExport`); columns can be `hidden` by default and toggled on.

### AppShell — sidebar + top bar layout for back-office
```tsx
import { AppShell } from "@/components/ui/app-shell";
<AppShell activeHref="/movements" topRight={<LanguageSwitcher />}
  groups={[
    { title: "Operación", items: [
      { label: "Movimientos", href: "/movements", icon: "▤" },
      { label: "Transferencias", href: "/transfers", icon: "⇄" },
    ] },
    { title: "Administración", items: [{ label: "Usuarios", href: "/users", icon: "◍" }] },
  ]}>
  {children}
</AppShell>
```

### DetailModal — rich record inspector (CEP receipt, user detail)
Header with icon+title, a key-value summary grid, free content, footer actions. Closes on overlay/Escape.
```tsx
import { DetailModal } from "@/components/ui/detail-modal";
<DetailModal open={!!row} onClose={() => setRow(null)} title="Comprobante (CEP)" icon="▤" size="lg"
  fields={[{ label: "Estado", value: "Liquidado" }, { label: "Monto", value: "$300.00 MXN" }]}
  footer={<Button>⭳ Descargar</Button>}>
  <p className="text-sm text-fg-secondary">Detalle…</p>
</DetailModal>
```

Rule for list/admin screens: AppShell (layout) + DataTable (the list, with its toolbar) + DetailModal
(row detail) + Dialog (create/edit form). That combination IS the MEDA admin look — don't reinvent it.

## Money masking & formatting (use these — don't format by hand)
In `lib/utils/`:
- `maskAmount("1234567.5")` → `"1,234,567.5"` (live thousands mask for inputs; AmountInput uses it).
- `parseAmount("1,234.56")` → `1234.56` (masked string → number).
- `formatMXN(1234.5)` → `"$1,234.50 MXN"` (MEDA's display format with suffix).
- `formatCompact(1850861)` → `"$1.85M"` (for stat chips / KPIs).
- `maskCard`, `maskAccount`, `maskEmail`, `maskPhone` for PII display (never log raw PII — fe-security).
Always render amounts via these so grouping/decimals/currency are consistent across the app.

## FormRenderer — config-driven forms from a JSON schema
Define forms as DATA, not hand-written JSX. Renders labels, controls, validation and submit from a
schema. Use for dynamic/admin forms and anything that should be data-driven.
```tsx
import { FormRenderer, type FormSchema } from "@/components/ui/form-renderer";
const schema: FormSchema = {
  submitLabel: "Crear transferencia", columns: 2,
  fields: [
    { name: "beneficiary", label: "Beneficiario", type: "text", required: true, full: true },
    { name: "clabe", label: "CLABE", type: "text", required: true, pattern: "^\\d{18}$", description: "18 dígitos" },
    { name: "amount", label: "Monto", type: "amount", required: true, min: 1 },
    { name: "bank", label: "Banco", type: "combobox", options: [{ value: "stp", label: "STP" }] },
  ],
};
<FormRenderer schema={schema} onSubmit={(values) => api.save(values)} />
```
Field types: text, email, password, number, amount, select, combobox, textarea, switch, checkbox.
Built-in validation: required, email, pattern, min (amount), plus a per-field `validate(value, values)`.
Prefer FormRenderer when fields come from config/an API; use hand-written Field + RHF+Zod when the form
has complex custom interactions (fe-forms-validation).

## DataTable: internal scroll by default
The table body scrolls internally (header stays sticky), so a long table doesn't push the page.
Default `maxHeight="32rem"`. Pass `maxHeight={false}` only if the user explicitly wants the page to grow.

## Sidebar — customizable navigation (standalone or via AppShell)
A configurable sidebar: groups with optional titles, items with icons + badges, collapsible to an
icon rail, header/footer slots, and an `embedded` mode for non-overlay layouts.
```tsx
import { Sidebar } from "@/components/ui/sidebar";
<Sidebar activeHref="/movimientos" header={<Logo />} footer={<UserMenu />}
  groups={[
    { title: "Operación", items: [
      { label: "Movimientos", href: "/movimientos", icon: <Receipt className="h-4 w-4" />, badge: 50 },
      { label: "Transferencias", href: "/transferencias", icon: <ArrowLeftRight className="h-4 w-4" /> },
    ] },
    { title: "Administración", items: [{ label: "Roles", href: "/roles", badge: "Nuevo" }] },
  ]} />
```
For a full layout, use `AppShell` (it wraps Sidebar + top bar + content):
```tsx
<AppShell groups={groups} activeHref="/movimientos" sidebarFooter={<UserMenu />}>{children}</AppShell>
```
Props: `collapsible` (default true), `defaultCollapsed`, `embedded` (render in normal flow, e.g. a demo),
items support `badge` (count or text like "Nuevo"). Customize header/footer freely.

## LoginForm — reusable login card
Identifier + password with leading icons, password visibility toggle, validation (RHF+Zod), loading.
Reusable across MEDA apps. Pass your own onSubmit; customize labels/title.
```tsx
import { LoginForm } from "@/features/auth/login-form";
<LoginForm onSubmit={async (v) => signIn(v.username, v.password)}
  title="Documentación API" subtitle="Inicia sesión para acceder"
  usernameLabel="Usuario" error={authError}
  footer={<>Desarrollado por Medá Technology</>} />
```

## LanguageSwitcher — polished locale dropdown
Dropdown with badge + native name + check on the active locale (es/en/zh). Sets the `locale`
cookie and refreshes. Closes on outside click/Escape. Place it in the top bar next to ThemeToggle.

## MedaLogo — always size it
MedaLogo now has a default height (h-7) so it never renders huge. Pass `className` to resize
(e.g. `<MedaLogo className="h-12" />`). Never use it without a height in a flex header.

## Guide routes (/guide/develop, /guide/mock, /guide/standards)
The welcome page's three cards link to dedicated guide routes that explain each topic in full
(not inline accordions). Generated under app/guide/*. Keep them as the place to document the workflow.

## FormRenderer (advanced) + schema separation + CRUD
**Keep schemas in their own files** under `lib/forms/` (separation of concerns) — see
`lib/forms/transfer-schema.ts` and `lib/forms/user-schema.ts`. Components import the schema; they
don't define fields inline.

FormRenderer now supports:
- **Async options from endpoints**: `loadOptions: (values) => Promise<Option[]>` (shows "Cargando…").
- **Parent→child dependencies**: `dependsOn: ["bank"]` re-runs `loadOptions`/`optionsFrom` when the
  parent changes (e.g. accounts depend on selected bank).
- **Sync derived options**: `optionsFrom: (values) => Option[]` (no fetch).
- **Conditional visibility**: `visibleIf: (values) => boolean`.
- `submitting`, `hideSubmit`, `onValuesChange` for custom flows.
```ts
// lib/forms/transfer-schema.ts
export const transferSchema: FormSchema = { submitLabel: "Revisar", columns: 2, fields: [
  { name: "bank", label: "Banco", type: "combobox", loadOptions: fetchBanks, required: true },
  { name: "account", label: "Cuenta", type: "select", dependsOn: ["bank"],
    loadOptions: (v) => fetchAccounts(String(v.bank)), visibleIf: (v) => !!v.bank, required: true },
]};
```

### CrudFormDialog — the standard create/edit flow
One schema drives BOTH create (empty) and edit (initialValues). Don't hand-build forms in modals.
```tsx
import { CrudFormDialog } from "@/components/ui/crud-form-dialog";
<CrudFormDialog open={creating} onClose={...} mode="create" schema={userSchema} onSubmit={save} />
<CrudFormDialog open={!!editing} onClose={...} mode="edit" schema={userSchema}
  initialValues={{ ...editing } as FormValues} onSubmit={save} />
```
Full CRUD pattern (list + create/edit + delete) is generated at `app/usuarios/page.tsx` — copy it for
any admin resource: swap the schema, columns and data source. List = DataTable, create/edit =
CrudFormDialog, delete = ConfirmDialog.

### Transfer/confirm flow
For a confirm step before submit: render FormRenderer with `onSubmit={(v) => setPending(v)}`, then a
ConfirmDialog that calls your real API on confirm. See `features/transfer/transfer-form.tsx`.

[LESSON] Don't hand-roll RHF + Controller + Zod per form when a schema fits — it's the source of
subtle bugs (disabled submit from `isValid`, Controller wiring). Use FormRenderer; drop to RHF+Zod
only for genuinely custom interactions (fe-forms-validation).
