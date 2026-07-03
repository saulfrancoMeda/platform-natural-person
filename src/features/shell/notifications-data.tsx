import * as React from "react";
import { ArrowDownLeft, ArrowUpRight, FileText, KeyRound, ShieldCheck } from "lucide-react";

export interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    icon: <ArrowDownLeft className="h-4 w-4 text-success" />,
    title: "Recibiste una transferencia",
    detail: "$18,500.00 MXN de Comercializadora del Norte",
    time: "Hace 5 min",
    unread: true,
  },
  {
    id: "n2",
    icon: <ArrowUpRight className="h-4 w-4 text-fg-secondary" />,
    title: "Transferencia enviada",
    detail: "$4,594.00 MXN — Completada",
    time: "Hace 1 h",
    unread: true,
  },
  {
    id: "n3",
    icon: <FileText className="h-4 w-4 text-brand-dark" />,
    title: "Estado de cuenta disponible",
    detail: "Ya puedes descargar el periodo Junio 2026",
    time: "Ayer",
    unread: false,
  },
  {
    id: "n4",
    icon: <ShieldCheck className="h-4 w-4 text-info" />,
    title: "Nuevo inicio de sesión",
    detail: "Acceso desde Chrome · macOS",
    time: "Hace 2 días",
    unread: false,
  },
  {
    id: "n5",
    icon: <KeyRound className="h-4 w-4 text-warning-dark" />,
    title: "NIP actualizado",
    detail: "Cambiaste tu NIP de transacciones correctamente",
    time: "Hace 3 días",
    unread: false,
  },
];
