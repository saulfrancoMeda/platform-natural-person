import { post } from "./client";

export interface LoginResult {
  preAuthToken: string;
  otpRequired: boolean;
  otpChannel: string;
  otpTarget: string;
  user: { name: string; email: string };
}

export interface OtpValidateResult {
  accessToken: string;
  refreshToken: string;
  user: { name: string; email: string };
}

export const login = (email: string, password: string) =>
  post<LoginResult>("/auth/login", { email, password });

export const requestOtp = () =>
  post<{ sent: boolean; otpTarget: string }>("/auth/otp/request", {});

export const validateOtp = (code: string) =>
  post<OtpValidateResult>("/auth/otp/validate", { code });

export const logout = () => post<{ loggedOut: boolean }>("/auth/logout", {});
