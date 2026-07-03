import Link from "next/link";
import { MedaLogo } from "@/features/auth/meda-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function MockGuide() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-16 items-center justify-between border-b border-border-default px-6">
        <Link href="/"><MedaLogo /></Link>
        <ThemeToggle />
      </header>
      <article className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/" className="text-sm text-fg-secondary hover:text-fg">← Volver al inicio</Link>
        <h1 className="mt-4 text-3xl font-semibold text-fg">Mock</h1>
        <p className="mt-2 text-lg text-fg-secondary">¿El endpoint no está listo? Desarrolla el front sin esperar al backend con MSW.</p>

        <section className="mt-8 space-y-6 text-fg-secondary">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Ya está configurado</h2>
            <p>MSW (Mock Service Worker) intercepta las peticiones de red en el navegador. Está listo en <code className="rounded bg-muted px-1.5 py-0.5 text-sm text-fg">src/mocks/</code>.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Define handlers</h2>
            <p>Agrega un handler que devuelva la forma exacta de la respuesta real (incluyendo el contrato APIResponse de MEDA). Tu UI consume el mock como si fuera la API; cuando el backend esté listo, quitas el handler y no cambias nada más.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">La skill fe-mocking</h2>
            <p>Explica el flujo completo: cómo escribir handlers, simular errores y estados de carga, y mantener los mocks alineados con el contrato. Pídele a tu agente que la use.</p>
          </div>
        </section>
      </article>
    </main>
  );
}
