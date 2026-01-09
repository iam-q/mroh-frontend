"use server";

import { headers } from "next/headers";
import "server-only";
import Stripe from "stripe";

export async function fetchClientSecret() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.NEXT_PUBLIC_PRICE_ID;

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!priceId) {
    throw new Error("NEXT_PUBLIC_PRICE_ID is not set");
  }

  const stripe = new Stripe(stripeSecretKey);
  const origin = (await headers()).get("origin");

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of
        // the product you want to sell
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.client_secret) {
    throw new Error("Stripe session missing client_secret");
  }

  return session.client_secret;
}
