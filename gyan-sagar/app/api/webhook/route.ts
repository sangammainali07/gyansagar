
import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;
     
    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err:any) {
        console.log("Webhook signature verification failed", err);
        return new Response("Webhook Error", { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;


    if (event.type === "checkout.session.completed") {
        if (!userId || !courseId) {
            console.log("Missing userId or courseId in session metadata");
            return new Response("Invalid session data", { status: 400 });
        } 
        await db.purchase.create({
            data: {
                userId, 
                courseId
            }
        })
    }   else {
        return new NextResponse("Webhook error : Unhandled event type", { status: 200 });
    }

    return new NextResponse("null", { status: 200 });
}