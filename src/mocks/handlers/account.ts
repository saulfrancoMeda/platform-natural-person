import { http, HttpResponse, delay } from "msw";
import {
  ACCOUNT_BALANCE,
  ACCOUNT_STATEMENTS,
  DEMO_NIP,
  MOVEMENTS,
  addSpeiMovement,
  movementCep,
  movementDetail,
} from "../data";

const BASE = process.env.NEXT_PUBLIC_API_URI_BASE ?? "";

const ok = <T>(data: T) =>
  HttpResponse.json({ status: "OK", errorCode: null, errorMessage: null, data });
const fail = (errorCode: string, errorMessage: string) =>
  HttpResponse.json({ status: "ERROR", errorCode, errorMessage, data: null });

/** "2026-07-01 13:29:45" -> "2026-07-01" */
const dateOnly = (s: string) => s.split(" ")[0];

export const accountHandlers = [
  http.get(`${BASE}/account/balance`, async () => {
    await delay(300);
    return ok(ACCOUNT_BALANCE);
  }),

  // Movimientos con filtros del servidor (clave de rastreo, rango de fechas)
  http.get(`${BASE}/account/movements`, async ({ request }) => {
    await delay(450);
    const url = new URL(request.url);
    const trackingKey = url.searchParams.get("trackingKey")?.trim().toLowerCase();
    const startDate = url.searchParams.get("startDate")?.trim();
    const endDate = url.searchParams.get("endDate")?.trim();

    let items = [...MOVEMENTS];
    if (trackingKey) {
      items = items.filter((m) => m.trackingKey.toLowerCase().includes(trackingKey));
    }
    if (startDate) items = items.filter((m) => dateOnly(m.date) >= startDate);
    if (endDate) items = items.filter((m) => dateOnly(m.date) <= endDate);

    return ok({ items, total: items.length });
  }),

  http.get(`${BASE}/account/movements/:id/cep`, async ({ params }) => {
    await delay(400);
    return ok(movementCep(String(params.id)));
  }),

  http.get(`${BASE}/account/movements/:id`, async ({ params }) => {
    await delay(350);
    return ok(movementDetail(String(params.id)));
  }),

  http.get(`${BASE}/account/statements`, async () => {
    await delay(400);
    return ok(ACCOUNT_STATEMENTS);
  }),

  http.post(`${BASE}/transactions/spei`, async ({ request }) => {
    await delay(700);
    const { body } = (await request.json()) as {
      body: { amount?: number; reference?: string; concept?: string; nip?: string };
    };
    if (body?.nip !== DEMO_NIP) {
      return fail("TX_NIP_001", "NIP incorrecto. Verifica e inténtalo de nuevo.");
    }
    const movement = addSpeiMovement({
      amount: body?.amount ?? 0,
      reference: body?.reference,
      concept: body?.concept,
    });
    return ok({
      trackingKey: movement.trackingKey,
      status: movement.status,
      amount: movement.amount,
      createdAt: new Date().toISOString(),
    });
  }),
];
