"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
import { Columns3, Download, Maximize2, Minimize2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Table2 } from "lucide-react";

export interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  hidden?: boolean;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
}

type Density = "comfortable" | "compact" | "zen";

export interface DataTableStat { label: string; value: string; icon?: React.ReactNode; tone?: "brand" | "success" | "neutral"; }

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  /** Title shown in the toolbar (e.g. "Movimientos"). */
  title?: string;
  /** Count badge label, e.g. "50". Defaults to data.length. */
  count?: number | string;
  /** Summary stat chips in the toolbar (Monto total, etc.). */
  stats?: DataTableStat[];
  /** Search boxes in the toolbar. Each filters as you type across the given keys. */
  searchFields?: { placeholder: string; keys: (keyof T & string)[] }[];
  /** Action node on the right of the toolbar (e.g. <Button>Nueva transferencia</Button>). */
  actions?: React.ReactNode;
  /** Row click → detail. */
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  /** Client pagination with rows-per-page. Omit for static/small tables. */
  paginate?: boolean;
  pageSizeOptions?: number[];
  /** Export handler (CSV). If omitted, a default CSV export of visible columns runs. */
  onExport?: () => void;
  exportable?: boolean;
  /** Max height of the table body for INTERNAL scroll (header stays sticky). Default '32rem'.
   *  Pass `false` to let the table grow and the page scroll instead. */
  maxHeight?: string | false;
  /** Fill the parent's height (flex column): the table body flexes and scrolls internally.
   *  Use inside a flex-1/min-h-0 container to avoid page scroll. Overrides maxHeight. */
  fill?: boolean;
}

export function DataTable<T>({
  columns, data, rowKey, title, count, stats, searchFields, actions, onRowClick,
  loading, emptyMessage = "Sin registros", paginate = true, pageSizeOptions = [10, 25, 50, 100],
  onExport, exportable = true, maxHeight = "32rem", fill = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
  const [density, setDensity] = React.useState<Density>("comfortable");
  const [hidden, setHidden] = React.useState<Set<string>>(new Set(columns.filter((c) => c.hidden).map((c) => c.key)));
  const [queries, setQueries] = React.useState<string[]>(searchFields?.map(() => "") ?? []);
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(pageSizeOptions[2] ?? 50);
  const [zen, setZen] = React.useState(false);
  const [colsOpen, setColsOpen] = React.useState(false);

  const visibleCols = columns.filter((c) => !hidden.has(c.key));

  // Filter by search fields
  const filtered = React.useMemo(() => {
    if (!searchFields?.length) return data;
    return data.filter((row) =>
      searchFields.every((f, i) => {
        const q = (queries[i] ?? "").toLowerCase().trim();
        if (!q) return true;
        return f.keys.some((k) => String(row[k] ?? "").toLowerCase().includes(q));
      })
    );
  }, [data, searchFields, queries]);

  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof T]; const bv = b[sortKey as keyof T];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const total = sorted.length;
  const pageData = paginate ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  React.useEffect(() => { setPage(0); }, [queries, pageSize]);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };
  const toggleColumn = (key: string) =>
    setHidden((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });

  const defaultExport = () => {
    const head = visibleCols.map((c) => c.header).join(",");
    const rows = sorted.map((r) => visibleCols.map((c) => `"${String(r[c.key as keyof T] ?? "")}"`).join(","));
    const csv = [head, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${title ?? "export"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const pad = density === "zen" ? "px-2 py-1.5" : density === "compact" ? "px-3 py-2" : "px-4 py-3.5";

  return (
    <div className={cn("w-full", fill && "flex h-full min-h-0 flex-col", zen && "fixed inset-0 z-50 overflow-auto bg-bg p-4")}>
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        {(title || count != null) && (
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-meda bg-brand text-brand-foreground"><Table2 className="h-5 w-5" /></span>
            <div className="leading-tight">
              <p className="text-lg font-semibold text-fg">{count ?? data.length}</p>
              {title && <p className="text-[11px] uppercase tracking-wide text-fg-tertiary">{title}</p>}
            </div>
          </div>
        )}
        {stats?.map((s, i) => (
          <div key={i} className="flex items-center gap-2 rounded-meda border border-border-default bg-surface px-3 py-1.5">
            {s.icon && <span className={cn("text-sm", s.tone === "success" ? "text-success" : s.tone === "brand" ? "text-brand-dark" : "text-fg-secondary")}>{s.icon}</span>}
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-wide text-fg-tertiary">{s.label}</p>
              <p className="text-sm font-semibold text-fg">{s.value}</p>
            </div>
          </div>
        ))}
        {searchFields?.map((f, i) => (
          <input key={i} value={queries[i] ?? ""} placeholder={f.placeholder}
            onChange={(e) => setQueries((q) => { const n = q.slice(); n[i] = e.target.value; return n; })}
            className="h-9 w-44 rounded-control border border-border-default bg-surface px-3 text-sm text-fg outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/40" />
        ))}
        <div className="ml-auto flex items-center gap-2">
          {actions}
          {/* Column visibility */}
          <div className="relative">
            <button onClick={() => setColsOpen((o) => !o)} aria-label="Personalizar columnas"
              className="flex h-9 w-9 items-center justify-center rounded-control border border-border-default text-fg-secondary hover:bg-muted hover:text-fg transition-colors"><Columns3 className="h-4 w-4" /></button>
            {colsOpen && (
              <div className="meda-pop absolute right-0 z-20 mt-1 w-52 rounded-meda border border-border-default bg-surface p-3 shadow-lg">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-fg">Columnas visibles</p>
                  <button onClick={() => setHidden(new Set())} className="text-xs text-fg-tertiary hover:text-fg">Restablecer</button>
                </div>
                <div className="max-h-64 space-y-1 overflow-auto">
                  {columns.map((c, ci) => (
                    <label key={ci} className="flex items-center gap-2 py-1 text-sm text-fg">
                      <input type="checkbox" checked={!hidden.has(c.key)} onChange={() => toggleColumn(c.key)} className="accent-brand" />
                      {c.header}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          {exportable && (
            <button onClick={onExport ?? defaultExport}
              className="flex h-9 items-center gap-1.5 rounded-control border border-border-default px-3 text-sm text-fg transition-colors hover:bg-muted hover:text-fg">
              <Download className="h-4 w-4" /> Exportar
            </button>
          )}
          <button onClick={() => setZen((z) => !z)} aria-label={zen ? "Salir de modo zen" : "Modo zen"}
            className="flex h-9 w-9 items-center justify-center rounded-control border border-border-default text-fg-secondary transition-colors hover:bg-muted hover:text-fg">
            {zen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Density */}
      <div className="mb-2 flex items-center gap-1 text-xs">
        <span className="text-fg-secondary">Densidad:</span>
        {(["comfortable", "compact", "zen"] as Density[]).map((d) => (
          <button key={d} onClick={() => setDensity(d)}
            className={cn("rounded px-2 py-1 capitalize", density === d ? "bg-brand text-brand-foreground" : "text-fg-secondary hover:bg-muted")}>
            {d === "comfortable" ? "Cómodo" : d === "compact" ? "Compacto" : "Zen"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={cn("w-full overflow-auto rounded-meda border border-border-default", fill && "min-h-0 flex-1")}
        style={fill || maxHeight === false ? undefined : { maxHeight }}>
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-table-head">
            <tr>
              {visibleCols.map((c, ci) => (
                <th key={ci}
                  className={cn(pad, "text-left text-xs font-semibold uppercase tracking-wide text-table-subtitle",
                    c.align === "right" && "text-right", c.align === "center" && "text-center",
                    c.sortable && "cursor-pointer select-none")}
                  onClick={() => c.sortable && toggleSort(c.key)}>
                  {c.header}
                  {sortKey === c.key && (sortDir === "asc" ? <ChevronUp className="ml-1 inline h-3.5 w-3.5" /> : <ChevronDown className="ml-1 inline h-3.5 w-3.5" />)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-t border-border-default">
                  {visibleCols.map((c, ci) => <td key={ci} className={pad}><div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-muted" /></td>)}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr><td colSpan={visibleCols.length} className={cn(pad, "py-12 text-center text-fg-secondary")}>{emptyMessage}</td></tr>
            ) : (
              pageData.map((row) => (
                <tr key={rowKey(row)} onClick={() => onRowClick?.(row)}
                  className={cn("border-t border-border-default transition-colors", onRowClick ? "cursor-pointer hover:bg-muted" : "hover:bg-muted/50")}>
                  {visibleCols.map((c, ci) => (
                    <td key={ci} className={cn(pad, "text-fg", c.align === "right" && "text-right", c.align === "center" && "text-center")}>
                      {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginate && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-fg-secondary">Mostrando {total === 0 ? 0 : page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} de {total} registros · Página {page + 1} de {totalPages}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-fg-secondary">
              Filas por página:
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-8 rounded-control border border-border-default bg-surface px-2 text-sm text-fg outline-none focus:border-brand">
                {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="flex items-center gap-1 rounded-control border border-border-default px-3 py-1.5 text-sm text-fg disabled:opacity-40 hover:bg-muted"><ChevronLeft className="h-4 w-4" /> Anterior</button>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="flex items-center gap-1 rounded-control border border-border-default px-3 py-1.5 text-sm text-fg disabled:opacity-40 hover:bg-muted">Siguiente <ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
