import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string;

    if (role === "superadmin") return NextResponse.next();

    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login?error=access_denied", req.url));
    }
    if (pathname.startsWith("/dashboard/jury") && role !== "jury") {
      return NextResponse.redirect(new URL("/login?error=access_denied", req.url));
    }
    if (pathname.startsWith("/dashboard/controleur") && role !== "controleur") {
      return NextResponse.redirect(new URL("/login?error=access_denied", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/dashboard")) return !!token;
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
