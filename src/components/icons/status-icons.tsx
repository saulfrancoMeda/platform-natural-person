import * as React from "react";

/**
 * MEDA brand status icons (recreated as SVG from the brand PNGs).
 * Self-contained, no external icon library. Scale with `size`, brand yellow by default.
 * For generic UI icons (arrows, copy, search...) use lucide-react instead.
 */
interface IconProps { size?: number; className?: string; }

export function SuccessIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role="img" aria-label="Success">
      <circle cx="24" cy="24" r="22" fill="#FCD535" />
      <path d="M15 24.5l6 6 12-13" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ErrorIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role="img" aria-label="Error">
      <circle cx="24" cy="24" r="22" fill="#FCD535" />
      <path d="M17 17l14 14M31 17L17 31" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function GeolocationIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role="img" aria-label="Location">
      <path d="M24 4C15.7 4 9 10.7 9 19c0 10 15 25 15 25s15-15 15-25C39 10.7 32.3 4 24 4z" fill="#FCD535" />
      <circle cx="24" cy="19" r="7" fill="#fff" />
    </svg>
  );
}

export function WaitingIcon({ size = 48, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} role="img" aria-label="Waiting">
      <rect x="11" y="5" width="26" height="3.5" rx="1" fill="#A6B0BB" />
      <rect x="11" y="39.5" width="26" height="3.5" rx="1" fill="#A6B0BB" />
      <path d="M14 8.5h20c0 7-6 9.5-10 11.5C20 22 14 15.5 14 8.5z" fill="#EEF1F4" />
      <path d="M14 39.5h20c0-7-6-9.5-10-11.5-4 2-10 9-10 11.5z" fill="#EEF1F4" />
      <path d="M18 33.5h12l-1 4H19l-1-4z" fill="#FCD535" />
      <path d="M19 14h10l-5 5.5L19 14z" fill="#FCD535" />
      <path d="M23 19l2 0 0 10-2 0z" fill="#FCD535" />
    </svg>
  );
}
