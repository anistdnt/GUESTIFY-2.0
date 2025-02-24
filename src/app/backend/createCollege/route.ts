import { createMongoConnection } from "@/lib/connect";
import { College } from "@/models/colleges";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Connect with the database
    await createMongoConnection();

    try {
      const { college_name, address, district, pincode, image_url } =
        await request.json();

      if (
        !(
          typeof college_name === "string" &&
          typeof address === "string" &&
          typeof district === "string" &&
          typeof pincode === "number" &&
          typeof image_url === "string"
        )
      ) {
        const array_of_cast_error: string[] = [];
        if (!(typeof college_name === "string")) {
          array_of_cast_error.push("College name must be of type string");
        }
        if (!(typeof address === "string")) {
          array_of_cast_error.push("Address must be of type string");
        }
        if (!(typeof district === "string")) {
          array_of_cast_error.push("District name must be of type string");
        }
        if (!(typeof pincode === "number")) {
          array_of_cast_error.push("Pincode must be of type number");
        }
        if (!(typeof image_url === "string")) {
          array_of_cast_error.push("Image must be of type string");
        }

        throw new Error(array_of_cast_error.toString());
      }

      const college_res = await College.find({ college_name: college_name });

      if (college_res.length !== 0) {
        throw new Error("College already exists. Please try another name");
      }

      const res = await College.create({
        college_name: college_name,
        address: address,
        district: district,
        pincode: pincode,
        image_url: image_url,
      });

      return NextResponse.json({
        message: "College enlisted successfully",
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
            error: err.message.split(","),
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
