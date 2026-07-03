"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Eye, FileText } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { NipDialog } from "@/features/security/nip-dialog";
import { useAccountStatements } from "@/lib/hooks/use-account";
import type { AccountStatement } from "@/lib/api/account";
import { cn } from "@/lib/cn";

type Action = { id: string; mode: "view" | "download" };

export function StatementsView() {
  const router = useRouter();
  const { data, isFetching } = useAccountStatements();
  const [pending, setPending] = React.useState<Action | null>(null);
  const statements = data ?? [];

  const runAfterNip = () => {
    if (!pending) return;
    // La descarga abre el documento en modo impresión → el usuario guarda como PDF.
    const suffix = pending.mode === "download" ? "?print=1" : "";
    router.push(`/estados-de-cuenta/${pending.id}${suffix}`);
    setPending(null);
  };

  const columns: Column<AccountStatement>[] = [
    {
      key: "period",
      header: "Periodo",
      render: (s) => (
        <span className="flex items-center gap-2 font-medium text-fg">
          <FileText className="h-4 w-4 text-fg-tertiary" /> {s.period}
        </span>
      ),
    },
    { key: "startDate", header: "Del" },
    { key: "endDate", header: "Al" },
    {
      key: "status",
      header: "Estado",
      render: (s) => (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            s.status === "Disponible" ? "bg-success/12 text-success-dark" : "bg-warning/15 text-warning-dark",
          )}
        >
          {s.status}
        </span>
      ),
    },
    {
      key: "id",
      header: "",
      align: "right",
      render: (s) =>
        s.status === "Disponible" ? (
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => setPending({ id: s.id, mode: "view" })}
              className="inline-flex items-center gap-1.5 font-medium text-fg-secondary hover:text-fg"
            >
              <Eye className="h-4 w-4" /> Ver
            </button>
            <button
              onClick={() => setPending({ id: s.id, mode: "download" })}
              className="inline-flex items-center gap-1.5 font-medium text-brand-dark hover:underline"
            >
              <Download className="h-4 w-4" /> Descargar PDF
            </button>
          </div>
        ) : (
          <span className="text-fg-tertiary">No disponible</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Estados de cuenta</h1>
        <p className="mt-1 text-sm text-fg-secondary">
          Consulta y descarga tus estados de cuenta mensuales. Por seguridad, se solicita tu NIP.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={statements}
        rowKey={(s) => s.id}
        title="Periodos"
        count={statements.length}
        loading={isFetching}
        paginate={false}
        exportable={false}
        emptyMessage="Aún no hay estados de cuenta disponibles"
      />

      <NipDialog
        open={!!pending}
        description={
          pending?.mode === "download"
            ? "Ingresa tu NIP de 4 dígitos para descargar tu estado de cuenta."
            : "Ingresa tu NIP de 4 dígitos para ver tu estado de cuenta."
        }
        onClose={() => setPending(null)}
        onValid={runAfterNip}
      />
    </div>
  );
}
