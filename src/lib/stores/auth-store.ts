import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SessionUser {
  name: string;
  email: string;
}

interface AuthState {
  /** Credenciales validadas, esperando OTP. */
  preAuth: SessionUser | null;
  /** Sesión completa (OTP validado). */
  user: SessionUser | null;
  accessToken: string | null;
  /** true cuando login + OTP terminaron. */
  isAuthenticated: boolean;
  otpTarget: string | null;

  startPreAuth: (user: SessionUser, otpTarget: string) => void;
  completeAuth: (user: SessionUser, accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      preAuth: null,
      user: null,
      accessToken: null,
      isAuthenticated: false,
      otpTarget: null,

      startPreAuth: (user, otpTarget) =>
        set({ preAuth: user, otpTarget, isAuthenticated: false, user: null, accessToken: null }),

      completeAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true, preAuth: null }),

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
