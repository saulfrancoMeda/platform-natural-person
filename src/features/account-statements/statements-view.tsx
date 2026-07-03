"use client";
import Link from "next/link";
import { Download, Eye, FileText } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/toast";
import { useAccountStatements } from "@/lib/hooks/use-account";
import type { AccountStatement } from "@/lib/api/account";
import { cn } from "@/lib/cn";

export function StatementsView() {
  const { data, isFetching } = useAccountStatements();
  const { show } = useToast();
  const statements = data ?? [];

  const download = (s: AccountStatement) => {
    // Simulación de descarga; el backend devolverá el PDF real.
    const blob = new Blob([`Estado de cuenta Medá — ${s.period}\nPeriodo: ${s.startDate} a ${s.endDate}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `estado-cuenta-${s.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    show("success", `Descargando estado de cuenta de ${s.period}.`);
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
            <Link
              href={`/estados-de-cuenta/${s.id}`}
              className="inline-flex items-center gap-1.5 font-medium text-fg-secondary hover:text-fg"
            >
              <Eye className="h-4 w-4" /> Ver
            </Link>
            <button
              onClick={() => download(s)}
              className="inline-flex items-center gap-1.5 font-medium text-brand-dark hover:underline"
            >
              <Download className="h-4 w-4" /> Descargar
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
          Consulta y descarga tus estados de cuenta mensuales.
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
    </div>
  );
}
