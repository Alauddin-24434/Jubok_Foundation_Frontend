import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function  proxy(request: NextRequest) {
  console.log("🟢 Middleware hit");

  const refreshToken = request.cookies.get("refreshToken")?.value;
  console.log("🍪 Refresh Token:", refreshToken ? "FOUND" : "NOT FOUND");

  if (!refreshToken) {
    console.log("🔴 No refresh token → redirect to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = process.env.NEXT_PUBLIC_REFRESH_TOKEN_SECRET!;
    console.log("🔐 JWT Secret exists:", !!secret);

    const decoded = jwt.verify(refreshToken, secret) as any;
    console.log("✅ JWT verified successfully");
    console.log("📦 Decoded payload:", decoded);

    const userRole = decoded.role;
    console.log("👤 User role:", userRole);

    const { pathname } = request.nextUrl;
    console.log("📍 Pathname:", pathname);

    const allowedRoles = ["ADMIN", "SUPER_ADMIN"];
    console.log("🛂 Allowed roles:", allowedRoles);

    if (pathname.startsWith("/dashboard")) {
      if (!allowedRoles.includes(userRole)) {
        console.log("⛔ Role not allowed → redirect /unauthorized");
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    console.log("🟢 Access granted → Next()");
    return NextResponse.next();

  } catch (error) {
    console.log("❌ JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
