import { del, get, patch, post } from "./client";
import type { AccountStatus, Beneficiary, MockProfile } from "@/mocks/store";

export type { AccountStatus, Beneficiary, MockProfile };

export interface AccountProfile {
  profile: MockProfile;
  accountStatus: AccountStatus;
  deceasedAt: string | null;
  beneficiaries: Beneficiary[];
}

export const getProfile = () => get<AccountProfile>("/account/profile");

export const updateProfile = (data: { email?: string; phone?: string; rfc?: string }) =>
  patch<MockProfile>("/account/profile", data);

export const getBeneficiaries = () => get<Beneficiary[]>("/account/beneficiary");

export interface BeneficiaryInput {
  name: string;
  email: string;
  relationship: string;
  percentage?: number;
}
export const saveBeneficiary = (data: BeneficiaryInput) =>
  post<Beneficiary>("/account/beneficiary", data);

export const updateBeneficiary = (id: string, data: Partial<BeneficiaryInput>) =>
  patch<Beneficiary>(`/account/beneficiary/${id}`, data);

export const revokeBeneficiary = (id: string) =>
  del<{ removed: boolean }>(`/account/beneficiary/${id}`);

export interface SuccessionRequestResult {
  holderName: string;
  beneficiaries: { name: string; email: string; percentage: number }[];
}
export const requestSuccession = (email: string) =>
  post<SuccessionRequestResult>("/account/succession/request", { email });

export const cancelAccount = (data: {
  nip: string;
  clabe: string;
  bank: string;
  beneficiaryName: string;
  email?: string;
}) => post<{ accountStatus: AccountStatus }>("/account/cancel", data);
