"use client";
import * as React from "react";
import { KeyRound } from "lucide-react";
import { DetailModal } from "@/components/ui/detail-modal";
import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { validateNip } from "@/lib/api/auth";
import { MedaApiError } from "@/lib/api/client";

interface Props {
  open: boolean;
  title?: string;
  description: string;
  onClose: () => void;
  /** Se llama solo cuando el NIP es válido, con el NIP ingresado. */
  onValid: (nip: string) => void;
}

/** Solicita y valida el NIP (6 dígitos) contra la API antes de una acción sensible. */
export function NipDialog({ open, title = "Autoriza con tu NIP", description, onClose, onValid }: Props) {
  const [nip, setNip] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [validating, setValidating] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setNip("");
      setError(null);
    }
  }, [open]);

  const confirm = async () => {
    if (nip.length !== 6) return;
    setValidating(true);
    setError(null);
    try {
      await validateNip(nip);
      onValid(nip);
    } catch (err) {
      setError(
        err instanceof MedaApiError && err.message ? err.message : "No se pudo validar el NIP.",
      );
    } finally {
      setValidating(false);
    }
  };

  return (
    <DetailModal open={open} onClose={onClose} title={title} icon={<KeyRound className="h-5 w-5" />}>
      <div className="flex flex-col items-center gap-5 py-2">
        <p className="text-center text-sm text-fg-secondary">{description}</p>

        <InputOTP length={6} value={nip} onChange={setNip} error={!!error} />
        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={validating}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            loading={validating}
            disabled={nip.length !== 6}
            onClick={confirm}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </DetailModal>
  );
}
