import * as React from "react";
import { cn } from "@/lib/cn";
type Variant = "info" | "success" | "warning" | "error";
const styles: Record<Variant, string> = {
  info: "border-info/30 bg-info/10 text-info-dark",
  success: "border-success/30 bg-success/10 text-success-dark",
  warning: "border-warning/30 bg-warning/10 text-warning-dark",
  error: "border-error/30 bg-error/10 text-error-dark",
};
export function Alert({ variant = "info", title, children, className }: { variant?: Variant; title?: string; children?: React.ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn("rounded-meda border px-4 py-3 text-sm", styles[variant], className)}>
      {title && <p className="font-semibold mb-1">{title}</p>}
      {children}
    </div>
  );
}
