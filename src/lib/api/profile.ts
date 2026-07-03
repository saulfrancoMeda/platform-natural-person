import { del, get, patch, post } from "./client";
import type { AccountStatus, Beneficiary, MockProfile } from "@/mocks/store";

export type { AccountStatus, Beneficiary, MockProfile };

export interface AccountProfile {
  profile: MockProfile;
  accountStatus: AccountStatus;
  deceasedAt: string | null;
  beneficiary: Beneficiary | null;
}

export const getProfile = () => get<AccountProfile>("/account/profile");

export const updateProfile = (data: { email?: string; phone?: string; rfc?: string }) =>
  patch<MockProfile>("/account/profile", data);

export const getBeneficiary = () => get<Beneficiary | null>("/account/beneficiary");

export const saveBeneficiary = (data: {
  name: string;
  email: string;
  relationship: string;
  percentage?: number;
}) => post<Beneficiary>("/account/beneficiary", data);

export const revokeBeneficiary = () => del<Beneficiary>("/account/beneficiary");

export const activateSuccession = (nip: string) =>
  post<{ accountStatus: AccountStatus; beneficiary: Beneficiary }>("/account/succession", { nip });
