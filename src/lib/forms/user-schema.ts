import type { FormSchema } from "@/components/ui/form-renderer";

/**
 * User form schema (create/edit). Same schema drives both flows — pass initialValues for edit.
 * Roles could come from an endpoint via loadOptions; kept static here for clarity.
 */
export const userSchema: FormSchema = {
  submitLabel: "Guardar usuario",
  columns: 2,
  fields: [
    { name: "email", label: "Correo", type: "email", required: true, full: true, placeholder: "usuario@meda.com.mx" },
    { name: "firstName", label: "Nombre", type: "text", required: true },
    { name: "lastName", label: "Apellido", type: "text", required: true },
    { name: "status", label: "Estado", type: "select", options: [{ value: "active", label: "Activo" }, { value: "inactive", label: "Inactivo" }] },
    { name: "role", label: "Rol", type: "select", required: true, options: [
      { value: "viewer", label: "Consulta" }, { value: "operator", label: "Operador" }, { value: "admin", label: "Administrador" },
    ] },
  ],
};
