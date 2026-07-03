import type { NextConfig } from "next";

// STATIC_EXPORT=true produce un sitio estático en `out/` (para arrastrar a Netlify Drop).
// Sin la variable, build/start normal (servidor) para dev y túnel.
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
