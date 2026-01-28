import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

//==================================================================================
//                                SECURITY MIDDLEWARE
//==================================================================================
// Description: Global route protection and role-based access control (RBAC).
// Features: Token validation, public/private route handling, and role mapping.
//==================================================================================

const PUBLIC_ROUTES = ["/", "/unauthorized", "/privacy", "/terms"];
const AUTH_ROUTES = ["/login", "/register"];

// Map routes to required roles
const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/users": ["SUPER_ADMIN"],
  "/dashboard/payments": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/funds": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/notices": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/projects": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/banners": ["SUPER_ADMIN", "ADMIN"],
  "/dashboard/management": ["SUPER_ADMIN", "ADMIN"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. Allow static assets and internal requests
  if (
    pathname.startsWith("/_next") || 
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Handle Authentication Routes (Login/Register)
  if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
    if (refreshToken) {
      try {
        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!);
        await jwtVerify(refreshToken, secret);
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (e) {
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 3. Handle Private Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!);
      const { payload } = await jwtVerify(refreshToken, secret);
      const userRole = payload.role as string;

      // Check specifically for Dashboard RBAC
      for (const [route, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(userRole)) {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
          }
        }
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
