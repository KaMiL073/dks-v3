import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;
  const { pathname } = req.nextUrl;

  // pomijamy statyczne zasoby
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // zalogowany → przekieruj z / lub /login do /aktualnosci
  if (token && (pathname === "/" || pathname === "/login")) {
    return NextResponse.redirect(new URL("/aktualnosci", req.url));
  }

  // niezalogowany → przekieruj wszystko poza /login do /login
  if (!token && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Ważne: bez /int — bo Next sam doda basePath
export const config = {
  matcher: ["/:path*"],
};