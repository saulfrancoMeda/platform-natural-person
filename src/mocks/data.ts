/**
 * Datos mock para la plataforma de persona física.
 * Reflejan la forma EXACTA que devolverá el backend (envolvente APIResponse aparte).
 * Cuando el endpoint real exista, se apaga MSW y nada de esto se usa.
 */

export type MovementType = "Envío" | "Recepción";
export type MovementStatus = "Completado" | "En proceso" | "Devuelto";

export interface Movement {
  id: string; // NO. TRANSACCIÓN
  date: string; // FECHA "2026-07-01 13:29:45"
  reference: string; // NO. REFERENCIA
  trackingKey: string; // CVE. RASTREO
  type: MovementType; // TIPO
  amount: number; // IMPORTE
  status: MovementStatus; // ESTADO
  network: "Interna" | "Externa";
}

export interface MovementDetail extends Movement {
  concept: string;
  senderName: string;
  senderClabe: string;
  senderBank: string;
  receiverName: string;
  receiverClabe: string;
  receiverBank: string;
  commission: number;
  iva: number;
}

/** Comprobante Electrónico de Pago (CEP) simulado. */
export interface Cep {
  trackingKey: string;
  operationDate: string;
  captureDate: string;
  senderBank: string;
  senderName: string;
  senderClabe: string;
  receiverBank: string;
  receiverName: string;
  receiverClabe: string;
  concept: string;
  amount: number;
  iva: number;
  reference: string;
  digitalStamp: string;
}

export interface AccountStatement {
  id: string;
  period: string; // "Julio 2026"
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  generatedAt: string;
  status: "Disponible" | "Generando";
}

const BANKS = ["STP", "BBVA", "Banorte", "HSBC", "Santander", "Banamex"];
const CONCEPTS = [
  "Pago de servicios",
  "Transferencia entre cuentas",
  "Abono SPEI",
  "Pago a tercero",
  "Depósito recibido",
  "Envío a cuenta propia",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Genera CVE de rastreo pseudo-aleatoria determinista. */
function trackingKey(seed: number): string {
  const hex = (seed * 2654435761) >>> 0;
  return `${hex.toString(16).padStart(8, "0")}${((seed * 40503) >>> 0)
    .toString(16)
    .padStart(8, "0")}${((seed * 22695477) >>> 0).toString(16).slice(0, 8)}`;
}

function uuid(seed: number): string {
  const h = (seed * 2654435761) >>> 0;
  const a = h.toString(16).padStart(8, "0");
  const b = ((seed * 40503) >>> 0).toString(16).padStart(4, "0").slice(0, 4);
  const c = ((seed * 22695477) >>> 0).toString(16).padStart(4, "0").slice(0, 4);
  const d = ((seed * 69069) >>> 0).toString(16).padStart(4, "0").slice(0, 4);
  const e = ((seed * 1103515245) >>> 0).toString(16).padStart(12, "0").slice(0, 12);
  return `${a}-${b}-${c}-${d}-${e}`;
}

const STATUSES: MovementStatus[] = [
  "Completado",
  "Completado",
  "Completado",
  "Completado",
  "En proceso",
  "Devuelto",
];

/** 167 movimientos, como muestra la interfaz de referencia. */
export const MOVEMENTS: Movement[] = Array.from({ length: 167 }, (_, i) => {
  const seed = i + 1;
  const type: MovementType = seed % 3 === 1 ? "Recepción" : "Envío";
  const day = 28 - (i % 28);
  const month = 7 - (i % 6);
  const amounts = [1.16, 5, 4594, 18500, 0.01, 192.28, 25, 10400, 1638, 650, 4000];
  return {
    id: uuid(seed),
    date: `2026-${pad(month)}-${pad(day)} ${pad(6 + (i % 12))}:${pad((i * 7) % 60)}:${pad(
      (i * 13) % 60,
    )}`,
    reference: String(100000 + ((seed * 97) % 900000)),
    trackingKey: trackingKey(seed),
    type,
    amount: amounts[i % amounts.length],
    status: STATUSES[i % STATUSES.length],
    network: seed % 2 === 0 ? "Externa" : "Interna",
  };
});

export function movementDetail(id: string): MovementDetail {
  const base = MOVEMENTS.find((m) => m.id === id) ?? MOVEMENTS[0];
  const seed = MOVEMENTS.indexOf(base) + 1;
  return {
    ...base,
    concept: CONCEPTS[seed % CONCEPTS.length],
    senderName: base.type === "Envío" ? "Juan Pérez López" : "Comercializadora del Norte SA",
    senderClabe: `6461800${String(1000000000 + ((seed * 7919) % 8999999999)).slice(0, 11)}`,
    senderBank: BANKS[seed % BANKS.length],
    receiverName: base.type === "Envío" ? "María García Ruiz" : "Juan Pérez López",
    receiverClabe: `0121800${String(1000000000 + ((seed * 6197) % 8999999999)).slice(0, 11)}`,
    receiverBank: BANKS[(seed + 2) % BANKS.length],
    commission: base.amount > 1000 ? 8 : 0,
    iva: base.amount > 1000 ? 1.28 : 0,
  };
}

export function movementCep(id: string): Cep {
  const d = movementDetail(id);
  return {
    trackingKey: d.trackingKey,
    operationDate: d.date,
    captureDate: d.date,
    senderBank: d.senderBank,
    senderName: d.senderName,
    senderClabe: d.senderClabe,
    receiverBank: d.receiverBank,
    receiverName: d.receiverName,
    receiverClabe: d.receiverClabe,
    concept: d.concept,
    amount: d.amount,
    iva: d.iva,
    reference: d.reference,
    digitalStamp:
      "MEDApGVzdGFtcGRpZ2l0YWx8" +
      d.trackingKey.toUpperCase() +
      "|c2Vsc29kaWdpdGFsZGVsc2F0ZW5lbGNlcA==",
  };
}

export const ACCOUNT_BALANCE = {
  balance: 1549.36,
  currency: "MXN",
  totalRecords: MOVEMENTS.length,
  accountHolder: "Juan Pérez López",
  clabe: "646180157000000004",
};

export const ACCOUNT_STATEMENTS: AccountStatement[] = [
  { id: "2026-07", period: "Julio 2026", month: 7, year: 2026, startDate: "2026-07-01", endDate: "2026-07-31", generatedAt: "2026-08-01 06:00:00", status: "Generando" },
  { id: "2026-06", period: "Junio 2026", month: 6, year: 2026, startDate: "2026-06-01", endDate: "2026-06-30", generatedAt: "2026-07-01 06:00:00", status: "Disponible" },
  { id: "2026-05", period: "Mayo 2026", month: 5, year: 2026, startDate: "2026-05-01", endDate: "2026-05-31", generatedAt: "2026-06-01 06:00:00", status: "Disponible" },
  { id: "2026-04", period: "Abril 2026", month: 4, year: 2026, startDate: "2026-04-01", endDate: "2026-04-30", generatedAt: "2026-05-01 06:00:00", status: "Disponible" },
  { id: "2026-03", period: "Marzo 2026", month: 3, year: 2026, startDate: "2026-03-01", endDate: "2026-03-31", generatedAt: "2026-04-01 06:00:00", status: "Disponible" },
];

/** Credenciales, OTP y NIP de demostración (solo mock). */
export const DEMO_USER = {
  email: "saul.franco+01@meda.com.mx",
  password: "Meda2026!",
  name: "Juan Pérez López",
};
export const DEMO_OTP = "123456";
export const DEMO_NIP = "1234";

/** Beneficiario de demostración (la persona que hereda la cuenta). */
export const DEMO_BENEFICIARY = {
  name: "María García Ruiz",
  email: "saul.franco+02@meda.com.mx",
  relationship: "Cónyuge",
};

/** Perfil inicial del titular. */
export const DEFAULT_PROFILE = {
  name: DEMO_USER.name,
  email: DEMO_USER.email,
  phone: "5544332211",
  curp: "PELJ900101HDFRRN08",
  rfc: "PELJ900101AB1",
  clabe: ACCOUNT_BALANCE.clabe,
};

/** Crea un movimiento a partir de un SPEI enviado y actualiza el saldo (mock en memoria). */
export function addSpeiMovement(input: {
  amount: number;
  reference?: string;
  concept?: string;
}): Movement {
  const now = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())} ${p(
    now.getHours(),
  )}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
  const rnd = Math.random().toString(16).slice(2);
  const movement: Movement = {
    id: `${rnd.slice(0, 8)}-${rnd.slice(8, 12)}-4${rnd.slice(12, 15)}-a${rnd.slice(0, 3)}-${rnd
      .slice(0, 12)
      .padEnd(12, "0")}`,
    date,
    reference: input.reference || String(100000 + Math.floor(Math.random() * 900000)),
    trackingKey: `MEDA${Date.now().toString(36).toUpperCase()}${rnd.slice(0, 6).toUpperCase()}`,
    type: "Envío",
    amount: input.amount,
    status: "En proceso",
    network: "Externa",
  };
  MOVEMENTS.unshift(movement);
  ACCOUNT_BALANCE.balance = Math.max(0, ACCOUNT_BALANCE.balance - input.amount);
  ACCOUNT_BALANCE.totalRecords = MOVEMENTS.length;
  return movement;
}
