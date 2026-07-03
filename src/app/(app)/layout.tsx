"use client";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileText,
  HeartHandshake,
  Repeat,
} from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import type { NavGroup } from "@/components/ui/sidebar";
import { MedaLogo } from "@/features/auth/meda-logo";
import { NotificationsMenu } from "@/features/shell/notifications-menu";
import { UserMenu } from "@/features/shell/user-menu";
import { useAuthStore } from "@/lib/stores/auth-store";
import { logout as apiLogout } from "@/lib/api/auth";

const GROUPS: NavGroup[] = [
  {
    title: "Transacciones",
    items: [
      { label: "Enviar SPEI", href: "/transacciones/enviar-spei", icon: <ArrowUpFromLine className="h-4 w-4" /> },
      { label: "Recibir SPEI", href: "/transacciones/recibir-spei", icon: <ArrowDownToLine className="h-4 w-4" /> },
      { label: "Entre cuentas", href: "/transacciones/entre-cuentas", icon: <Repeat className="h-4 w-4" /> },
    ],
  },
  {
    title: "Mi cuenta",
    items: [
      { label: "Movimientos", href: "/movimientos", icon: <ArrowLeftRight className="h-4 w-4" /> },
      { label: "Estados de cuenta", href: "/estados-de-cuenta", icon: <FileText className="h-4 w-4" /> },
      { label: "Beneficiario", href: "/beneficiario", icon: <HeartHandshake className="h-4 w-4" /> },
    ],
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => setHydrated(true), []);
  React.useEffect(() => {
    if (hydrated && !isAuthenticated) router.replace("/login");
  }, [hydrated, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
      /* la sesión local se limpia igual */
    }
    logout();
    router.replace("/login");
  };

  if (!hydrated || !isAuthenticated) return null;

  const isBeneficiary = user?.role === "BENEFICIARY";

  return (
    <AppShell
      groups={GROUPS}
      activeHref={pathname}
      sidebarHeader={<MedaLogo className="h-8" />}
      topRight={
        <div className="flex items-center gap-2">
          <NotificationsMenu />
          <UserMenu name={user?.name ?? ""} email={user?.email ?? ""} onLogout={handleLogout} />
        </div>
      }
    >
      {isBeneficiary && (
        <div className="mb-5 flex items-center gap-2 rounded-meda border border-brand/40 bg-brand/10 px-4 py-3 text-sm text-fg">
          <HeartHandshake className="h-4 w-4 shrink-0 text-brand-dark" />
          Estás accediendo por sucesión como beneficiario de{" "}
          <span className="font-semibold">{user?.holderName}</span>.
        </div>
      )}
      {children}
    </AppShell>
  );
}
