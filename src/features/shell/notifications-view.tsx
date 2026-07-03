"use client";
import { NOTIFICATIONS } from "./notifications-data";

export function NotificationsView() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Notificaciones</h1>
        <p className="mt-1 text-sm text-fg-secondary">
          {unread > 0 ? `Tienes ${unread} notificaciones sin leer.` : "Estás al día."}
        </p>
      </div>

      <ul className="overflow-hidden rounded-meda border border-border-default bg-surface">
        {NOTIFICATIONS.map((n) => (
          <li
            key={n.id}
            className="flex gap-3 border-b border-border-default px-5 py-4 last:border-0 hover:bg-muted"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              {n.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium text-fg">
                {n.title}
                {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />}
              </p>
              <p className="text-sm text-fg-secondary">{n.detail}</p>
              <p className="mt-0.5 text-xs text-fg-tertiary">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
