"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MedaLogo } from "@/features/auth/meda-logo";
import { formatMXN } from "@/lib/utils/format";
import { useAccountStatements, useBalance, useMovements } from "@/lib/hooks/use-account";
import { StatusBadge, TypeLabel } from "@/features/movements/movement-status-badge";

export function StatementDocument({ id, autoPrint }: { id: string; autoPrint?: boolean }) {
  const { data: statements } = useAccountStatements();
  const { data: balance } = useBalance();
  const statement = statements?.find((s) => s.id === id);

  const { data, isLoading } = useMovements({
    startDate: statement?.startDate,
    endDate: statement?.endDate,
  });
  const movements = data?.items ?? [];

  // Descarga: cuando el documento y sus datos están listos, abre el diálogo de impresión (Guardar como PDF).
  const printed = React.useRef(false);
  React.useEffect(() => {
    if (autoPrint && !printed.current && statement && !isLoading) {
      printed.current = true;
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [autoPrint, statement, isLoading]);

  const totals = React.useMemo(() => {
    let abonos = 0;
    let cargos = 0;
    for (const m of movements) {
      if (m.type === "Recepción") abonos += m.amount;
      else cargos += m.amount;
    }
    return { abonos, cargos };
  }, [movements]);

  if (!statement) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Barra de acciones (no se imprime) */}
      <div className="mb-4 flex items-center justify-between print:hidden">
        <Link
          href="/estados-de-cuenta"
          className="flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Link>
        <Button variant="primary" onClick={() => window.print()}>
          <Printer className="mr-1.5 h-4 w-4" /> Imprimir / Guardar PDF
        </Button>
      </div>

      {/* Documento */}
      <div className="rounded-meda border border-border-default bg-surface p-8 print:rounded-none print:border-0 print:p-0">
        <header className="flex items-start justify-between border-b border-border-default pb-6">
          <div>
            <MedaLogo className="h-8" />
            <p className="mt-3 text-lg font-semibold text-fg">Estado de cuenta</p>
            <p className="text-sm text-fg-secondary">Periodo: {statement.period}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-medium text-fg">{balance?.accountHolder ?? "—"}</p>
            <p className="text-fg-secondary">Cuenta Medá</p>
            <p className="mt-1 font-mono text-xs text-fg-secondary">CLABE {balance?.clabe ?? "—"}</p>
            <p className="mt-1 text-xs text-fg-tertiary">
              Del {statement.startDate} al {statement.endDate}
            </p>
          </div>
        </header>

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-4">
          <Summary label="Saldo actual" value={balance ? formatMXN(balance.balance) : "—"} />
          <Summary label="Total abonos" value={formatMXN(totals.abonos)} tone="success" />
          <Summary label="Total cargos" value={formatMXN(totals.cargos)} tone="error" />
          <Summary label="Movimientos" value={String(movements.length)} />
        </div>

        {/* Movimientos — scroll interno en pantalla, completo al imprimir */}
        <div className="max-h-[52vh] overflow-auto rounded-meda border border-border-default print:max-h-none print:overflow-visible">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-table-head print:static">
              <tr>
                {["Fecha", "Referencia", "Cve. rastreo", "Tipo", "Importe", "Estado"].map((h, i) => (
                  <th
                    key={h}
                    className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-table-subtitle ${
                      i === 4 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : movements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-fg-secondary">
                    Sin movimientos en este periodo
                  </td>
                </tr>
              ) : (
                movements.map((m) => (
                  <tr key={m.id} className="border-t border-border-default">
                    <td className="px-3 py-2.5 text-fg">{m.date}</td>
                    <td className="px-3 py-2.5 text-fg-secondary">{m.reference}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-fg-secondary">{m.trackingKey}</td>
                    <td className="px-3 py-2.5"><TypeLabel type={m.type} /></td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right font-medium text-fg">{formatMXN(m.amount)}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={m.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-fg-tertiary">
          Este documento es un resumen informativo de tus movimientos en el periodo indicado. Los montos
          están expresados en pesos mexicanos (MXN). Medá · Institución de Fondos de Pago Electrónico.
        </p>
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success" | "error";
}) {
  return (
    <div className="rounded-meda bg-muted px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-fg-tertiary">{label}</p>
      <p
        className={`mt-0.5 text-base font-semibold ${
          tone === "success" ? "text-success-dark" : tone === "error" ? "text-error-dark" : "text-fg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
