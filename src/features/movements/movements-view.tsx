"use client";
import * as React from "react";
import { Search, Wallet, X } from "lucide-react";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { formatMXN } from "@/lib/utils/format";
import { useBalance, useMovements } from "@/lib/hooks/use-account";
import type { Movement, MovementFilters } from "@/lib/api/account";
import { StatusBadge, TypeLabel } from "./movement-status-badge";
import { MovementDetailModal } from "./movement-detail-modal";
import { CepModal } from "./cep-modal";

const EMPTY: MovementFilters = {};

export function MovementsView() {
  const [draft, setDraft] = React.useState<MovementFilters>(EMPTY);
  const [filters, setFilters] = React.useState<MovementFilters>(EMPTY);
  const [detailId, setDetailId] = React.useState<string | null>(null);
  const [cepId, setCepId] = React.useState<string | null>(null);

  const { data: balance } = useBalance();
  const { data, isFetching } = useMovements(filters);
  const movements = data?.items ?? [];
  const hasFilters = !!(draft.trackingKey || draft.startDate || draft.endDate);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(draft);
  };
  const clearFilters = () => {
    setDraft(EMPTY);
    setFilters(EMPTY);
  };

  const columns: Column<Movement>[] = [
    {
      key: "id",
      header: "No. transacción",
      render: (r) => <span className="font-mono text-xs text-fg-secondary">{r.id}</span>,
    },
    { key: "date", header: "Fecha", sortable: true },
    { key: "reference", header: "No. referencia" },
    {
      key: "trackingKey",
      header: "Cve. rastreo",
      render: (r) => <span className="font-mono text-xs text-fg-secondary">{r.trackingKey}</span>,
    },
    { key: "type", header: "Tipo", render: (r) => <TypeLabel type={r.type} /> },
    {
      key: "amount",
      header: "Importe",
      align: "right",
      sortable: true,
      render: (r) => <span className="font-medium text-fg">{formatMXN(r.amount)}</span>,
    },
    { key: "status", header: "Estado", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "id",
      header: "",
      align: "right",
      render: (r) => (
        <button
          onClick={() => setDetailId(r.id)}
          className="font-medium text-brand-dark hover:underline"
        >
          Ver detalle
        </button>
      ),
    },
  ];

  const inputCls =
    "h-10 w-full rounded-control border border-border-default bg-bg px-3 text-sm text-fg outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/40";

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      {/* Container 1 — Saldo + filtros */}
      <section className="shrink-0 rounded-meda border border-border-default bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-fg-tertiary">
              {balance?.totalRecords ?? movements.length} registro(s) · Saldo actual
            </p>
            <p className="text-2xl font-semibold leading-tight text-fg">
              {balance ? formatMXN(balance.balance) : "—"}
            </p>
            {balance && (
              <p className="text-xs text-fg-secondary">
                {balance.accountHolder} · CLABE {balance.clabe}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 rounded-meda bg-brand/10 px-4 py-2.5">
            <Wallet className="h-5 w-5 text-brand-dark" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-fg-tertiary">Disponible</p>
              <p className="text-sm font-semibold text-fg">
                {balance ? formatMXN(balance.balance) : "—"}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={applyFilters}
          className="flex flex-wrap items-end gap-3 border-t border-border-default px-5 py-3.5"
        >
          <label className="min-w-[200px] flex-1">
            <span className="mb-1 block text-xs font-medium text-fg-secondary">Clave de rastreo</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-tertiary" />
              <input
                value={draft.trackingKey ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, trackingKey: e.target.value }))}
                placeholder="Buscar por clave de rastreo"
                className={inputCls + " pl-9"}
              />
            </div>
          </label>
          <label className="w-full sm:w-44">
            <span className="mb-1 block text-xs font-medium text-fg-secondary">Fecha inicial</span>
            <input
              type="date"
              value={draft.startDate ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
              className={inputCls}
            />
          </label>
          <label className="w-full sm:w-44">
            <span className="mb-1 block text-xs font-medium text-fg-secondary">Fecha final</span>
            <input
              type="date"
              value={draft.endDate ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
              className={inputCls}
            />
          </label>
          <div className="flex gap-2">
            {hasFilters && (
              <Button type="button" variant="outline" onClick={clearFilters} className="h-10">
                <X className="mr-1 h-4 w-4" /> Limpiar
              </Button>
            )}
            <Button type="submit" variant="primary" loading={isFetching} className="h-10 px-6">
              Aplicar filtros
            </Button>
          </div>
        </form>
      </section>

      {/* Container 2 — Tabla (llena el alto restante) */}
      <div className="flex min-h-0 flex-1 flex-col">
        <DataTable
          fill
          columns={columns}
          data={movements}
          rowKey={(r) => r.id}
          title="Movimientos"
          count={movements.length}
          loading={isFetching}
          emptyMessage="No hay movimientos para los filtros seleccionados"
        />
      </div>

      <MovementDetailModal
        movementId={detailId}
        onClose={() => setDetailId(null)}
        onViewCep={(id) => {
          setDetailId(null);
          setCepId(id);
        }}
      />
      <CepModal movementId={cepId} onClose={() => setCepId(null)} />
    </div>
  );
}
