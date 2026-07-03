import Link from "next/link";
import { MedaLogo } from "@/features/auth/meda-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function StandardsGuide() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="flex h-16 items-center justify-between border-b border-border-default px-6">
        <Link href="/"><MedaLogo /></Link>
        <ThemeToggle />
      </header>
      <article className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/" className="text-sm text-fg-secondary hover:text-fg">← Volver al inicio</Link>
        <h1 className="mt-4 text-3xl font-semibold text-fg">Standards</h1>
        <p className="mt-2 text-lg text-fg-secondary">Las skills imponen calidad por defecto, sin que tengas que recordarla en cada cambio.</p>

        <section className="mt-8 space-y-6 text-fg-secondary">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Arquitectura y SRP</h2>
            <p>Estructura por feature, responsabilidad única por archivo, separación de UI / estado / data-fetching. El agente sigue estas reglas al generar código.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Seguridad fintech</h2>
            <p>Versiones exactas (sin caret) por supply-chain, nada de PII en logs (máscaras en utils), validación de entradas. Crítico para una plataforma de pagos.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Los cuatro estados de UI</h2>
            <p>Toda vista con datos maneja loading, error, vacío y éxito. Nada de pantallas que se quedan en blanco o sin feedback.</p>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-semibold text-fg">Diseño MEDA (estilo Binance)</h2>
            <p>Tokens de color, tipografía y espaciado consistentes; modo oscuro por defecto; accesibilidad. Todo componente nuevo respeta el sistema.</p>
          </div>
        </section>
      </article>
    </main>
  );
}
