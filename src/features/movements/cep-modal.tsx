"use client";
import { Download } from "lucide-react";
import { DetailModal } from "@/components/ui/detail-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MedaLogo } from "@/features/auth/meda-logo";
import { formatMXN } from "@/lib/utils/format";
import { useMovementCep } from "@/lib/hooks/use-account";
import type { Cep } from "@/lib/api/account";

interface Props {
  movementId: string | null;
  onClose: () => void;
}

/** Ver CEP sin salir de la plataforma: comprobante renderizado en un modal. */
export function CepModal({ movementId, onClose }: Props) {
  const { data, isLoading } = useMovementCep(movementId);

  const download = (cep: Cep) => {
    const blob = new Blob([JSON.stringify(cep, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CEP-${cep.trackingKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DetailModal
      open={!!movementId}
      onClose={onClose}
      title="Comprobante Electrónico de Pago (CEP)"
      size="lg"
      footer={
        data && (
          <>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => download(data)}>
              <Download className="mr-1.5 h-4 w-4" /> Descargar
            </Button>
          </>
        )
      }
    >
      {isLoading || !data ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : (
        <div className="rounded-meda border border-border-default">
          <div className="flex items-center justify-between border-b border-border-default bg-muted px-5 py-4">
            <MedaLogo className="h-7" />
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-fg-tertiary">
                Importe
              </p>
              <p className="text-lg font-semibold text-fg">{formatMXN(data.amount)}</p>
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-4 px-5 py-5 sm:grid-cols-2">
            <Item label="Clave de rastreo" value={data.trackingKey} mono />
            <Item label="Referencia" value={data.reference} />
            <Item label="Fecha de operación" value={data.operationDate} />
            <Item label="Fecha de captura" value={data.captureDate} />
            <Item label="Concepto" value={data.concept} full />
          </div>

          <div className="grid gap-5 border-t border-border-default px-5 py-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-fg-tertiary">
                Ordenante
              </p>
              <p className="text-sm font-medium text-fg">{data.senderName}</p>
              <p className="text-sm text-fg-secondary">{data.senderBank}</p>
              <p className="font-mono text-xs text-fg-secondary">{data.senderClabe}</p>
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-fg-tertiary">
                Beneficiario
              </p>
              <p className="text-sm font-medium text-fg">{data.receiverName}</p>
              <p className="text-sm text-fg-secondary">{data.receiverBank}</p>
              <p className="font-mono text-xs text-fg-secondary">{data.receiverClabe}</p>
            </div>
          </div>

          <div className="border-t border-border-default bg-muted px-5 py-4">
            <p className="mb-1 text-[11px] uppercase tracking-wide text-fg-tertiary">
              Sello digital
            </p>
            <p className="break-all font-mono text-[11px] leading-relaxed text-fg-secondary">
              {data.digitalStamp}
            </p>
          </div>
        </div>
      )}
    </DetailModal>
  );
}

function Item({
  label,
  value,
  mono,
  full,
}: {
  label: string;
  value: string;
  mono?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="text-[11px] uppercase tracking-wide text-fg-tertiary">{label}</p>
      <p className={`mt-0.5 break-words text-sm text-fg ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </p>
    </div>
  );
}
