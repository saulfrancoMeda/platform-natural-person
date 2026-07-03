import { http, HttpResponse, delay } from "msw";
import { getState, setState, resetState, type Beneficiary } from "../store";

const BASE = process.env.NEXT_PUBLIC_API_URI_BASE ?? "";

const ok = <T>(data: T) =>
  HttpResponse.json({ status: "OK", errorCode: null, errorMessage: null, data });
const fail = (errorCode: string, errorMessage: string) =>
  HttpResponse.json({ status: "ERROR", errorCode, errorMessage, data: null });

export const profileHandlers = [
  // Perfil + estado de la cuenta
  http.get(`${BASE}/account/profile`, async () => {
    await delay(300);
    const s = getState();
    return ok({
      profile: s.profile,
      accountStatus: s.accountStatus,
      deceasedAt: s.deceasedAt,
      beneficiary: s.beneficiary,
    });
  }),

  // Actualizar datos de contacto
  http.patch(`${BASE}/account/profile`, async ({ request }) => {
    await delay(500);
    const { body } = (await request.json()) as {
      body: { email?: string; phone?: string; rfc?: string };
    };
    const s = getState();
    if (body?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return fail("PROFILE_001", "Correo no válido.");
    }
    if (body?.phone && !/^\d{10}$/.test(body.phone)) {
      return fail("PROFILE_002", "El teléfono debe tener 10 dígitos.");
    }
    const next = setState({
      profile: {
        ...s.profile,
        ...(body.email ? { email: body.email } : {}),
        ...(body.phone ? { phone: body.phone } : {}),
        ...(body.rfc ? { rfc: body.rfc } : {}),
      },
    });
    return ok(next.profile);
  }),

  // Beneficiario
  http.get(`${BASE}/account/beneficiary`, async () => {
    await delay(300);
    return ok(getState().beneficiary);
  }),

  http.post(`${BASE}/account/beneficiary`, async ({ request }) => {
    await delay(600);
    const { body } = (await request.json()) as {
      body: { name?: string; email?: string; relationship?: string; percentage?: number };
    };
    if (!body?.name || !body?.email || !body?.relationship) {
      return fail("BENEF_001", "Faltan datos del beneficiario.");
    }
    if (body.email === getState().profile.email) {
      return fail("BENEF_002", "El beneficiario no puede ser el mismo titular.");
    }
    const beneficiary: Beneficiary = {
      id: "benef-" + Date.now().toString(36),
      name: body.name,
      email: body.email,
      relationship: body.relationship,
      percentage: body.percentage ?? 100,
      status: "ACTIVE",
      registeredAt: new Date().toISOString(),
    };
    setState({ beneficiary });
    return ok(beneficiary);
  }),

  // Dar de baja al beneficiario
  http.delete(`${BASE}/account/beneficiary`, async () => {
    await delay(500);
    const s = getState();
    if (!s.beneficiary) return fail("BENEF_003", "No hay beneficiario registrado.");
    const beneficiary = { ...s.beneficiary, status: "REVOKED" as const };
    setState({ beneficiary });
    return ok(beneficiary);
  }),

  // Protocolo de sucesión: marca la cuenta como cerrada por fallecimiento (valida NIP)
  http.post(`${BASE}/account/succession`, async ({ request }) => {
    await delay(700);
    const { body } = (await request.json()) as { body: { nip?: string } };
    const s = getState();
    if (body?.nip !== s.nip) return fail("NIP_001", "NIP incorrecto.");
    if (!s.beneficiary || s.beneficiary.status !== "ACTIVE") {
      return fail("SUCC_001", "Registra un beneficiario activo antes de activar el protocolo.");
    }
    setState({ accountStatus: "DECEASED", deceasedAt: new Date().toISOString() });
    return ok({ accountStatus: "DECEASED", beneficiary: s.beneficiary });
  }),

  // Revierte la sucesión / reinicia el estado de la demo
  http.post(`${BASE}/demo/reset`, async () => {
    await delay(300);
    resetState();
    return ok({ reset: true });
  }),
];
