"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP } from "@/components/ui/input-otp";
import { AmountInput } from "@/components/ui/amount-input";
import { Combobox } from "@/components/ui/combobox";
import { CopyField } from "@/components/ui/copy-field";
import { StatusResult } from "@/components/ui/status-pill";
import { FormRenderer, type FormSchema } from "@/components/ui/form-renderer";
import { Sidebar } from "@/components/ui/sidebar";
import { useToast, ToastProvider } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MedaLogo } from "@/features/auth/meda-logo";
import { formatMXN } from "@/lib/utils/format";

// Showcase = small containers, each demonstrating ONE complete functionality of a component
// (not full screens). Click a card title to see what it's for.

export default function ShowcasePage() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-default bg-bg/90 px-6 backdrop-blur">
          <MedaLogo />
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-fg-secondary hover:text-fg">Home</Link>
            <Link href="/components" className="text-sm text-fg-secondary hover:text-fg">Componentes</Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="text-2xl font-semibold text-fg">Funcionalidades</h1>
          <p className="mt-1 mb-8 text-fg-secondary">Cada tarjeta demuestra una funcionalidad completa en pequeño. Úsalas como referencia de implementación.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <DemoCard title="Verificación 2FA" purpose="Confirmar un código de un solo uso (SMS/app) antes de una operación sensible."><OTPDemo /></DemoCard>
            <DemoCard title="Monto con máscara" purpose="Capturar un monto con formato de miles en vivo y validación de decimales."><AmountDemo /></DemoCard>
            <DemoCard title="Buscar y elegir banco" purpose="Seleccionar de una lista larga con búsqueda (combobox)."><BankDemo /></DemoCard>
            <DemoCard title="Copiar CLABE" purpose="Mostrar un dato sensible enmascarado con botón de copiar."><CopyDemo /></DemoCard>
            <DemoCard title="Resultado de operación" purpose="Confirmar el resultado de una transacción con icono de marca."><ResultDemo /></DemoCard>
            <DemoCard title="Notificación con deshacer" purpose="Avisar una acción y permitir revertirla (toast estilo Binance)."><ToastDemo /></DemoCard>
            <DemoCard title="Formulario desde JSON" purpose="Renderizar un formulario validado a partir de un esquema (config-driven)." wide><JsonFormDemo /></DemoCard>
            <DemoCard title="Sidebar de navegación" purpose="Navegación lateral personalizable: grupos, iconos, badges, colapsable. Para apps de back-office." wide><SidebarDemo /></DemoCard>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}

function DemoCard({ title, purpose, children, wide }: { title: string; purpose: string; children: React.ReactNode; wide?: boolean }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Card className={wide ? "sm:col-span-2" : ""}>
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="font-semibold text-fg">{title}</h3>
          <button onClick={() => setOpen((o) => !o)} className="shrink-0 text-xs text-brand-dark hover:text-brand">{open ? "Ocultar" : "¿Para qué sirve?"}</button>
        </div>
        {open && <p className="mb-3 rounded-control bg-muted p-2 text-xs text-fg-secondary">{purpose}</p>}
        <div className="flex min-h-[64px] items-center">{children}</div>
      </CardContent>
    </Card>
  );
}

function OTPDemo() {
  const [v, setV] = React.useState("");
  const done = v.length === 6;
  return <div className="w-full"><InputOTP value={v} onChange={setV} />{done && <p className="mt-2 text-sm text-success">Código completo ✓</p>}</div>;
}
function AmountDemo() {
  const [v, setV] = React.useState<number | "">(1234567.5);
  return <div className="w-full"><AmountInput value={v} onChange={setV} /><p className="mt-2 text-xs text-fg-secondary">Valor: {v === "" ? "—" : formatMXN(v)}</p></div>;
}
function BankDemo() {
  const [v, setV] = React.useState("");
  return <div className="w-full"><Combobox value={v} onChange={setV} options={[{ value: "bbva", label: "BBVA México" }, { value: "stp", label: "STP" }, { value: "banorte", label: "Banorte" }, { value: "santander", label: "Santander" }]} placeholder="Selecciona banco" /></div>;
}
function CopyDemo() { return <div className="w-full"><CopyField label="CLABE" value="012180012345678901" masked /></div>; }
function ResultDemo() { return <div className="w-full"><StatusResult status="SUCCESS" title="Transferencia enviada" description="Llegará en minutos." /></div>; }
function ToastDemo() {
  const { show } = useToast();
  return <Button variant="outline" onClick={() => show("success", "Transferencia enviada", { action: { label: "Deshacer", onClick: () => show("info", "Cancelada") } })}>Enviar</Button>;
}
function JsonFormDemo() {
  const { show } = useToast();
  const schema: FormSchema = {
    submitLabel: "Crear transferencia",
    fields: [
      { name: "beneficiary", label: "Beneficiario", type: "text", required: true, full: true, placeholder: "Nombre completo" },
      { name: "clabe", label: "CLABE", type: "text", required: true, pattern: "^\\d{18}$", placeholder: "18 dígitos", description: "18 dígitos numéricos" },
      { name: "amount", label: "Monto", type: "amount", required: true, min: 1 },
      { name: "bank", label: "Banco", type: "combobox", options: [{ value: "bbva", label: "BBVA" }, { value: "stp", label: "STP" }] },
      { name: "concept", label: "Concepto", type: "text", placeholder: "Pago de…", full: true },
    ],
  };
  return <div className="w-full"><FormRenderer schema={schema} onSubmit={(v) => show("success", `Enviado: ${v.beneficiary}`)} /></div>;
}

function SidebarDemo() {
  return (
    <div className="h-72 w-full overflow-hidden rounded-control border border-border-default">
      <div className="relative h-full">
        <Sidebar
          collapsible={false}
          embedded
          activeHref="/movimientos"
          header={<span className="font-semibold text-fg">MEDÁ</span>}
          footer={<p className="text-xs text-fg-tertiary">v1.0.0 · Cerrar sesión</p>}
          groups={[
            { title: "Operación", items: [
              { label: "Movimientos", href: "/movimientos", icon: "▤", badge: 50 },
              { label: "Transferencias", href: "/transferencias", icon: "⇄" },
              { label: "Balance", href: "/balance", icon: "◎" },
            ] },
            { title: "Administración", items: [
              { label: "Usuarios", href: "/usuarios", icon: "◍" },
              { label: "Roles", href: "/roles", icon: "◆", badge: "Nuevo" },
            ] },
          ]}
        />
      </div>
    </div>
  );
}
