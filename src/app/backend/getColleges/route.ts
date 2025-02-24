import { createMongoConnection } from "@/lib/connect";
import { College } from "@/models/colleges";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    // Connect with the database
    await createMongoConnection();

    try {
      const res = await College.find();

      return NextResponse.json({
        message: "Colleges fetched successfully",
        result: res,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.log(
          `An error occurred while enlisting college ----> ${err.message}`
        );

        return NextResponse.json(
          {
            message: "College not enlisted",
            error: err.message,
          },
          { status: 400 }
        );
      } else {
        console.log(`An error occurred while enlisting college ----> ${err}`);
        return NextResponse.json(
          { error: `College not enlisted: ${err}` },
          { status: 400 }
        );
      }
    }
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
