"use client";
import { QrCode } from "lucide-react";
import { CopyField } from "@/components/ui/copy-field";
import { Spinner } from "@/components/ui/spinner";
import { useBalance } from "@/lib/hooks/use-account";

export function ReceiveSpeiView() {
  const { data: balance, isLoading } = useBalance();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Recibir SPEI</h1>
        <p className="mt-1 text-sm text-fg-secondary">
          Comparte estos datos para recibir transferencias en tu cuenta Medá.
        </p>
      </div>

      <div className="rounded-meda border border-border-default bg-surface p-6">
        {isLoading || !balance ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-meda bg-muted p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-meda bg-brand/15">
                <QrCode className="h-6 w-6 text-brand-dark" />
              </span>
              <div>
                <p className="text-sm font-medium text-fg">{balance.accountHolder}</p>
                <p className="text-xs text-fg-tertiary">Cuenta Medá</p>
              </div>
            </div>

            <CopyField label="CLABE" value={balance.clabe} />
            <CopyField label="Beneficiario" value={balance.accountHolder} />
            <CopyField label="Banco" value="Medá (STP)" />

            <p className="text-xs text-fg-tertiary">
              Las transferencias SPEI se acreditan normalmente en segundos y aparecen en tu
              historial de movimientos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
