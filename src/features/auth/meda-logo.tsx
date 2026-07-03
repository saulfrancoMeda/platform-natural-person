import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * MEDA logo (official wordmark). The diamond mark keeps the brand yellow; the wordmark uses
 * currentColor so it adapts to light/dark. Has a sensible default height — pass `className`
 * (e.g. "h-12 text-fg") to size it. Always constrain height so the SVG never renders huge.
 */
export function MedaLogo({ className }: { className?: string }) {
  return (
    <svg className={cn("h-7 w-auto text-fg", className)} viewBox="0 0 160 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MEDA">
      <path d="M20.573 21L0 0.5V14.1632L20.573 34.6735L41.1461 14.1632V0.5L20.573 21Z" fill="#F0B90B" />
      <path d="M0 41.5L9.13788 32.3878L0 23.2755V41.5Z" fill="#F0B90B" />
      <path d="M41.1461 41.5V23.2755L31.9979 32.3878L41.1461 41.5Z" fill="#F0B90B" />
      <path d="M68.2418 21.697L61.6884 11.1805H55.7605V36.0572H61.1448V19.9237L68.1085 30.4402H68.2418L75.267 19.811V36.0572H80.723V11.1805H74.8055L68.2418 21.697Z" fill="currentColor" />
      <path d="M92.0864 25.9713H103.86V21.0922H92.0864V16.0492H105.46V11.1805H86.6303V36.0572H105.634V31.1885H92.0864V25.9713Z" fill="currentColor" />
      <path d="M133.53 23.542C133.53 16.5412 128.105 11.1702 120.269 11.1702H110.536V36.047H120.269C128.115 36.047 133.53 30.6145 133.53 23.6035V23.5317V23.542ZM127.787 23.6855C127.787 28.093 124.751 31.1168 120.259 31.1168H116.013V16.121H120.259C124.751 16.121 127.787 19.2165 127.787 23.624V23.6957V23.6855Z" fill="currentColor" />
      <path d="M144.227 11.1805L133.53 36.2417H139.14L141.417 30.6658H151.97L154.257 36.2417H160L149.303 11.1805H144.227ZM143.365 25.8175L146.678 17.7507L149.99 25.8175H143.365Z" fill="currentColor" />
      <path d="M151.898 5.75825H146.493L144.698 9.83775H149.56L151.898 5.75825Z" fill="currentColor" />
    </svg>
  );
}
