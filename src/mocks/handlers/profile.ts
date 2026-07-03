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
      beneficiaries: s.beneficiaries,
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

  // Lista de beneficiarios
  http.get(`${BASE}/account/beneficiary`, async () => {
    await delay(300);
    return ok(getState().beneficiaries);
  }),

  // Alta de beneficiario (la autorización con código se hace en el cliente)
  http.post(`${BASE}/account/beneficiary`, async ({ request }) => {
    await delay(600);
    const { body } = (await request.json()) as {
      body: { name?: string; email?: string; relationship?: string; percentage?: number };
    };
    const s = getState();
    if (!body?.name || !body?.email || !body?.relationship) {
      return fail("BENEF_001", "Faltan datos del beneficiario.");
    }
    if (body.email === s.profile.email) {
      return fail("BENEF_002", "El beneficiario no puede ser el mismo titular.");
    }
    if (s.beneficiaries.some((b) => b.email === body.email)) {
      return fail("BENEF_004", "Ya existe un beneficiario con ese correo.");
    }
    const percentage = body.percentage ?? 0;
    const totalOther = s.beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
    if (totalOther + percentage > 100) {
      return fail("BENEF_005", `El porcentaje total no puede superar 100% (disponible: ${100 - totalOther}%).`);
    }
    const beneficiary: Beneficiary = {
      id: "benef-" + Date.now().toString(36) + Math.floor(Math.random() * 1000),
      name: body.name,
      email: body.email,
      relationship: body.relationship,
      percentage,
      status: "ACTIVE",
      registeredAt: new Date().toISOString(),
      activated: false,
    };
    setState({ beneficiaries: [...s.beneficiaries, beneficiary] });
    return ok(beneficiary);
  }),

  // Edición de beneficiario
  http.patch(`${BASE}/account/beneficiary/:id`, async ({ request, params }) => {
    await delay(600);
    const { body } = (await request.json()) as {
      body: { name?: string; email?: string; relationship?: string; percentage?: number };
    };
    const s = getState();
    const idx = s.beneficiaries.findIndex((b) => b.id === params.id);
    if (idx < 0) return fail("BENEF_003", "Beneficiario no encontrado.");
    if (body.email && body.email === s.profile.email) {
      return fail("BENEF_002", "El beneficiario no puede ser el mismo titular.");
    }
    if (body.email && s.beneficiaries.some((b) => b.email === body.email && b.id !== params.id)) {
      return fail("BENEF_004", "Ya existe un beneficiario con ese correo.");
    }
    const nextPct = body.percentage ?? s.beneficiaries[idx].percentage;
    const totalOther = s.beneficiaries.reduce((sum, b) => (b.id === params.id ? sum : sum + b.percentage), 0);
    if (totalOther + nextPct > 100) {
      return fail("BENEF_005", `El porcentaje total no puede superar 100% (disponible: ${100 - totalOther}%).`);
    }
    const updated: Beneficiary = {
      ...s.beneficiaries[idx],
      name: body.name ?? s.beneficiaries[idx].name,
      email: body.email ?? s.beneficiaries[idx].email,
      relationship: body.relationship ?? s.beneficiaries[idx].relationship,
      percentage: nextPct,
    };
    const beneficiaries = s.beneficiaries.slice();
    beneficiaries[idx] = updated;
    setState({ beneficiaries });
    return ok(updated);
  }),

  // Dar de baja a un beneficiario
  http.delete(`${BASE}/account/beneficiary/:id`, async ({ params }) => {
    await delay(500);
    const s = getState();
    if (!s.beneficiaries.some((b) => b.id === params.id)) {
      return fail("BENEF_003", "Beneficiario no encontrado.");
    }
    setState({ beneficiaries: s.beneficiaries.filter((b) => b.id !== params.id) });
    return ok({ removed: true });
  }),

  // Protocolo de sucesión por correo (flujo externo, sin sesión): valida el correo del
  // titular, confirma que tenga beneficiario activo y activa la sucesión.
  http.post(`${BASE}/account/succession/request`, async ({ request }) => {
    await delay(700);
    const { body } = (await request.json()) as { body: { email?: string } };
    const s = getState();
    if (body?.email !== s.profile.email) {
      return fail("SUCC_001", "No encontramos una cuenta con ese correo.");
    }
    const active = s.beneficiaries.filter((b) => b.status === "ACTIVE");
    if (active.length === 0) {
      return fail("SUCC_002", "La cuenta no tiene beneficiarios designados.");
    }
    if (s.accountStatus === "CANCELLED") {
      return fail("SUCC_003", "La cuenta está cancelada.");
    }
    setState({ accountStatus: "DECEASED", deceasedAt: new Date().toISOString() });
    return ok({
      holderName: s.profile.name,
      beneficiaries: active.map((b) => ({ name: b.name, email: b.email, percentage: b.percentage })),
    });
  }),

  // Cancelación de cuenta (valida NIP; dispersa el saldo a una CLABE)
  http.post(`${BASE}/account/cancel`, async ({ request }) => {
    await delay(800);
    const { body } = (await request.json()) as {
      body: { nip?: string; clabe?: string; beneficiaryName?: string };
    };
    const s = getState();
    if (body?.nip !== s.nip) return fail("NIP_001", "NIP incorrecto.");
    if (!body?.clabe || !/^\d{18}$/.test(body.clabe)) {
      return fail("CANCEL_001", "La CLABE debe tener 18 dígitos.");
    }
    setState({ accountStatus: "CANCELLED" });
    return ok({ accountStatus: "CANCELLED" });
  }),

  // Revierte la sucesión / reinicia el estado de la demo
  http.post(`${BASE}/demo/reset`, async () => {
    await delay(300);
    resetState();
    return ok({ reset: true });
  }),
];
