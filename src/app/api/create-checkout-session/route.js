import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { email, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.PRICE_ID_PREMIUM_PLAN,
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/upgrade?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/upgrade`,
      customer_email: email,
      metadata: {
        userId: userId,
      },
    });

    console.log("Checkout session created successfully:", session.id);
    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}