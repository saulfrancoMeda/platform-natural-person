"use client";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { DropdownMenu, DropdownItem } from "@/components/ui/dropdown-menu";

interface Props {
  name: string;
  email: string;
  onLogout: () => void;
}

export function UserMenu({ name, email, onLogout }: Props) {
  const router = useRouter();
  return (
    <DropdownMenu
      align="right"
      className="w-64"
      trigger={
        <span className="flex items-center gap-2 rounded-control border border-border-default py-1 pl-1 pr-2 transition-colors hover:bg-muted">
          <Avatar name={name} size="sm" />
          <span className="hidden text-sm font-medium text-fg sm:inline">{name.split(" ")[0]}</span>
          <ChevronDown className="h-4 w-4 text-fg-tertiary" />
        </span>
      }
    >
      <div className="flex items-center gap-3 border-b border-border-default px-3 py-3">
        <Avatar name={name} size="md" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-fg">{name}</p>
          <p className="truncate text-xs text-fg-tertiary">{email}</p>
        </div>
      </div>
      <div className="py-1">
        <DropdownItem onClick={() => router.push("/perfil")}>
          <User className="mr-2 h-4 w-4 text-fg-tertiary" /> Mi perfil
        </DropdownItem>
        <DropdownItem danger onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
        </DropdownItem>
      </div>
    </DropdownMenu>
  );
}
