"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

import { apiUrl } from "../../utils/api";
import { fetchClientSecret } from "../../utils/stripe";

export default function Checkout() {
  const [stripePromise, setStripePromise] = useState<
    ReturnType<typeof loadStripe> | null
  >(null);
  const [stripeUnavailable, setStripeUnavailable] = useState(false);

  useEffect(() => {
    let active = true;

    const loadPublishableKey = async () => {
      try {
        const res = await fetch(apiUrl("/stripe/publishable"));
        if (!res.ok) {
          throw new Error("Failed to fetch publishable key");
        }
        const data = await res.json();
        if (!active) return;
        if (data?.key) {
          setStripePromise(loadStripe(data.key));
        } else {
          setStripeUnavailable(true);
        }
      } catch {
        if (active) {
          setStripeUnavailable(true);
        }
      }
    };

    loadPublishableKey();

    return () => {
      active = false;
    };
  }, []);

  if (!stripePromise) {
    return (
      <div id="checkout">
        {stripeUnavailable
          ? "Payments are currently unavailable."
          : "Loading payments..."}
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
