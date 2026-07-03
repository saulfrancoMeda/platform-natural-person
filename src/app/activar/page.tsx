"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ActivateView } from "@/features/auth/activate-view";

function ActivarInner() {
  const email = useSearchParams().get("email") ?? "";
  return <ActivateView initialEmail={email} />;
}

export default function ActivarPage() {
  return (
    <Suspense fallback={null}>
      <ActivarInner />
    </Suspense>
  );
}
