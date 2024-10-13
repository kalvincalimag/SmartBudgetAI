import { NextResponse } from "next/server";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata.userId;
      
      if (!userId) {
        console.error("User ID not found in session metadata");
        return NextResponse.json({ error: "User ID not found" }, { status: 400 });
      }

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          subscriptionStatus: "premium",
          subscriptionExpiration: expirationDate.toISOString(),
        },
      });

      console.log(`User ${userId} upgraded to premium successfully`);
      return NextResponse.json({ received: true, updated: true });
    } catch (error) {
      console.error("Error updating user metadata:", error);
      return NextResponse.json({ error: "Failed to update user metadata" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}