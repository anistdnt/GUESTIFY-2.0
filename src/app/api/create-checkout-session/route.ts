import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});

//backend part
export async function POST(req: Request) {
    try {
        const { items, user_id, location } = await req.json();

        // Example product data
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: items.map((item: any) => ({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                        images: item.images
                    },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            })),
            success_url: `http://localhost:3001/thankyou?lat=${location.latitude}&long=${location.longitude}`,
            cancel_url: `http://localhost:3001/profile/${user_id}/my-bookings`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
