/**
 * MSW solo corre en dev/test, NUNCA en producción.
 * Por defecto se activa en desarrollo; poner NEXT_PUBLIC_ENABLE_MSW="false"
 * (o apuntar al backend real) lo desactiva sin tocar código de la app.
 */
export function isMSWEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.NEXT_PUBLIC_ENABLE_MSW !== "false";
}
