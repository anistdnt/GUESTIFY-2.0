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

  return res;
}
