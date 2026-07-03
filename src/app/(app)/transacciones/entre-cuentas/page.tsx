import { SendSpeiView } from "@/features/transactions/send-spei-view";

export default function EntreCuentasPage() {
  return (
    <SendSpeiView
      ownAccounts
      title="Transacción entre cuentas"
      description="Mueve dinero entre tus propias cuentas Medá."
    />
  );
}
