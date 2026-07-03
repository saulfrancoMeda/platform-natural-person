import { SuccessionView } from "@/features/auth/succession-view";

export default async function SucesionPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <SuccessionView initialEmail={email ?? ""} />;
}
