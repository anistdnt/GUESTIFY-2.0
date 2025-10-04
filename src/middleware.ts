import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if 'device_token' cookie is already set or not
  const existingDeviceToken = req.cookies.get("device_token");

  if (!existingDeviceToken) {
    const deviceToken = crypto.randomUUID();

    const oneYearInSeconds = 60 * 60 * 24 * 365;

    res.cookies.set("device_token", deviceToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: oneYearInSeconds,
      sameSite: "lax",
      path: "/",
    });
  }

  //protected routes

  const authToken = req.cookies.get("authToken");
  const pathname = req.nextUrl.pathname;
  // console.log("Auth Token in Middleware:", authToken);

  if (
    !authToken &&
    ["/pg", "/profile"].some((route) => pathname.startsWith(route))
  ) {
    // console.log("Redirecting to login page");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Prevent logged-in users from visiting login/signup
  if (
    authToken &&
    (pathname.startsWith("/login") || pathname.startsWith("/signup"))
  ) {
    // console.log("User already logged in → redirecting to homepage");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/pg/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};
