"use client";
import * as React from "react";
import { isMSWEnabled } from "@/mocks/enabled";

/**
 * Arranca el worker de MSW en el navegador antes de renderizar la app,
 * para que ninguna petición se dispare antes de que el mock esté listo.
 * En producción (o con NEXT_PUBLIC_ENABLE_MSW="false") no hace nada.
 */
export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(!isMSWEnabled());

  React.useEffect(() => {
    if (!isMSWEnabled()) return;
    let active = true;
    import("@/mocks/browser")
      .then(({ worker }) => worker.start({ onUnhandledRequest: "bypass" }))
      // Renderiza aunque el worker falle: mejor una app degradada que una pantalla en blanco.
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-default border-t-brand" />
      </div>
    );
  }
  return <>{children}</>;
}
