import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET || "skillmatch-dev-secret-key-32-characters-minimum-length-for-security";

  // Retrieve token from request
  const token = await getToken({ req, secret });
  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isStudentRoute = pathname.startsWith("/student");
  const isAdminRoute = pathname.startsWith("/admin");

  // 1. If already authenticated and trying to access auth pages (/login or /register)
  if (isAuthRoute && isAuthenticated) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/student/dashboard", req.url));
  }

  // 2. Protect Admin Routes
  if (isAdminRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // 3. Protect Student Routes
  if (isStudentRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/login", "/register"],
};
