import Link from "next/link";
import { MedaLogo } from "@/features/auth/meda-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DevelopGuide() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-16 items-center justify-between border-b border-border-default px-6">
        <Link href="/"><MedaLogo /></Link>
        <ThemeToggle />
      </header>
      <article className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/" className="text-sm text-fg-secondary hover:text-fg">← Volver al inicio</Link>
        <h1 className="mt-4 text-3xl font-semibold text-fg">Develop</h1>
        <p className="mt-2 text-lg text-fg-secondary">Construye features con tu agente de IA, siguiendo los estándares MEDA automáticamente.</p>

        <section className="mt-8 space-y-6 text-fg-secondary">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Crea componentes</h2>
            <p>Pídele a tu agente (Claude Code, Cursor, Gemini CLI, Codex, Copilot) que use el comando <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-fg">meda-fe-component</code>. Genera componentes con la estructura, accesibilidad, estados de UI y estilo MEDA ya resueltos.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Conecta endpoints</h2>
            <p>Con <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-fg">meda-fe-endpoint</code> el agente genera, desde un OpenAPI, los tipos, el cliente HTTP (con el contrato APIResponse de MEDA) y el hook de TanStack Query listo para usar.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Las skills guían al agente</h2>
            <p>Las 25 skills viven en el repo y se instalan para todos tus agentes. El agente las consulta solo: no tienes que recordarle los estándares en cada prompt.</p>
          </div>
        </section>
      </article>
    </main>
  );
}
