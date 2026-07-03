/** MEDA UI utils — Mexican fintech validators (RFC, CURP, CLABE, email). */

/** RFC persona física (13) or moral (12). Format check only, not SAT validation. */
export function isValidRFC(rfc: string): boolean {
  return /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i.test(rfc.trim());
}

/** CURP (18 chars). Format check only. */
export function isValidCURP(curp: string): boolean {
  return /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/i.test(curp.trim());
}

/** CLABE interbancaria (18 digits). */
export function isValidCLABE(clabe: string): boolean {
  return /^\d{18}$/.test(clabe.trim());
}

/** Basic email format. */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Mexican mobile (10 digits). */
export function isValidPhoneMX(phone: string): boolean {
  return /^\d{10}$/.test(phone.replace(/\D/g, ""));
}
