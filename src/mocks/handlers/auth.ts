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
    const b = state.beneficiary;
    if (b && b.status === "ACTIVE" && email === b.email) {
      if (password !== DEMO_USER.password) {
        return fail("AUTH_001", "Credenciales inválidas. Por favor, inténtelo de nuevo.");
      }
      if (state.accountStatus !== "DECEASED") {
        return fail(
          "AUTH_BENEF_LOCKED",
          "Aún no tienes acceso a esta cuenta. El acceso por sucesión se habilita cuando se activa el protocolo.",
        );
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
    if (!body?.newNip || !/^\d{4}$/.test(body.newNip)) {
      return fail("NIP_003", "El nuevo NIP debe tener 4 dígitos.");
    }
    setState({ nip: body.newNip });
    return ok({ changed: true });
  }),

  http.post(`${BASE}/auth/logout`, async () => ok({ loggedOut: true })),
];
