"use client";
import * as React from "react";
import { cn } from "@/lib/cn";
interface PaginationProps { page: number; totalPages: number; onPage: (p: number) => void; className?: string; }
/** Numbered pagination UI (offset). For cursor pagination use DataTable's pagination prop instead. */
export function Pagination({ page, totalPages, onPage, className }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button onClick={() => onPage(page - 1)} disabled={page <= 1}
        className="rounded-meda border border-border-default px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-muted">Prev</button>
      {pages.map((p, i) => (
        <React.Fragment key={p}>
          {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-fg-tertiary">…</span>}
          <button onClick={() => onPage(p)} aria-current={p === page}
            className={cn("rounded-meda px-3 py-1.5 text-sm", p === page ? "bg-brand text-brand-foreground" : "border border-border-default text-fg hover:bg-muted")}>{p}</button>
        </React.Fragment>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={page >= totalPages}
        className="rounded-meda border border-border-default px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-muted">Next</button>
    </nav>
  );
}
