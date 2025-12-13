import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const matchRoute = (pattern: string, pathname: string) => {
  if (!pattern.includes("*")) {
    return pathname === pattern;
  }
  const base = pattern.replace("/*", "");
  return pathname === base || pathname.startsWith(`${base}/`);
};

// Routes that are only accessible if someone is not logged in
const PUBLIC_ONLY_ROUTES = ["/login", "/signup"];

// Routes that admin can not access
const ADMIN_SPECIAL_NOT_ACESS_ROUTES = ["/", "/search", "/explore"];

const ADMIN_ONLY_ROUTES = ["/admin/*"];
const USER_ONLY_ROUTES = ["/profile/*", "/thankyou"];

export function middleware(req: NextRequest) {

  // Getting pathname and auth token from cookies
  const { pathname } = req.nextUrl;
  const authToken = req.cookies.get("authToken")?.value;

  let role = null;
  let id = null;

  // If authtoken is available then decode the token and extract role and id
  if (authToken){
    try {
        const decodedToken: JwtPayload = jwt.decode(authToken) as JwtPayload;
        id = decodedToken?.user_id || null;
        role = decodedToken?.is_admin ? "admin" : "user";
    } catch (error) { 
        return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  console.log(`Middleware triggered for path ====> ${pathname}`);
  console.log("Role =====>", role)

  // If autoken is present and user is trying to access login or signup page, redirect to respective dashboard
  if (authToken && PUBLIC_ONLY_ROUTES?.includes(pathname)) {
    if (role === "admin") {
        return NextResponse.redirect(new URL(`/admin/${id}/dashboard`, req.url));
    } else if (role === "user") {
        return NextResponse.redirect(new URL(`/profile/${id}`, req.url));
    }
  }

  if(authToken && role === "admin" && ADMIN_SPECIAL_NOT_ACESS_ROUTES.includes(pathname)){
    return NextResponse.redirect(new URL(`/admin/${id}/dashboard`, req.url));
  }

  // Check if the requested path is an admin-only route
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
    matchRoute(route, pathname)
  );

  // Check if the requested path is a user-only route
  const isUserRoute = USER_ONLY_ROUTES.some((route) =>
    matchRoute(route, pathname)
  );

  // If admin route and role is not admin, redirect to login
  if (isAdminRoute) {
    if(role === null){
        return NextResponse.redirect(new URL("/login", req.url));
    }
    else if (role !== "admin") {
        return NextResponse.redirect(new URL(`/profile/${id}`, req.url));
    }
  }

  // If user route and role is not user, redirect to login
  if (isUserRoute) {
    if(role === null){
        return NextResponse.redirect(new URL("/login", req.url));
    }
    else if (role !== "user") {
        return NextResponse.redirect(new URL(`/admin/${id}/dashboard`, req.url));
    }
  }

  return NextResponse.next();
}
