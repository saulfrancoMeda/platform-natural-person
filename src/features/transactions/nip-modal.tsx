"use client";
import * as React from "react";
import { KeyRound } from "lucide-react";
import { DetailModal } from "@/components/ui/detail-modal";
import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { formatMXN } from "@/lib/utils/format";

interface Props {
  open: boolean;
  amount: number;
  receiverName: string;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (nip: string) => void;
}

/** Autorización con NIP (6 dígitos) antes de ejecutar la transferencia. */
export function NipModal({ open, amount, receiverName, submitting, onClose, onConfirm }: Props) {
  const [nip, setNip] = React.useState("");

  React.useEffect(() => {
    if (open) setNip("");
  }, [open]);

  return (
    <DetailModal
      open={open}
      onClose={onClose}
      title="Autoriza con tu NIP"
      icon={<KeyRound className="h-5 w-5" />}
    >
      <div className="flex flex-col items-center gap-5 py-2">
        <p className="text-center text-sm text-fg-secondary">
          Vas a enviar <span className="font-semibold text-fg">{formatMXN(amount)}</span> a{" "}
          <span className="font-medium text-fg">{receiverName}</span>. Ingresa el código que enviamos a tu correo.
        </p>

        <InputOTP length={6} value={nip} onChange={setNip} />

        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            loading={submitting}
            disabled={nip.length !== 6}
            onClick={() => onConfirm(nip)}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </DetailModal>
  );
}
