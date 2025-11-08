import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get("authToken")?.value; 
  const { id } = params;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}booking/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("PDF download response status:", res);

    if (!res.ok) {
      throw new Error("Backend PDF download failed");
    }

    const blob = await res.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=booking_${id}.pdf`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to download PDF" }, { status: 500 });
  }
}
