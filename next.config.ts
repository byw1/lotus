import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * `script-src` includes `'unsafe-inline'` because the Next.js App Router emits
 * inline bootstrap/flight scripts on every page. Removing it requires
 * per-request nonces generated in middleware, which forces every page to render
 * dynamically and costs us static generation on a site that is almost entirely
 * static marketing content. This site renders no user-supplied HTML, so the
 * residual XSS surface is small. If that ever changes, switch to nonces +
 * `'strict-dynamic'` — see SECURITY.md.
 *
 * `worker-src blob:`, `child-src blob:`, `img-src blob:` and `wasm-unsafe-eval`
 * are all required by three.js / WebGL.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // 'wasm-unsafe-eval' is required by the three.js WASM decoders (DRACO, KTX2,
  // MeshOpt). Without it they fail silently in Chrome and Firefox.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "worker-src 'self' blob:",
  // Safari below 15.5 ignores worker-src and falls back to child-src.
  "child-src 'self' blob:",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://www.google.com",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  /*
   * Deliberately no `preload`. Submitting to hstspreload.org is a one-way door:
   * it commits every subdomain of the festival's domain to HTTPS-only in
   * shipped browsers, and removal takes months. Add it once DNS is settled and
   * every subdomain — including any City-hosted one — is confirmed HTTPS.
   */
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
