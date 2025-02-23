import { createMongoConnection } from "@/lib/connect";
import { NextResponse } from "next/server";

export async function GET(_request : Request)  : Promise<NextResponse>{
    try {
        // Connect with the database
        await createMongoConnection();

        return NextResponse.json({result : 1})
        
    } catch ( err : any ) {
        console.log(`An error occured while establishing connection ----> ${err.message}`);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}