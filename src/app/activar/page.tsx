import { ActivateView } from "@/features/auth/activate-view";

export default async function ActivarPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <ActivateView initialEmail={email ?? ""} />;
}
