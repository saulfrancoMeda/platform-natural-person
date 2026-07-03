import { StatementDocument } from "@/features/account-statements/statement-document";

export default async function EstadoDeCuentaDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { id } = await params;
  const { print } = await searchParams;
  return <StatementDocument id={id} autoPrint={print === "1"} />;
}
