"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SuccessionView } from "@/features/auth/succession-view";

function SucesionInner() {
  const email = useSearchParams().get("email") ?? "";
  return <SuccessionView initialEmail={email} />;
}

export default function SucesionPage() {
  return (
    <Suspense fallback={null}>
      <SucesionInner />
    </Suspense>
  );
}
