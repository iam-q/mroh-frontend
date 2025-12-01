import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const isAuthenticated = request.cookies.get("sessionid");

  // If not authenticated, redirect to /login but avoid looping
  if (!isAuthenticated && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|signup).*)",
  ],
};
