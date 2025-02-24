import { createMongoConnection } from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    // Connect the database
    await createMongoConnection();

    return NextResponse.json({ result: 1 });
  } catch (err) {
    if (err instanceof Error) {
      console.log(
        `An error occurred while establishing connection ----> ${err.message}`
      );
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.log(
        `An error occurred while establishing connection ----> ${err}`
      );
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}
