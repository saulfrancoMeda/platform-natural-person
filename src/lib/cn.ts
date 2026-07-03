import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** MEDA UI className helper: merges Tailwind classes safely. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
