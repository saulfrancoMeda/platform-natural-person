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
    import("@/mocks/browser").then(({ worker }) =>
      worker
        .start({ onUnhandledRequest: "bypass" })
        .then(() => active && setReady(true)),
    );
    return () => {
      active = false;
    };
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
