import * as React from "react";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { Badge } from "./badge";

type TxStatus = "SUCCESS" | "PROCESSING" | "FAILED" | "PENDING";

const statusVariant: Record<TxStatus, "success" | "warning" | "error" | "default"> = {
  SUCCESS: "success", PROCESSING: "warning", PENDING: "warning", FAILED: "error",
};

interface TransactionCardProps {
  orderNo: string;
  amount: number;
  currency?: string;
  status: TxStatus;
  date: string;
  merchant?: string;
  className?: string;
}

export function TransactionCard({ orderNo, amount, status, date, merchant, className }: TransactionCardProps) {
  return (
    <div className={cn("rounded-meda border border-border-default bg-surface p-4 transition-colors hover:border-brand/50", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-fg">{merchant ?? "Transaction"}</p>
          <p className="text-xs text-fg-secondary">{orderNo}</p>
        </div>
        <Badge variant={statusVariant[status]}>{status}</Badge>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold text-fg">{formatCurrency(amount)}</p>
        <p className="text-xs text-fg-secondary">{formatDateTime(date)}</p>
      </div>
    </div>
  );
}
