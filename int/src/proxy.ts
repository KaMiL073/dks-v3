import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const { pathname } = url;

  // 🍪 token z ciasteczka (ustawiany w loginAction)
  const token = req.cookies.get("access_token")?.value;

  // 🔓 przepuszczamy assety, API, itp.
  const isPublic =
    pathname.startsWith("/int/_next") ||
    pathname.startsWith("/int/__nextjs") ||
    pathname.startsWith("/int/static") ||
    pathname.startsWith("/int/favicon") ||
    pathname.startsWith("/int/robots.txt") ||
    pathname.startsWith("/int/sitemap") ||
    pathname.startsWith("/int/manifest") ||
    pathname.startsWith("/int/api");

  if (isPublic) return NextResponse.next();

  // 🚫 niezalogowany → login
  if (!token && !pathname.startsWith("/int/login")) {
    return NextResponse.redirect(new URL("/int/login", req.url));
  }

  // ✅ zalogowany → przekierowanie ze strony głównej lub loginu
  const isRootInt = pathname === "/int" || pathname === "/int/";
  const isLogin = pathname.startsWith("/int/login");

  if (token && (isRootInt || isLogin)) {
    return NextResponse.redirect(new URL("/int/aktualnosci", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/int/:path*"],
};