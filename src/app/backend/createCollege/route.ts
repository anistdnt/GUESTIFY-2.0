import { createMongoConnection } from "@/lib/connect";
import { College } from "@/models/colleges";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        // Connect with the database
        await createMongoConnection();

        try {

            const {college_name,address,district,pincode,image_url} = await request.json();

            const res = await College.create({
                college_name: college_name,
                address: address,
                district: district,
                pincode: pincode,
                image_url: image_url
            });

            return NextResponse.json({ message : "College enlisted successfully",result: res });

        } catch (err: any) {
            console.log(`An error occurred while enlisting college ----> ${err.message}`);

            // Handling Mongoose Validation Errors
            if (err instanceof mongoose.Error.ValidationError) {
                let messages: string[] = [];

                for (const field in err.errors) {
                    messages.push(err.errors[field].message);
                }

                return NextResponse.json(
                    { message: "Validation Error", details: messages },
                    { status: 400 }
                );
            }

            // Handling Duplicate Key Error (Unique Constraint Violation)
            if (err.code === 11000) {
                return NextResponse.json(
                    { error: "College name already exists. Please use a different name." },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { error: `College not enlisted: ${err.message}` },
                { status: 400 }
            );
        }

    } catch (err: any) {
        console.log(`An error occurred while establishing connection ----> ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
