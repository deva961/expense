import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const authRoutes = ["/sign-in", "/sign-up", "/"];
  const currentPath = request.nextUrl.pathname;

  // 1. If user is authenticated and tries to access an auth route, redirect to dashboard
  if (sessionCookie && authRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL("/admin/", request.url));
  }

  // 2. If user is unauthenticated and tries to access a protected route, redirect to login with `next`
  if (!sessionCookie && currentPath.startsWith("/admin")) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("redirect", currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // Otherwise, allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // Match all admin protected routes
    "/sign-in", // Match login route
    "/sign-up", // Match signup route
    "/",
  ],
};
