import { http, HttpResponse, delay } from "msw";
import { DEMO_OTP, DEMO_USER } from "../data";

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
  // Paso 1: credenciales → dispara envío de OTP
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(500);
    const { body } = (await request.json()) as {
      body: { email?: string; password?: string };
    };
    const { email, password } = body ?? {};
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      return fail("AUTH_001", "Credenciales inválidas. Por favor, inténtelo de nuevo.");
    }
    return ok({
      preAuthToken: "meda-preauth-token",
      otpRequired: true,
      otpChannel: "EMAIL",
      otpTarget: maskEmail(DEMO_USER.email),
      user: { name: DEMO_USER.name, email: DEMO_USER.email },
    });
  }),

  // Reenvío de OTP
  http.post(`${BASE}/auth/otp/request`, async () => {
    await delay(400);
    return ok({ sent: true, otpChannel: "EMAIL", otpTarget: maskEmail(DEMO_USER.email) });
  }),

  // Paso 2: validación de OTP → sesión
  http.post(`${BASE}/auth/otp/validate`, async ({ request }) => {
    await delay(500);
    const { body } = (await request.json()) as { body: { code?: string } };
    const { code } = body ?? {};
    if (code !== DEMO_OTP) {
      return fail("AUTH_OTP_001", "Código incorrecto. Por favor, inténtalo de nuevo.");
    }
    return ok({
      accessToken: "meda-access-token",
      refreshToken: "meda-refresh-token",
      user: { name: DEMO_USER.name, email: DEMO_USER.email },
    });
  }),

  http.post(`${BASE}/auth/logout`, async () => ok({ loggedOut: true })),
];
