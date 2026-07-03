"use client";
import * as React from "react";
import { ArrowDownLeft, ArrowUpRight, Bell, FileText } from "lucide-react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface Notification {
  id: string;
  icon: React.ReactNode;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
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
];

export function NotificationsMenu() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <DropdownMenu
      align="right"
      className="w-80 p-0"
      trigger={
        <span
          className="relative flex h-9 w-9 items-center justify-center rounded-control border border-border-default text-fg-secondary transition-colors hover:bg-muted hover:text-fg"
          aria-label="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </span>
      }
    >
      <div className="flex items-center justify-between border-b border-border-default px-4 py-3">
        <p className="text-sm font-semibold text-fg">Notificaciones</p>
        <span className="text-xs text-fg-tertiary">{unread} sin leer</span>
      </div>
      <ul className="max-h-80 overflow-auto">
        {NOTIFICATIONS.map((n) => (
          <li
            key={n.id}
            className="flex gap-3 border-b border-border-default px-4 py-3 last:border-0 hover:bg-muted"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              {n.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium text-fg">
                {n.title}
                {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
              </p>
              <p className="truncate text-xs text-fg-secondary">{n.detail}</p>
              <p className="mt-0.5 text-[11px] text-fg-tertiary">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
      <button className="w-full rounded-b-meda px-4 py-2.5 text-center text-sm font-medium text-brand-dark hover:bg-muted">
        Ver todas
      </button>
    </DropdownMenu>
  );
}
