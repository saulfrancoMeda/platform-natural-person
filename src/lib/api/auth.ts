import { post } from "./client";

export type SessionRole = "HOLDER" | "BENEFICIARY";

export interface LoginResult {
  otpRequired: boolean;
  otpChannel: string;
  otpTarget: string;
  role: SessionRole;
  holderName: string | null;
  user: { name: string; email: string };
}

export interface OtpValidateResult {
  accessToken: string;
  refreshToken: string;
}

export const login = (email: string, password: string) =>
  post<LoginResult>("/auth/login", { email, password });

export const requestOtp = () =>
  post<{ sent: boolean; otpTarget: string }>("/auth/otp/request", {});

export const validateOtp = (code: string) =>
  post<OtpValidateResult>("/auth/otp/validate", { code });

export const validateNip = (nip: string) =>
  post<{ valid: boolean }>("/auth/nip/validate", { nip });

export const changeNip = (currentNip: string, newNip: string) =>
  post<{ changed: boolean }>("/auth/nip/change", { currentNip, newNip });

export const resetDemo = () => post<{ reset: boolean }>("/demo/reset", {});

export const logout = () => post<{ loggedOut: boolean }>("/auth/logout", {});
