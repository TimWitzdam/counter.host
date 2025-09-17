import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/app"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookieStore = await cookies();

  const sessionCookie = cookieStore.has("session");
  const awaitingVerifyCookie = cookieStore.has("awaiting_verify");

  if (isProtectedRoute && (!sessionCookie || awaitingVerifyCookie)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    sessionCookie &&
    !awaitingVerifyCookie &&
    !req.nextUrl.pathname.startsWith("/app")
  ) {
    return NextResponse.redirect(new URL("/app", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
