import { cn } from "@/lib/cn";
import type { MovementStatus, MovementType } from "@/lib/api/account";

const STATUS_STYLES: Record<MovementStatus, string> = {
  Completado: "bg-success/12 text-success-dark",
  "En proceso": "bg-info/12 text-info",
  Devuelto: "bg-error/12 text-error-dark",
};

export function StatusBadge({ status }: { status: MovementStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function TypeLabel({ type }: { type: MovementType }) {
  return (
    <span
      className={cn(
        "text-sm font-medium",
        type === "Recepción" ? "text-success-dark" : "text-fg",
      )}
    >
      {type}
    </span>
  );
}
