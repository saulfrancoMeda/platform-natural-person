import { get, post } from "./client";
import type {
  AccountStatement,
  Cep,
  Movement,
  MovementDetail,
  MovementStatus,
  MovementType,
} from "@/mocks/data";

export type {
  AccountStatement,
  Cep,
  Movement,
  MovementDetail,
  MovementStatus,
  MovementType,
};

export interface AccountBalance {
  balance: number;
  currency: string;
  totalRecords: number;
  accountHolder: string;
  clabe: string;
}

export interface MovementFilters {
  trackingKey?: string;
  startDate?: string;
  endDate?: string;
}

export const getBalance = () => get<AccountBalance>("/account/balance");

export function getMovements(filters: MovementFilters = {}) {
  const qs = new URLSearchParams();
  if (filters.trackingKey) qs.set("trackingKey", filters.trackingKey);
  if (filters.startDate) qs.set("startDate", filters.startDate);
  if (filters.endDate) qs.set("endDate", filters.endDate);
  const suffix = qs.toString() ? `?${qs}` : "";
  return get<{ items: Movement[]; total: number }>(`/account/movements${suffix}`);
}

export const getMovementDetail = (id: string) =>
  get<MovementDetail>(`/account/movements/${id}`);

export const getMovementCep = (id: string) =>
  get<Cep>(`/account/movements/${id}/cep`);

export const getAccountStatements = () =>
  get<AccountStatement[]>("/account/statements");

export interface SpeiPayload {
  amount: number;
  receiverClabe: string;
  receiverName: string;
  bank: string;
  concept: string;
  reference?: string;
  rfcCurp?: string;
  /** NIP de 4 dígitos para autorizar la transferencia. */
  nip: string;
}
export const sendSpei = (payload: SpeiPayload) =>
  post<{ trackingKey: string; status: string; amount: number }>(
    "/transactions/spei",
    payload,
  );
