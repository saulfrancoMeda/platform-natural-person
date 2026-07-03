import { http, HttpResponse, delay } from "msw";
import { DEMO_OTP, DEMO_USER } from "../data";
import { getState, setState } from "../store";

const BASE = process.env.NEXT_PUBLIC_API_URI_BASE ?? "";

const ok = <T>(data: T) =>
  HttpResponse.json({ status: "OK", errorCode: null, errorMessage: null, data });
const fail = (errorCode: string, errorMessage: string) =>
  HttpResponse.json({ status: "ERROR", errorCode, errorMessage, data: null });

/** "saul.franco+01@meda.com.mx" -> "sau•••••@meda.com.mx" */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 3);
  return `${visible}${"•".repeat(Math.max(3, local.length - 3))}@${domain}`;
}

export const authHandlers = [
  // Paso 1: credenciales → dispara envío de OTP.
  // Resuelve identidad (titular vs beneficiario) y estado de sucesión desde el store.
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(500);
    const { body } = (await request.json()) as {
      body: { email?: string; password?: string };
    };
    const { email, password } = body ?? {};
    const state = getState();

    // Titular
    if (email === state.profile.email) {
      if (password !== DEMO_USER.password) {
        return fail("AUTH_001", "Credenciales inválidas. Por favor, inténtelo de nuevo.");
      }
      if (state.accountStatus === "DECEASED") {
        return fail(
          "AUTH_DECEASED",
          "Esta cuenta fue cerrada por protocolo de sucesión y ya no está disponible.",
        );
      }
      if (state.accountStatus === "CANCELLED") {
        return fail("AUTH_CANCELLED", "Esta cuenta fue cancelada y ya no está disponible.");
      }
      return ok({
        otpRequired: true,
        otpChannel: "EMAIL",
        otpTarget: maskEmail(state.profile.email),
        role: "HOLDER",
        holderName: null,
        user: { name: state.profile.name, email: state.profile.email },
      });
    }

    // Beneficiario (solo tras activarse el protocolo de sucesión)
    const b = state.beneficiaries.find((x) => x.status === "ACTIVE" && x.email === email);
    if (b) {
      if (state.accountStatus !== "DECEASED") {
        return fail(
          "AUTH_BENEF_LOCKED",
          "Aún no tienes acceso a esta cuenta. El acceso por sucesión se habilita cuando se activa el protocolo.",
        );
      }
      if (!b.activated) {
        return fail(
          "AUTH_BENEF_ACTIVATE",
          "Tu acceso como beneficiario aún no está activado. Actívalo para continuar.",
        );
      }
      if (password !== state.beneficiaryCreds[b.email]) {
        return fail("AUTH_001", "Credenciales inválidas. Por favor, inténtelo de nuevo.");
      }
      return ok({
        otpRequired: true,
        otpChannel: "EMAIL",
        otpTarget: maskEmail(b.email),
        role: "BENEFICIARY",
        holderName: state.profile.name,
        user: { name: b.name, email: b.email },
      });
    }

    return fail("AUTH_001", "Credenciales inválidas. Por favor, inténtelo de nuevo.");
  }),

  // Onboarding del beneficiario — paso 1: valida elegibilidad y envía OTP
  http.post(`${BASE}/auth/beneficiary/start`, async ({ request }) => {
    await delay(500);
    const { body } = (await request.json()) as { body: { email?: string } };
    const s = getState();
    const b = s.beneficiaries.find((x) => x.status === "ACTIVE" && x.email === body?.email);
    if (!b) {
      return fail("BENEF_START_001", "No encontramos una invitación de sucesión para este correo.");
    }
    if (s.accountStatus !== "DECEASED") {
      return fail("BENEF_START_002", "El acceso por sucesión aún no está habilitado.");
    }
    if (b.activated) {
      return fail("BENEF_START_003", "Tu acceso ya está activado. Inicia sesión con tu contraseña.");
    }
    return ok({
      otpChannel: "EMAIL",
      otpTarget: maskEmail(b.email),
      name: b.name,
      holderName: s.profile.name,
    });
  }),

  // Onboarding del beneficiario — paso final: define contraseña y NIP → sesión
  http.post(`${BASE}/auth/beneficiary/activate`, async ({ request }) => {
    await delay(600);
    const { body } = (await request.json()) as {
      body: { email?: string; password?: string; nip?: string };
    };
    const s = getState();
    const b = s.beneficiaries.find((x) => x.status === "ACTIVE" && x.email === body?.email);
    if (!b || s.accountStatus !== "DECEASED") {
      return fail("BENEF_ACT_001", "No fue posible activar el acceso.");
    }
    if (!body?.password || body.password.length < 8) {
      return fail("BENEF_ACT_002", "La contraseña debe tener al menos 8 caracteres.");
    }
    if (!body?.nip || !/^\d{6}$/.test(body.nip)) {
      return fail("BENEF_ACT_003", "El NIP debe tener 6 dígitos.");
    }
    const beneficiaries = s.beneficiaries.map((x) =>
      x.id === b.id ? { ...x, activated: true } : x,
    );
    setState({
      beneficiaries,
      beneficiaryCreds: { ...s.beneficiaryCreds, [b.email]: body.password },
      nip: body.nip,
    });
    return ok({
      accessToken: "meda-access-token",
      refreshToken: "meda-refresh-token",
      role: "BENEFICIARY",
      holderName: s.profile.name,
      user: { name: b.name, email: b.email },
    });
  }),

  // Reenvío de OTP
  http.post(`${BASE}/auth/otp/request`, async () => {
    await delay(400);
    return ok({ sent: true, otpChannel: "EMAIL", otpTarget: maskEmail(getState().profile.email) });
  }),

  // Paso 2: validación de OTP → sesión
  http.post(`${BASE}/auth/otp/validate`, async ({ request }) => {
    await delay(500);
    const { body } = (await request.json()) as { body: { code?: string } };
    const { code } = body ?? {};
    if (code !== DEMO_OTP) {
      return fail("AUTH_OTP_001", "Código incorrecto. Por favor, inténtalo de nuevo.");
    }
    return ok({ accessToken: "meda-access-token", refreshToken: "meda-refresh-token" });
  }),

  // Validación de NIP (autoriza acciones sensibles: ver/descargar estado de cuenta)
  http.post(`${BASE}/auth/nip/validate`, async ({ request }) => {
    await delay(400);
    const { body } = (await request.json()) as { body: { nip?: string } };
    if (body?.nip !== getState().nip) {
      return fail("NIP_001", "NIP incorrecto. Verifica e inténtalo de nuevo.");
    }
    return ok({ valid: true });
  }),

  // Cambio de NIP (valida el actual)
  http.post(`${BASE}/auth/nip/change`, async ({ request }) => {
    await delay(500);
    const { body } = (await request.json()) as { body: { currentNip?: string; newNip?: string } };
    if (body?.currentNip !== getState().nip) {
      return fail("NIP_002", "El NIP actual es incorrecto.");
    }
    if (!body?.newNip || !/^\d{6}$/.test(body.newNip)) {
      return fail("NIP_003", "El nuevo NIP debe tener 6 dígitos.");
    }
    setState({ nip: body.newNip });
    return ok({ changed: true });
  }),

  http.post(`${BASE}/auth/logout`, async () => ok({ loggedOut: true })),
];
