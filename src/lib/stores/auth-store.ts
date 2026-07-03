import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SessionRole = "HOLDER" | "BENEFICIARY";

export interface SessionUser {
  name: string;
  email: string;
  role: SessionRole;
  /** Nombre del titular cuando el que accede es el beneficiario (sucesión). */
  holderName: string | null;
}

interface AuthState {
  /** Identidad validada, esperando OTP. */
  preAuth: (SessionUser & { otpTarget: string }) | null;
  /** Sesión completa (OTP validado). */
  user: SessionUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  otpTarget: string | null;

  startPreAuth: (user: SessionUser, otpTarget: string) => void;
  completeAuth: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      preAuth: null,
      user: null,
      accessToken: null,
      isAuthenticated: false,
      otpTarget: null,

      startPreAuth: (user, otpTarget) =>
        set({
          preAuth: { ...user, otpTarget },
          otpTarget,
          isAuthenticated: false,
          user: null,
          accessToken: null,
        }),

      completeAuth: (accessToken) => {
        const p = get().preAuth;
        if (!p) return;
        const { otpTarget: _otp, ...user } = p;
        set({ user, accessToken, isAuthenticated: true, preAuth: null });
      },

      logout: () =>
        set({
          preAuth: null,
          user: null,
          accessToken: null,
          isAuthenticated: false,
          otpTarget: null,
        }),
    }),
    {
      name: "meda-pf-auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
