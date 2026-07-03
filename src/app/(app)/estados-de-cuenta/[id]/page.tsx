import { Suspense } from "react";
import { StatementDocument } from "@/features/account-statements/statement-document";
import { ACCOUNT_STATEMENTS } from "@/mocks/data";

// Necesario para el export estático: genera una página por periodo disponible.
export function generateStaticParams() {
  return ACCOUNT_STATEMENTS.map((s) => ({ id: s.id }));
}

export default async function EstadoDeCuentaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={null}>
      <StatementDocument id={id} />
    </Suspense>
  );
}
