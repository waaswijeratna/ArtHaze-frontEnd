import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Get userId from cookies (since middleware runs on the server)
  const userId = req.cookies.get("userId")?.value;

  // If userId is missing and the route is NOT the login page, redirect to /login
  if (!userId && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to all protected routes
export const config = {
  matcher: ["/((?!login|register|public).*)"], // Protect all routes except login, register, and public pages
};
