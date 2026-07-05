import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";
import {getToken} from "next-auth/jwt";

// --- ORIGINES AUTORISÉES ---
const allowedOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.NEXT_PUBLIC_BASE_URL
].filter(Boolean);

// --- BOTS ---
const blockedUserAgents = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /wget/i,
  /curl/i,
  /python/i,
  /scraper/i
];

// --- EXTENSIONS DANGEREUSES ---
const blockedExtensions = [".php", ".asp", ".aspx", ".exe", ".sh", ".bat", ".cmd"];

export default async function securityMiddleware(req: NextRequest, intlResponse: NextResponse) {
  const origin = req.headers.get("origin") || "";
  const ua = req.headers.get("user-agent") || "";
  const pathname = req.nextUrl.pathname;

  // --- 2) Autoriser les requêtes internes ---
  if (!origin) return intlResponse;

  // --- 3) CSRF ---
  if (
    req.method !== "GET" &&
    !pathname.startsWith("/api/stripe/webhook") &&
    !allowedOrigins.includes(origin)
  ) {
    return new NextResponse("Forbidden (CSRF)", {status: 403});
  }

  // --- 4) Anti-bots ---
  for (const pattern of blockedUserAgents) {
    if (pattern.test(ua)) {
      return new NextResponse("Forbidden (Bot detected)", {status: 403});
    }
  }

  // --- 5) Anti-hotlinking ---
  if (pathname.startsWith("/uploads") || pathname.startsWith("/images")) {
    if (!allowedOrigins.includes(origin)) {
      return new NextResponse("Hotlinking forbidden", {status: 403});
    }
  }

  // --- 6) Extensions dangereuses ---
  if (blockedExtensions.some((ext) => pathname.endsWith(ext))) {
    return new NextResponse("Forbidden file type", {status: 403});
  }

  // --- 7) Auth routes ---
  if (pathname.startsWith("/api/auth")) return intlResponse;

  // --- 8) API partenaire autorisée ---
  if (pathname.startsWith("/api/partner")) return intlResponse;

  // --- 9) Token ---
  const token = await getToken({
    req,
    secureCookie: process.env.NODE_ENV === "production"
  });

  const role = token?.role;

  // --- 10) Espace partenaire ---
  if (pathname.includes("/partner")) {
    if (!token || role !== "partner") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "?error=unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // --- 11) Espace admin ---
  if (pathname.includes("/admin")) {
    if (!token || role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "?error=unauthorized";
      return NextResponse.redirect(url);
    }
  }

  // --- 12) Headers sécurité ---
  intlResponse.headers.set("X-Frame-Options", "DENY");
  intlResponse.headers.set("X-Content-Type-Options", "nosniff");
  intlResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return intlResponse;
}
