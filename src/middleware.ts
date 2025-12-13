import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Assign a persistent device token if not already set
  // const existingDeviceToken = req.cookies.get("device_token");
  // if (!existingDeviceToken) {
  //   const deviceToken = crypto.randomUUID();
  //   const oneYearInSeconds = 60 * 60 * 24 * 365;

  //   res.cookies.set("device_token", deviceToken, {
  //     httpOnly: false,
  //     secure: process.env.NODE_ENV === "production",
  //     maxAge: oneYearInSeconds,
  //     sameSite: "lax",
  //     path: "/",
  //   });
  // }

  // const authToken = req.cookies.get("authToken");
  // const pathname = req.nextUrl.pathname;
  // const queries = req.nextUrl.search
  // const fullPath = pathname + queries
  // console.log("Middleware - Pathname:", pathname, queries);

  // // 🧩 If no token and visiting protected or admin routes → redirect to login
  // if (
  //   !authToken &&
  //   ["/profile", "/admin", "/thankyou"].some((route) => pathname.startsWith(route))
  // ) {

  //   const redirectRes = NextResponse.redirect(new URL("/login", req.url));

  //   if (!fullPath.includes(undefined)) {
  //     redirectRes.cookies.set("callback_url", fullPath, {
  //       httpOnly: false,
  //       secure: process.env.NODE_ENV === "production",
  //       path: "/",
  //     });
  //   }


  //   return redirectRes;
  // }

  // // ✅ If token exists, decode it
  // if (authToken) {
  //   try {
  //     const decoded: any = jwt.decode(authToken.value);

  //     // Handle login/signup redirection
  //     if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
  //       if (decoded?.is_admin) {
  //         return NextResponse.redirect(
  //           new URL(`/admin/${decoded?.user_id}/dashboard`, req.url)
  //         );
  //       } else {
  //         return NextResponse.redirect(new URL("/", req.url));
  //       }
  //     }

  //     // 🔒 Admin Access Control
  //     if (decoded?.is_admin) {
  //       // Redirect admin visiting `/` or non-admin routes to dashboard
  //       if (
  //         pathname === "/" ||
  //         (!pathname.startsWith("/admin") &&
  //           !pathname.startsWith("/login") &&
  //           !pathname.startsWith("/signup"))
  //       ) {
  //         return NextResponse.redirect(
  //           new URL(`/admin/${decoded?.user_id}/dashboard`, req.url)
  //         );
  //       }
  //     } else {
  //       // 🚫 Non-admin users cannot access `/admin/*`
  //       if (pathname.startsWith("/admin")) {
  //         return NextResponse.redirect(new URL("/", req.url));
  //       }
  //     }
  //   } catch (err) {
  //     console.error("JWT decode error:", err);
  //     const redirectRes = NextResponse.redirect(new URL("/login", req.url));

  //     if (!fullPath.includes(undefined)) {
  //       redirectRes.cookies.set("callback_url", fullPath, {
  //         httpOnly: false,
  //         secure: process.env.NODE_ENV === "production",
  //         path: "/",
  //       });
  //     }

  //     return redirectRes;
  //   }
  // }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/login",
    "/signup",
    "/admin/:path*",
    "/thankyou",
  ],
};
