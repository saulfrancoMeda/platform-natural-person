"use client";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MedaLogo } from "@/features/auth/meda-logo";
import { COMPONENT_DOCS, type ComponentDoc, type Example } from "./component-examples";

// shadcn-style component explorer: list → click → detail panel (with motion) + multiple examples + code.
export default function ComponentsPage() {
  const [active, setActive] = React.useState<ComponentDoc | null>(COMPONENT_DOCS[0] ?? null);
  const groups = Array.from(new Set(COMPONENT_DOCS.map((c) => c.group)));

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-default bg-bg/90 px-6 py-4 backdrop-blur">
        <MedaLogo />
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-fg-secondary hover:text-fg">Home</Link>
          <Link href="/showcase" className="text-sm text-fg-secondary hover:text-fg">Showcase</Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        {/* Sidebar list */}
        <aside className="w-56 shrink-0">
          <h1 className="mb-1 text-lg font-semibold text-fg">Componentes</h1>
          <p className="mb-4 text-xs text-fg-secondary">{COMPONENT_DOCS.length} componentes con ejemplos.</p>
          <nav className="space-y-4">
            {groups.map((g) => (
              <div key={g}>
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fg-tertiary">{g}</p>
                <ul className="space-y-0.5">
                  {COMPONENT_DOCS.filter((c) => c.group === g).map((c) => (
                    <li key={c.name}>
                      <button onClick={() => setActive(c)}
                        className={`w-full rounded px-2 py-1 text-left text-sm transition-colors ${active?.name === c.name ? "bg-brand/15 text-brand-dark font-medium" : "text-fg-secondary hover:bg-muted hover:text-fg"}`}>
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Detail */}
        <main className="min-w-0 flex-1">
          {!active ? (
            <div className="rounded-meda border border-dashed border-border-default p-12 text-center">
              <p className="text-fg-secondary">Selecciona un componente para ver sus ejemplos y código.</p>
            </div>
          ) : (
            <div key={active.name} className="meda-page-enter">
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-fg">{active.name}</h2>
                <span className="rounded bg-muted px-2 py-0.5 text-xs text-fg-secondary">{active.group}</span>
              </div>
              <p className="mb-3 text-fg-secondary">{active.summary}</p>
              <CodeLine text={active.importLine} />
              <div className="mt-6 space-y-8">
                {active.examples.map((ex, i) => <ExampleBlock key={i} ex={ex} />)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ExampleBlock({ ex }: { ex: Example }) {
  const [showCode, setShowCode] = React.useState(false);
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-fg">{ex.title}</h3>
        <button onClick={() => setShowCode((s) => !s)} className="text-xs text-fg-secondary hover:text-fg">
          {showCode ? "Ver demo" : "Ver código"}
        </button>
      </div>
      <div className="rounded-meda border border-border-default">
        {!showCode ? (
          <div className="flex min-h-[88px] items-center justify-center p-6">{ex.node}</div>
        ) : (
          <CodeBlock text={ex.code} />
        )}
      </div>
    </section>
  );
}

function CodeLine({ text }: { text: string }) {
  return <code className="inline-block rounded bg-muted px-2 py-1 text-xs text-fg-secondary">{text}</code>;
}

function CodeBlock({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => { navigator.clipboard?.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="relative">
      <button onClick={copy} className="absolute right-2 top-2 rounded bg-surface px-2 py-1 text-xs text-fg-secondary ring-1 ring-border-default hover:text-fg">
        {copied ? "¡Copiado!" : "Copiar"}
      </button>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-fg"><code>{text}</code></pre>
    </div>
  );
}
