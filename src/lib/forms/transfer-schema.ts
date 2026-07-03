import type { FormSchema, Option } from "@/components/ui/form-renderer";
import { isValidCLABE, isValidRFC } from "@/lib/utils/validators";

/**
 * Transfer form schema — defined as DATA, kept in its own file (separation of concerns).
 * Demonstrates: async options from an endpoint (banks) and parent→child dependency
 * (account list depends on the selected bank). Swap the fetchers for your real API.
 */

// Example endpoint-backed options. Replace with your real client (api.get(...)).
async function fetchBanks(): Promise<Option[]> {
  // const { data } = await api.get<Bank[]>("/catalogs/banks");
  await new Promise((r) => setTimeout(r, 250)); // simulate latency
  return [
    { value: "bbva", label: "BBVA México" },
    { value: "stp", label: "STP" },
    { value: "banorte", label: "Banorte" },
    { value: "santander", label: "Santander" },
  ];
}

async function fetchAccountsForBank(bank: string): Promise<Option[]> {
  if (!bank) return [];
  // const { data } = await api.get(`/banks/${bank}/accounts`);
  await new Promise((r) => setTimeout(r, 250));
  return [
    { value: `${bank}-001`, label: `${bank.toUpperCase()} ···· 4567` },
    { value: `${bank}-002`, label: `${bank.toUpperCase()} ···· 6789` },
  ];
}

export const transferSchema: FormSchema = {
  submitLabel: "Revisar transferencia",
  columns: 2,
  fields: [
    { name: "beneficiary", label: "Beneficiario", type: "text", required: true, full: true, placeholder: "Nombre completo" },
    {
      name: "clabe", label: "CLABE", type: "text", required: true, full: true,
      placeholder: "0000 0000 0000 0000 00", description: "18 dígitos",
      validate: (v) => (isValidCLABE(String(v ?? "")) ? null : "La CLABE debe tener 18 dígitos"),
    },
    {
      name: "rfc", label: "RFC (opcional)", type: "text", placeholder: "XAXX010101000",
      validate: (v) => (!v || isValidRFC(String(v)) ? null : "RFC inválido"),
    },
    { name: "amount", label: "Monto", type: "amount", required: true, min: 1 },
    // Async options from an endpoint:
    { name: "bank", label: "Banco", type: "combobox", full: true, required: true, loadOptions: fetchBanks, placeholder: "Selecciona banco" },
    // Parent→child: accounts depend on the selected bank (re-fetches when `bank` changes):
    {
      name: "account", label: "Cuenta destino", type: "select", full: true, required: true,
      dependsOn: ["bank"],
      loadOptions: (values) => fetchAccountsForBank(String(values.bank ?? "")),
      visibleIf: (values) => !!values.bank,
      placeholder: "Selecciona cuenta",
    },
    { name: "concept", label: "Concepto (opcional)", type: "text", full: true, placeholder: "Pago de…" },
  ],
};
