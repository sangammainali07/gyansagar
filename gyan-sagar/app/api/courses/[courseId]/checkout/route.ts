import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(
  request: Request,
  { params }: { params: Promise<{  courseId: string  }> }
) {
  const { courseId } = await params;

  try {
    // 1️⃣ Get current user
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2️⃣ Check course exists and is published
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course || !course.isPublished) {
      return new Response("Course not found", { status: 404 });
    }

    // 3️⃣ Check if user already purchased
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });

    if (purchase) {
      return new Response("Already purchased", { status: 400 });
    }

    // 4️⃣ Create or fetch Stripe customer
    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    // 5️⃣ Create Stripe Checkout Session
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description ?? undefined,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
    //   payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?canceled=true`,
        metadata: {
            courseId: course.id,
            userId: user.id,
        }
    });

    return NextResponse.json({ url:session.url });
  } catch (error) {
    console.error("[COURSE_ID_CHECKOUT_ERROR]", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}