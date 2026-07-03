import { StatementDocument } from "@/features/account-statements/statement-document";

export default async function EstadoDeCuentaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StatementDocument id={id} />;
}
