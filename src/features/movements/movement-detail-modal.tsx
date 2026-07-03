"use client";
import { FileText, ReceiptText } from "lucide-react";
import { DetailModal, type DetailField } from "@/components/ui/detail-modal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatMXN } from "@/lib/utils/format";
import { useMovementDetail } from "@/lib/hooks/use-account";
import { StatusBadge } from "./movement-status-badge";

interface Props {
  movementId: string | null;
  onClose: () => void;
  onViewCep: (id: string) => void;
}

export function MovementDetailModal({ movementId, onClose, onViewCep }: Props) {
  const { data, isLoading } = useMovementDetail(movementId);

  const fields: DetailField[] = data
    ? [
        { label: "No. transacción", value: data.id },
        { label: "Fecha", value: data.date },
        { label: "Tipo", value: data.type },
        { label: "Estado", value: <StatusBadge status={data.status} /> },
        { label: "No. referencia", value: data.reference },
        { label: "Clave de rastreo", value: data.trackingKey },
        { label: "Red", value: data.network },
        { label: "Concepto", value: data.concept },
      ]
    : [];

  return (
    <DetailModal
      open={!!movementId}
      onClose={onClose}
      title="Detalle del movimiento"
      icon={<ReceiptText className="h-5 w-5" />}
      size="lg"
      fields={fields}
      footer={
        data && (
          <>
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="primary" onClick={() => onViewCep(data.id)}>
              <FileText className="mr-1.5 h-4 w-4" /> Ver CEP
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
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-meda border border-border-default p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-fg-tertiary">
              Ordenante
            </p>
            <dl className="space-y-2 text-sm">
              <Row label="Nombre" value={data.senderName} />
              <Row label="CLABE" value={data.senderClabe} />
              <Row label="Banco" value={data.senderBank} />
            </dl>
          </div>
          <div className="rounded-meda border border-border-default p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-fg-tertiary">
              Beneficiario
            </p>
            <dl className="space-y-2 text-sm">
              <Row label="Nombre" value={data.receiverName} />
              <Row label="CLABE" value={data.receiverClabe} />
              <Row label="Banco" value={data.receiverBank} />
            </dl>
          </div>
          <div className="rounded-meda bg-muted p-4 sm:col-span-2">
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Row label="Importe" value={formatMXN(data.amount)} strong />
              <Row label="Comisión" value={formatMXN(data.commission)} />
              <Row label="IVA" value={formatMXN(data.iva)} />
            </dl>
          </div>
        </div>
      )}
    </DetailModal>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-fg-tertiary">{label}</dt>
      <dd className={strong ? "font-semibold text-fg" : "text-fg"}>{value}</dd>
    </div>
  );
}
