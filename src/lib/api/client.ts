/** MEDA API client — handles the MEDA APIResponse envelope (HTTP 200 with status:ERROR). */

export interface APIResponse<T> {
  status: "OK" | "ERROR";
  errorCode: string | null;
  errorMessage: string | null;
  data: T;
}

export class MedaApiError extends Error {
  constructor(public code: string | null, message: string | null) {
    super(message ?? "API error");
    this.name = "MedaApiError";
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URI_BASE ?? "";

function genTraceId(): string {
  return (globalThis.crypto?.randomUUID?.() ?? `t-${Date.now()}-${Math.random().toString(36).slice(2)}`);
}

/** POST to a MEDA service. Wraps body in the APIRequest envelope and unwraps APIResponse. */
export async function post<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: JSON.stringify({ traceId: genTraceId(), body }),
    ...init,
  });
  if (res.status >= 500) throw new MedaApiError("SYSTEM_ERROR", "Service unavailable");
  const json = (await res.json()) as APIResponse<T>;
  if (json.status === "ERROR") throw new MedaApiError(json.errorCode, json.errorMessage);
  return json.data;
}

/** GET from a MEDA service. */
export async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { method: "GET", ...init });
  if (res.status >= 500) throw new MedaApiError("SYSTEM_ERROR", "Service unavailable");
  const json = (await res.json()) as APIResponse<T>;
  if (json.status === "ERROR") throw new MedaApiError(json.errorCode, json.errorMessage);
  return json.data;
}

/** PATCH to a MEDA service (partial update). Same envelope as POST. */
export async function patch<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return post<T>(path, body, { method: "PATCH", ...init });
}

/** DELETE on a MEDA service. */
export async function del<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    body: JSON.stringify({ traceId: genTraceId(), body: {} }),
    ...init,
  });
  if (res.status >= 500) throw new MedaApiError("SYSTEM_ERROR", "Service unavailable");
  const json = (await res.json()) as APIResponse<T>;
  if (json.status === "ERROR") throw new MedaApiError(json.errorCode, json.errorMessage);
  return json.data;
}
