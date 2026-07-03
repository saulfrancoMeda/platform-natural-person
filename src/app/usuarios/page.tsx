"use client";
import * as React from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AppShell } from "@/components/ui/app-shell";
import { DataTable, type Column } from "@/components/ui/data-table";
import { CrudFormDialog } from "@/components/ui/crud-form-dialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useToast, ToastProvider } from "@/components/ui/toast";
import { userSchema } from "@/lib/forms/user-schema";
import type { FormValues } from "@/components/ui/form-renderer";

interface User { id: string; email: string; firstName: string; lastName: string; role: string; status: string; created: string; }
const SEED: User[] = [
  { id: "1", email: "ana.garcia@meda.com.mx", firstName: "Ana", lastName: "García", role: "admin", status: "active", created: "15 ene 2026" },
  { id: "2", email: "carlos.lopez@meda.com.mx", firstName: "Carlos", lastName: "López", role: "operator", status: "active", created: "3 feb 2026" },
  { id: "3", email: "maria.torres@meda.com.mx", firstName: "María", lastName: "Torres", role: "viewer", status: "inactive", created: "10 mar 2026" },
];
const ROLE_LABEL: Record<string, string> = { admin: "Administrador", operator: "Operador", viewer: "Consulta" };

/**
 * Full CRUD pattern: DataTable (list) + CrudFormDialog (create/edit, same schema) + ConfirmDialog (delete).
 * The create/edit form is schema-driven (lib/forms/user-schema.ts). Copy this as the template for any
 * admin resource — swap the schema, columns and data source.
 */
function AdminCrudInner() {
  const { show } = useToast();
  const [rows, setRows] = React.useState<User[]>(SEED);
  const [editing, setEditing] = React.useState<User | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<User | null>(null);

  const upsert = (v: FormValues) => {
    if (editing) {
      setRows((r) => r.map((u) => (u.id === editing.id ? { ...u, ...v } as User : u)));
      show("success", "Usuario actualizado");
    } else {
      setRows((r) => [{ id: String(Date.now()), created: "hoy", ...(v as object) } as User, ...r]);
      show("success", "Usuario creado");
    }
    setEditing(null); setCreating(false);
  };

  const cols: Column<User>[] = [
    { key: "firstName", header: "Usuario", render: (u) => (
      <div className="flex items-center gap-3">
        <Avatar name={`${u.firstName} ${u.lastName}`} size="sm" />
        <div><p className="font-medium text-fg">{u.firstName} {u.lastName}</p><p className="text-xs text-fg-secondary">{u.email}</p></div>
      </div>
    ) },
    { key: "role", header: "Rol", render: (u) => <Badge variant={u.role === "admin" ? "brand" : u.role === "operator" ? "info" : "default"}>{ROLE_LABEL[u.role] ?? u.role}</Badge> },
    { key: "status", header: "Estado", render: (u) => (
      <span className={`inline-flex items-center gap-1.5 text-sm ${u.status === "active" ? "text-success" : "text-fg-tertiary"}`}>
        <span className={`h-2 w-2 rounded-full ${u.status === "active" ? "bg-success" : "bg-border-strong"}`} />{u.status === "active" ? "Activo" : "Inactivo"}
      </span>
    ) },
    { key: "created", header: "Alta", align: "right" },
    { key: "id", header: "Acciones", align: "right", render: (u) => (
      <div className="flex justify-end gap-1.5">
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditing(u); }}><Pencil className="h-3.5 w-3.5" /></Button>
        <Button size="sm" variant="danger" onClick={(e) => { e.stopPropagation(); setDeleting(u); }}><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
    ) },
  ];

  return (
    <AppShell activeHref="/usuarios" groups={[
      { title: "Operación", items: [{ label: "Movimientos", href: "/movimientos", icon: "▤" }, { label: "Transferencias", href: "/transferencias", icon: "⇄" }] },
      { title: "Administración", items: [{ label: "Usuarios", href: "/usuarios", icon: "◍" }, { label: "Roles", href: "/roles", icon: "◆" }] },
    ]}>
      <h1 className="mb-1 text-2xl font-semibold text-fg">Usuarios</h1>
      <p className="mb-6 text-fg-secondary">Alta, edición, baja y asignación de roles.</p>
      <DataTable
        title="USUARIOS" count={rows.length} data={rows} columns={cols} rowKey={(u) => u.id}
        searchFields={[{ placeholder: "Buscar usuario…", keys: ["firstName", "lastName", "email"] }]}
        actions={<Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Nuevo usuario</Button>}
        onRowClick={(u) => setEditing(u)}
      />

      <CrudFormDialog open={creating} onClose={() => setCreating(false)} mode="create"
        title="Nuevo usuario" schema={userSchema} onSubmit={upsert} />

      <CrudFormDialog open={!!editing} onClose={() => setEditing(null)} mode="edit"
        title="Editar usuario" schema={userSchema} initialValues={editing ? { ...editing } as FormValues : undefined} onSubmit={upsert} />

      <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)}
        onConfirm={() => { setRows((r) => r.filter((u) => u.id !== deleting?.id)); show("info", "Usuario eliminado"); setDeleting(null); }}
        title="Eliminar usuario" description={`¿Eliminar a ${deleting?.firstName} ${deleting?.lastName}? Esta acción no se puede deshacer.`} confirmLabel="Eliminar" />
    </AppShell>
  );
}

export default function AdminCrudPage() {
  return <ToastProvider><AdminCrudInner /></ToastProvider>;
}
