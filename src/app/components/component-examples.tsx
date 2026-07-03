"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { InputOTP } from "@/components/ui/input-otp";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AmountInput } from "@/components/ui/amount-input";
import { CopyField } from "@/components/ui/copy-field";
import { StatusPill, StatusResult } from "@/components/ui/status-pill";
import { Combobox } from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tabs } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Tooltip } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { TransactionCard } from "@/components/ui/transaction-card";
import { DataTable, type Column } from "@/components/ui/data-table";
import { DetailModal } from "@/components/ui/detail-modal";
import { FormRenderer, type FormSchema } from "@/components/ui/form-renderer";
import { Sidebar } from "@/components/ui/sidebar";

export interface Example { title: string; node: React.ReactNode; code: string; }
export interface ComponentDoc { name: string; group: string; summary: string; importLine: string; examples: Example[]; }

// Small stateful wrappers so demos are interactive.
function OTPDemo() { const [v, setV] = React.useState(""); return <InputOTP value={v} onChange={setV} />; }
function ComboDemo() {
  const [v, setV] = React.useState("");
  return <div className="w-64"><Combobox value={v} onChange={setV} options={[
    { value: "binance", label: "Binance" }, { value: "stp", label: "STP" }, { value: "bbva", label: "BBVA México" },
  ]} placeholder="Selecciona banco" /></div>;
}
function DateDemo() { const [d, setD] = React.useState<Date | null>(null); return <div className="w-64"><DatePicker value={d} onChange={setD} /></div>; }
function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return <><Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
    <Dialog open={open} onClose={() => setOpen(false)} title="Confirmar acción"><p className="text-sm text-fg-secondary">Contenido del diálogo aquí.</p></Dialog></>;
}
function ConfirmDemo() {
  const [open, setOpen] = React.useState(false);
  return <><Button variant="danger" onClick={() => setOpen(true)}>Eliminar</Button>
    <ConfirmDialog open={open} onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} title="¿Eliminar registro?" description="Esta acción no se puede deshacer." /></>;
}
function SwitchDemo() { const [on, setOn] = React.useState(true); return <Switch checked={on} onChange={setOn} />; }
function CheckDemo() { return <Checkbox defaultChecked label="Acepto los términos" />; }
function AmountDemo() { const [v, setV] = React.useState<number | "">(1250); return <div className="w-64"><AmountInput value={v} onChange={setV} currency="MXN" /></div>; }
function RadioDemo() {
  const [v, setV] = React.useState("spei");
  return <RadioGroup name="pay" value={v} onChange={setV} options={[{ value: "spei", label: "SPEI" }, { value: "card", label: "Tarjeta" }]} />;
}
function ProgressDemo() { return <div className="w-64"><Progress value={66} /></div>; }

function TabsDemo() {
  const [active, setActive] = React.useState("a");
  return (
    <div className="w-full max-w-md">
      <Tabs tabs={[{ id: "a", label: "Resumen" }, { id: "b", label: "Detalle" }]} active={active} onChange={setActive} />
      <p className="py-3 text-sm text-fg-secondary">{active === "a" ? "Contenido resumen" : "Contenido detalle"}</p>
    </div>
  );
}


interface DemoRow { id: string; concepto: string; monto: number; estado: string; }
const DEMO_ROWS: DemoRow[] = [
  { id: "MOV-1001", concepto: "Depósito SPEI", monto: 15000, estado: "Completado" },
  { id: "MOV-1002", concepto: "Comisión mensual", monto: -2500, estado: "Completado" },
  { id: "MOV-1003", concepto: "Transferencia", monto: -8000, estado: "En proceso" },
];
const DEMO_COLS: Column<DemoRow>[] = [
  { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
  { key: "concepto", header: "Concepto" },
  { key: "monto", header: "Monto", align: "right", render: (r) => <span className={r.monto < 0 ? "text-fg" : "text-price-up"}>${r.monto.toLocaleString("es-MX")}</span> },
  { key: "estado", header: "Estado", render: (r) => <Badge variant={r.estado === "Completado" ? "success" : "info"}>{r.estado}</Badge> },
];
function DataTableDemo() {
  return <div className="w-full"><DataTable title="MOVIMIENTOS" count={DEMO_ROWS.length} data={DEMO_ROWS} columns={DEMO_COLS} rowKey={(r) => r.id} searchFields={[{ placeholder: "Buscar…", keys: ["concepto"] }]} actions={<Button size="sm">+ Nuevo</Button>} paginate={false} /></div>;
}
function DetailModalDemo() {
  const [open, setOpen] = React.useState(false);
  return <><Button onClick={() => setOpen(true)}>Ver detalle</Button>
    <DetailModal open={open} onClose={() => setOpen(false)} title="Comprobante (CEP)" icon="▤" size="lg"
      fields={[{ label: "Estado", value: "Liquidado" }, { label: "Monto", value: "$300.00 MXN" }, { label: "Clave", value: "BNET0100…" }]}
      footer={<Button onClick={() => setOpen(false)}>Cerrar</Button>}>
      <p className="text-sm text-fg-secondary">Detalle del comprobante de pago.</p>
    </DetailModal></>;
}

function FormRendererDemo() {
  const schema: FormSchema = {
    submitLabel: "Guardar",
    columns: 1,
    fields: [
      { name: "country", label: "País", type: "select", required: true,
        options: [{ value: "mx", label: "México" }, { value: "co", label: "Colombia" }] },
      // Parent→child: state options depend on the selected country
      { name: "state", label: "Estado", type: "select", required: true, dependsOn: ["country"],
        optionsFrom: (v) => v.country === "mx"
          ? [{ value: "cdmx", label: "CDMX" }, { value: "jal", label: "Jalisco" }]
          : v.country === "co" ? [{ value: "bog", label: "Bogotá" }] : [],
        visibleIf: (v) => !!v.country },
    ],
  };
  return <div className="w-full max-w-md"><FormRenderer schema={schema} onSubmit={() => {}} /></div>;
}

function SidebarExampleDemo() {
  return (
    <div className="h-64 w-full max-w-xs overflow-hidden rounded-control border border-border-default">
      <Sidebar embedded collapsible={false} activeHref="/mov"
        header={<span className="font-semibold text-fg">MEDÁ</span>}
        groups={[{ title: "Menú", items: [
          { label: "Movimientos", href: "/mov", icon: "▤", badge: 50 },
          { label: "Usuarios", href: "/u", icon: "◍" },
          { label: "Roles", href: "/r", icon: "◆", badge: "Nuevo" },
        ] }]} />
    </div>
  );
}

export const COMPONENT_DOCS: ComponentDoc[] = [
  {
    name: "Button", group: "Actions", summary: "Botón con variantes y tamaños. La acción primaria de cualquier pantalla.",
    importLine: 'import { Button } from "@/components/ui/button";',
    examples: [
      { title: "Variantes", node: <div className="flex flex-wrap gap-2"><Button>Primary</Button><Button variant="outline">Outline</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button></div>,
        code: '<Button>Primary</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="danger">Danger</Button>' },
      { title: "Tamaños", node: <div className="flex flex-wrap items-center gap-2"><Button size="sm">Small</Button><Button size="md">Medium</Button><Button size="lg">Large</Button></div>,
        code: '<Button size="sm">Small</Button>\n<Button size="md">Medium</Button>\n<Button size="lg">Large</Button>' },
      { title: "Estado de carga", node: <Button loading>Procesando…</Button>,
        code: '<Button loading>Procesando…</Button>' },
      { title: "Deshabilitado", node: <Button disabled>No disponible</Button>,
        code: '<Button disabled>No disponible</Button>' },
      { title: "Ancho completo", node: <div className="w-64"><Button className="w-full">Continuar</Button></div>,
        code: '<Button className="w-full">Continuar</Button>' },
    ],
  },
  {
    name: "Input", group: "Forms", summary: "Campo de texto base. Tamaño y radio alineados a Binance.",
    importLine: 'import { Input } from "@/components/ui/input";',
    examples: [
      { title: "Básico", node: <div className="w-64"><Input placeholder="Escribe aquí…" /></div>, code: '<Input placeholder="Escribe aquí…" />' },
      { title: "Con error", node: <div className="w-64"><Input error placeholder="Correo inválido" /></div>, code: '<Input error placeholder="Correo inválido" />' },
      { title: "Deshabilitado", node: <div className="w-64"><Input disabled placeholder="No editable" /></div>, code: '<Input disabled placeholder="No editable" />' },
      { title: "Tipo password", node: <div className="w-64"><Input type="password" placeholder="••••••••" /></div>, code: '<Input type="password" placeholder="••••••••" />' },
    ],
  },
  {
    name: "Field", group: "Forms", summary: "Patrón composable: arma cualquier control con label, descripción y error.",
    importLine: 'import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";',
    examples: [
      { title: "Campo con descripción", node: <div className="w-72"><Field><FieldLabel htmlFor="e1">Correo</FieldLabel><Input id="e1" placeholder="tu@meda.com.mx" /><FieldDescription>Nunca lo compartiremos.</FieldDescription></Field></div>,
        code: '<Field>\n  <FieldLabel htmlFor="email">Correo</FieldLabel>\n  <Input id="email" placeholder="tu@meda.com.mx" />\n  <FieldDescription>Nunca lo compartiremos.</FieldDescription>\n</Field>' },
      { title: "Campo con error", node: <div className="w-72"><Field><FieldLabel htmlFor="e2">CLABE</FieldLabel><Input id="e2" error defaultValue="123" /><FieldError>La CLABE debe tener 18 dígitos.</FieldError></Field></div>,
        code: '<Field>\n  <FieldLabel htmlFor="clabe">CLABE</FieldLabel>\n  <Input id="clabe" error />\n  <FieldError>La CLABE debe tener 18 dígitos.</FieldError>\n</Field>' },
      { title: "Grupo de campos", node: <div className="w-72"><FieldGroup><Field><FieldLabel htmlFor="e3">Nombre</FieldLabel><Input id="e3" /></Field><Field><FieldLabel htmlFor="e4">Apellido</FieldLabel><Input id="e4" /></Field></FieldGroup></div>,
        code: '<FieldGroup>\n  <Field>\n    <FieldLabel htmlFor="nombre">Nombre</FieldLabel>\n    <Input id="nombre" />\n  </Field>\n  <Field>\n    <FieldLabel htmlFor="apellido">Apellido</FieldLabel>\n    <Input id="apellido" />\n  </Field>\n</FieldGroup>' },
    ],
  },
  {
    name: "FormRenderer", group: "Forms", summary: "Formulario desde esquema JSON: options async (endpoints), dependencias padre→hijo, visibilidad condicional y validación.",
    importLine: 'import { FormRenderer, type FormSchema } from "@/components/ui/form-renderer";',
    examples: [{ title: "Formulario desde JSON", node: <FormRendererDemo />, code: 'const schema: FormSchema = {\n  submitLabel: "Guardar",\n  fields: [\n    { name: "email", label: "Correo", type: "email", required: true },\n    { name: "role", label: "Rol", type: "select", options: [...] },\n  ],\n};\n<FormRenderer schema={schema} onSubmit={(v) => api.save(v)} />' }],
  },
  {
    name: "InputOTP", group: "Forms", summary: "Código de un solo uso (2FA/SMS). Auto-avance, pegado y backspace.",
    importLine: 'import { InputOTP } from "@/components/ui/input-otp";',
    examples: [
      { title: "6 dígitos (default)", node: <OTPDemo />, code: 'const [v, setV] = useState("");\n<InputOTP value={v} onChange={setV} />' },
      { title: "4 dígitos", node: <InputOTP length={4} value="" onChange={() => {}} />, code: '<InputOTP length={4} value={v} onChange={setV} />' },
    ],
  },
  {
    name: "InputGroup", group: "Forms", summary: "Input con addons dentro: icono, prefijo de texto o botón.",
    importLine: 'import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";',
    examples: [
      { title: "Prefijo de monto", node: <div className="w-64"><InputGroup><InputGroupAddon>$</InputGroupAddon><InputGroupInput placeholder="0.00" inputMode="decimal" /><InputGroupAddon position="trailing">MXN</InputGroupAddon></InputGroup></div>,
        code: '<InputGroup>\n  <InputGroupAddon>$</InputGroupAddon>\n  <InputGroupInput placeholder="0.00" />\n  <InputGroupAddon position="trailing">MXN</InputGroupAddon>\n</InputGroup>' },
      { title: "Búsqueda con icono", node: <div className="w-64"><InputGroup><InputGroupAddon>🔍</InputGroupAddon><InputGroupInput placeholder="Buscar transacción…" /></InputGroup></div>,
        code: '<InputGroup>\n  <InputGroupAddon><Search className="h-4 w-4" /></InputGroupAddon>\n  <InputGroupInput placeholder="Buscar…" />\n</InputGroup>' },
    ],
  },
  {
    name: "Select", group: "Forms", summary: "Lista desplegable nativa. Para listas cortas; usa Combobox si hay búsqueda.",
    importLine: 'import { Select } from "@/components/ui/select";',
    examples: [
      { title: "Básico", node: <div className="w-64"><Select options={[{ value: "spei", label: "SPEI" }, { value: "card", label: "Tarjeta" }, { value: "cash", label: "Efectivo" }]} /></div>,
        code: '<Select options={[\n  { value: "spei", label: "SPEI" },\n  { value: "card", label: "Tarjeta" },\n]} />' },
    ],
  },
  {
    name: "Combobox", group: "Forms", summary: "Select con búsqueda. Para listas largas: bancos, beneficiarios, monedas.",
    importLine: 'import { Combobox } from "@/components/ui/combobox";',
    examples: [
      { title: "Con búsqueda", node: <ComboDemo />, code: 'const [v, setV] = useState("");\n<Combobox value={v} onChange={setV} options={[\n  { value: "binance", label: "Binance" },\n  { value: "stp", label: "STP" },\n]} placeholder="Selecciona banco" />' },
    ],
  },
  {
    name: "DatePicker", group: "Forms", summary: "Calendario real con navegación de meses. Para filtros de fecha.",
    importLine: 'import { DatePicker } from "@/components/ui/date-picker";',
    examples: [
      { title: "Selector de fecha", node: <DateDemo />, code: 'const [d, setD] = useState<Date | null>(null);\n<DatePicker value={d} onChange={setD} locale="es-MX" />' },
    ],
  },
  {
    name: "AmountInput", group: "Forms", summary: "Input de monto con formato de moneda. Fintech.",
    importLine: 'import { AmountInput } from "@/components/ui/amount-input";',
    examples: [
      { title: "Monto en MXN", node: <AmountDemo />, code: 'const [v, setV] = useState<number | "">(1250);\n<AmountInput value={v} onChange={setV} currency="MXN" />' },
    ],
  },
  {
    name: "Switch", group: "Forms", summary: "Interruptor on/off.",
    importLine: 'import { Switch } from "@/components/ui/switch";',
    examples: [{ title: "Toggle", node: <SwitchDemo />, code: 'const [on, setOn] = useState(true);\n<Switch checked={on} onChange={setOn} />' }],
  },
  {
    name: "Checkbox", group: "Forms", summary: "Casilla de verificación con label.",
    importLine: 'import { Checkbox } from "@/components/ui/checkbox";',
    examples: [{ title: "Con label", node: <CheckDemo />, code: '<Checkbox defaultChecked label="Acepto los términos" />' }],
  },
  {
    name: "RadioGroup", group: "Forms", summary: "Selección única entre opciones.",
    importLine: 'import { RadioGroup } from "@/components/ui/radio-group";',
    examples: [{ title: "Método de pago", node: <RadioDemo />, code: 'const [v, setV] = useState("spei");\n<RadioGroup name="pay" value={v} onChange={setV} options={[\n  { value: "spei", label: "SPEI" },\n  { value: "card", label: "Tarjeta" },\n]} />' }],
  },
  {
    name: "Textarea", group: "Forms", summary: "Campo de texto multilínea.",
    importLine: 'import { Textarea } from "@/components/ui/textarea";',
    examples: [{ title: "Básico", node: <div className="w-64"><Textarea placeholder="Escribe una nota…" /></div>, code: '<Textarea placeholder="Escribe una nota…" />' }],
  },
  {
    name: "Badge", group: "Feedback", summary: "Etiqueta de estado o categoría.",
    importLine: 'import { Badge } from "@/components/ui/badge";',
    examples: [
      { title: "Variantes", node: <div className="flex gap-2"><Badge variant="success">Success</Badge><Badge variant="error">Error</Badge><Badge variant="warning">Warning</Badge><Badge variant="brand">Brand</Badge></div>,
        code: '<Badge variant="success">Success</Badge>\n<Badge variant="error">Error</Badge>\n<Badge variant="warning">Warning</Badge>\n<Badge variant="brand">Brand</Badge>' },
    ],
  },
  {
    name: "StatusPill", group: "Feedback", summary: "Estado de transacción con punto de color (accesible).",
    importLine: 'import { StatusPill, StatusResult } from "@/components/ui/status-pill";',
    examples: [
      { title: "Estados", node: <div className="flex flex-col gap-2"><StatusPill status="SUCCESS" /><StatusPill status="PROCESSING" /><StatusPill status="FAILED" /></div>,
        code: '<StatusPill status="SUCCESS" />\n<StatusPill status="PROCESSING" />\n<StatusPill status="FAILED" />' },
      { title: "Resultado con icono de marca", node: <StatusResult status="SUCCESS" title="Transferencia enviada" description="Llegará en minutos." />,
        code: '<StatusResult status="SUCCESS" title="Transferencia enviada"\n  description="Llegará en minutos." />' },
    ],
  },
  {
    name: "Alert", group: "Feedback", summary: "Mensaje contextual destacado.",
    importLine: 'import { Alert } from "@/components/ui/alert";',
    examples: [
      { title: "Variantes", node: <div className="flex flex-col gap-2 w-full max-w-md"><Alert variant="info" title="Información">Tu sesión expira en 5 min.</Alert><Alert variant="error" title="Error">No se pudo procesar el pago.</Alert></div>,
        code: '<Alert variant="info" title="Información">Tu sesión expira en 5 min.</Alert>\n<Alert variant="error" title="Error">No se pudo procesar el pago.</Alert>' },
    ],
  },
  {
    name: "Spinner", group: "Feedback", summary: "Indicador de carga.",
    importLine: 'import { Spinner } from "@/components/ui/spinner";',
    examples: [{ title: "Cargando", node: <Spinner />, code: '<Spinner />' }],
  },
  {
    name: "Skeleton", group: "Feedback", summary: "Placeholder mientras carga el contenido.",
    importLine: 'import { Skeleton } from "@/components/ui/skeleton";',
    examples: [{ title: "Carga de tarjeta", node: <div className="w-64 space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-20 w-full" /></div>,
      code: '<Skeleton className="h-4 w-3/4" />\n<Skeleton className="h-20 w-full" />' }],
  },
  {
    name: "Progress", group: "Feedback", summary: "Barra de progreso.",
    importLine: 'import { Progress } from "@/components/ui/progress";',
    examples: [{ title: "66%", node: <ProgressDemo />, code: '<Progress value={66} />' }],
  },
  {
    name: "Avatar", group: "Data display", summary: "Imagen o iniciales de usuario.",
    importLine: 'import { Avatar } from "@/components/ui/avatar";',
    examples: [{ title: "Iniciales", node: <div className="flex gap-2"><Avatar name="Ana García" /><Avatar name="Carlos López" /></div>, code: '<Avatar name="Ana García" />\n<Avatar name="Carlos López" />' }],
  },
  {
    name: "CopyField", group: "Data display", summary: "Campo con botón de copiar. Para CLABE, referencias, hashes.",
    importLine: 'import { CopyField } from "@/components/ui/copy-field";',
    examples: [{ title: "CLABE copiable", node: <div className="w-72"><CopyField label="CLABE" value="012180012345678901" /></div>, code: '<CopyField label="CLABE" value="012180012345678901" />' }],
  },
  {
    name: "TransactionCard", group: "Data display", summary: "Tarjeta de movimiento con monto y estado.",
    importLine: 'import { TransactionCard } from "@/components/ui/transaction-card";',
    examples: [{ title: "Movimiento", node: <div className="w-full max-w-md"><TransactionCard orderNo="MX-9001" merchant="Spotify" amount={-149} date="2026-06-22" status="SUCCESS" /></div>,
      code: '<TransactionCard orderNo="MX-9001" merchant="Spotify"\n  amount={-149} date="2026-06-22" status="SUCCESS" />' }],
  },
  {
    name: "DataTable", group: "Data display", summary: "Tabla production-grade: toolbar con stats, búsqueda, columnas visibles, export, modo zen, densidad y paginación.",
    importLine: 'import { DataTable, type Column } from "@/components/ui/data-table";',
    examples: [{ title: "Tabla de movimientos", node: <DataTableDemo />, code: 'const cols: Column<Mov>[] = [\n  { key: "id", header: "ID" },\n  { key: "monto", header: "Monto", align: "right" },\n];\n<DataTable title="MOVIMIENTOS" count={50} data={rows} columns={cols}\n  rowKey={(r) => r.id}\n  stats={[{ label: "Total", value: "$1.8M", tone: "success" }]}\n  searchFields={[{ placeholder: "Buscar", keys: ["id"] }]}\n  actions={<Button>+ Nuevo</Button>} onRowClick={openDetail} />' }],
  },
  {
    name: "DetailModal", group: "Overlays", summary: "Modal de detalle de registro (CEP, usuario): header con icono, grid de campos y acciones.",
    importLine: 'import { DetailModal } from "@/components/ui/detail-modal";',
    examples: [{ title: "Comprobante", node: <DetailModalDemo />, code: '<DetailModal open={open} onClose={close} title="Comprobante (CEP)" icon="▤"\n  fields={[{ label: "Estado", value: "Liquidado" }]}\n  footer={<Button>Descargar</Button>}>\n  <Detalle />\n</DetailModal>' }],
  },
  {
    name: "Dialog", group: "Overlays", summary: "Modal centrado con overlay.",
    importLine: 'import { Dialog } from "@/components/ui/dialog";',
    examples: [{ title: "Abrir modal", node: <DialogDemo />, code: 'const [open, setOpen] = useState(false);\n<Button onClick={() => setOpen(true)}>Abrir</Button>\n<Dialog open={open} onClose={() => setOpen(false)} title="Confirmar">\n  …\n</Dialog>' }],
  },
  {
    name: "ConfirmDialog", group: "Overlays", summary: "Confirmación de acción destructiva.",
    importLine: 'import { ConfirmDialog } from "@/components/ui/confirm-dialog";',
    examples: [{ title: "Confirmar eliminar", node: <ConfirmDemo />, code: '<ConfirmDialog open={open} onClose={...} onConfirm={...}\n  title="¿Eliminar?" description="No se puede deshacer." />' }],
  },
  {
    name: "Tooltip", group: "Overlays", summary: "Información al pasar el cursor.",
    importLine: 'import { Tooltip } from "@/components/ui/tooltip";',
    examples: [{ title: "Con tooltip", node: <Tooltip content="Información adicional"><Button variant="outline">Pasa el cursor</Button></Tooltip>, code: '<Tooltip content="Información adicional">\n  <Button>Pasa el cursor</Button>\n</Tooltip>' }],
  },
  {
    name: "Tabs", group: "Navigation", summary: "Pestañas para alternar vistas.",
    importLine: 'import { Tabs } from "@/components/ui/tabs";',
    examples: [{ title: "Pestañas", node: <TabsDemo />,
      code: 'const [active, setActive] = useState("a");\n<Tabs tabs={[\n  { id: "a", label: "Resumen" },\n  { id: "b", label: "Detalle" },\n]} active={active} onChange={setActive} />' }],
  },
  {
    name: "Accordion", group: "Navigation", summary: "Secciones colapsables.",
    importLine: 'import { Accordion } from "@/components/ui/accordion";',
    examples: [{ title: "FAQ", node: <div className="w-full max-w-md"><Accordion items={[{ id: "1", title: "¿Cuánto tarda una transferencia?", content: "Las SPEI llegan en minutos." }, { id: "2", title: "¿Hay comisión?", content: "No para transferencias SPEI." }]} /></div>,
      code: '<Accordion items={[\n  { id: "1", title: "¿Cuánto tarda?", content: "Minutos." },\n]} />' }],
  },
  {
    name: "Sidebar", group: "Layout", summary: "Navegación lateral personalizable: grupos, iconos, badges, colapsable, header/footer. Para back-office.",
    importLine: 'import { Sidebar } from "@/components/ui/sidebar";',
    examples: [{ title: "Sidebar con grupos y badges", node: <SidebarExampleDemo />, code: '<Sidebar activeHref="/mov" header={<Logo />} footer={<UserMenu />}\n  groups={[{ title: "Menú", items: [\n    { label: "Movimientos", href: "/mov", icon: <Icon/>, badge: 50 },\n    { label: "Roles", href: "/r", badge: "Nuevo" },\n  ] }]} />\n\n// O el layout completo:\n<AppShell groups={groups} activeHref="/mov">{children}</AppShell>' }],
  },
  {
    name: "Card", group: "Layout", summary: "Contenedor con borde y padding.",
    importLine: 'import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";',
    examples: [{ title: "Tarjeta completa", node: <Card className="w-full max-w-sm"><CardHeader><CardTitle>Balance</CardTitle><CardDescription>Disponible hoy</CardDescription></CardHeader><CardContent><p className="text-2xl font-semibold text-fg">$24,580.00</p></CardContent></Card>,
      code: '<Card>\n  <CardHeader>\n    <CardTitle>Balance</CardTitle>\n    <CardDescription>Disponible hoy</CardDescription>\n  </CardHeader>\n  <CardContent>$24,580.00</CardContent>\n</Card>' }],
  },
];
