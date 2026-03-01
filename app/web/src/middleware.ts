import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// =============================================================================
// Middleware - Route protection for Ananta portals
// =============================================================================

// Routes that are always public (no auth required)
const PUBLIC_ROUTES = ["/", "/login", "/callback", "/emergency"];

// Routes that require authentication
const PROTECTED_PREFIXES = ["/patient", "/doctor"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow emergency routes (they have their own access control via access codes)
  if (pathname.startsWith("/emergency")) {
    return NextResponse.next();
  }

  // Allow static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if the route requires authentication
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected) {
    // In a real app, we would verify the token server-side here.
    // Since Keycloak auth is client-side with keycloak-js,
    // the AuthProvider in providers.tsx handles the actual auth check.
    // This middleware acts as a first-line guard for route structure.

    // Check for auth cookie/token presence (set by the client after login)
    const authStorage = request.cookies.get("ananta-auth");

    if (!authStorage) {
      // No auth token found; redirect to login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
