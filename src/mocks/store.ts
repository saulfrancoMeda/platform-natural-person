/**
 * Estado mock PERSISTENTE (localStorage) — sobrevive recargas para que la demo de
 * sucesión/beneficiario "cambie de verdad": el flag de fallecimiento persiste y el
 * login del titular queda bloqueado hasta que se reinicie el estado.
 * Cuando exista el backend real, esto desaparece con MSW.
 */
import { DEFAULT_PROFILE, DEMO_NIP } from "./data";

export type AccountStatus = "ACTIVE" | "DECEASED";
export type BeneficiaryStatus = "ACTIVE" | "REVOKED";

export interface Beneficiary {
  id: string;
  name: string;
  email: string;
  relationship: string;
  percentage: number;
  status: BeneficiaryStatus;
  registeredAt: string;
}

export interface MockProfile {
  name: string;
  email: string;
  phone: string;
  curp: string;
  rfc: string;
  clabe: string;
}

export interface MockState {
  accountStatus: AccountStatus;
  deceasedAt: string | null;
  beneficiary: Beneficiary | null;
  profile: MockProfile;
  nip: string;
}

const KEY = "meda-pf-mock-state";

function initial(): MockState {
  return {
    accountStatus: "ACTIVE",
    deceasedAt: null,
    beneficiary: null,
    profile: { ...DEFAULT_PROFILE },
    nip: DEMO_NIP,
  };
}

let cache: MockState | null = null;

export function getState(): MockState {
  if (cache) return cache;
  if (typeof window === "undefined") return initial();
  let state: MockState;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = raw ? { ...initial(), ...JSON.parse(raw) } : initial();
  } catch {
    state = initial();
  }
  cache = state;
  return state;
}

export function setState(patch: Partial<MockState>): MockState {
  const next = { ...getState(), ...patch };
  cache = next;
  try {
    window.localStorage?.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function resetState() {
  cache = initial();
  try {
    window.localStorage?.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
