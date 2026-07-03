import * as React from "react";
import Link from "next/link";
interface Crumb { label: string; href?: string; }
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-fg-secondary">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {c.href ? <Link href={c.href} className="hover:text-fg">{c.label}</Link> : <span className="text-fg">{c.label}</span>}
            {i < items.length - 1 && <span className="text-fg-tertiary">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
