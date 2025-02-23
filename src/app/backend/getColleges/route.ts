import { createMongoConnection } from "@/lib/connect";
import { College } from "@/models/colleges";
import { NextResponse } from "next/server";

export async function GET(_request: Request): Promise<NextResponse> {
    try {
        // Connect with the database
        await createMongoConnection();

        try {
            const res = await College.find();

            return NextResponse.json({ message : "Colleges fetched successfully",result: res });

        } catch (err: any) {
            console.log(`An error occurred while fetching colleges ----> ${err.message}`);

            return NextResponse.json(
                { error: `Colleges not fetched: ${err.message}` },
                { status: 400 }
            );
        }

    } catch (err: any) {
        console.log(`An error occurred while establishing connection ----> ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
