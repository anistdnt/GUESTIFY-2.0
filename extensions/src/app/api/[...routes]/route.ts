import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          result: false,
          error: "",
          message: "Token missing in request",
          status: 401,
        },
        { status: 401 }
      );
    }

    // Extract Data
    const body = await req.json();

    const url = `${process.env.SERVER_URL}${body?.url}`;

    // Call actual backend API
    const backendRes = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    // Forward backend response
    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type":
          backendRes.headers.get("Content-Type") ??
          "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Proxy error =====>", error);

    return NextResponse.json(
      {
        result: false,
        error: "",
        message: "Internal Server Error",
        status: 500,
      },
      { status: 500 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("extensionAccessToken")?.value;

    // Getting the url from "/api/...[routes]" path
    const url = `${process.env.SERVER_URL}${req.nextUrl.pathname.replace(
      "/api/",
      ""
    )}${req.nextUrl.search}`;

    if (!token) {
      return NextResponse.json(
        {
          result: false,
          error: "",
          message: "Token missing in request",
          status: 401,
        },
        { status: 401 }
      );
    }

    // Call actual backend API
    const backendRes = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // Forward backend response
    return new NextResponse(backendRes.body, {
      status: backendRes.status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Proxy error =====>", error);

    return NextResponse.json(
      {
        result: false,
        error: "",
        message: "Internal Server Error",
        status: 500,
      },
      { status: 500 }
    );
  }
}