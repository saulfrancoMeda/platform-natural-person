/** MEDA UI utils — PII masking for display (never log raw PII). */

/** Mask an account/CLABE: keep first 4 and last 4. */
export function maskAccount(value: string): string {
  const v = value.replace(/\s/g, "");
  if (v.length <= 8) return "****";
  return `${v.slice(0, 4)}${"*".repeat(v.length - 8)}${v.slice(-4)}`;
}

/** Mask an email: j****@domain.com */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "****";
  return `${user[0]}${"*".repeat(Math.max(user.length - 1, 1))}@${domain}`;
}

/** Mask a phone: keep last 4. */
export function maskPhone(phone: string): string {
  const v = phone.replace(/\D/g, "");
  return v.length >= 4 ? `${"*".repeat(v.length - 4)}${v.slice(-4)}` : "****";
}

/**
 * Mask an amount as the user types: digits -> "1,234.56". Keeps two decimals.
 * Use in inputs (onChange) so the field always shows a clean formatted amount.
 *   onChange={(e) => setVal(maskAmount(e.target.value))}
 */
export function maskAmount(raw: string): string {
  const cleaned = raw.replace(/[^\d.]/g, "");
  const [intPart, ...rest] = cleaned.split(".");
  const decimals = rest.join("").slice(0, 2);
  const grouped = intPart.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length ? `${grouped || "0"}.${decimals}` : grouped;
}

/** Parse a masked amount back to a number: "1,234.56" -> 1234.56. */
export function parseAmount(masked: string): number {
  return Number(masked.replace(/,/g, "")) || 0;
}

/** Mask a card number: keep last 4, group in 4s. "4111111111111111" -> "•••• •••• •••• 1111". */
export function maskCard(value: string): string {
  const v = value.replace(/\D/g, "");
  if (v.length < 4) return "••••";
  return `•••• •••• •••• ${v.slice(-4)}`;
}
