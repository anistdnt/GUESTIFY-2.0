"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ name: "Premium Plan", price: 5000.00, quantity: 1 }],
          userID: "68012da9a9b2f3a9a37b3638"
        }),
      });

      const session = await response.json();

      if (!session?.url) throw new Error("Session URL missing from backend response");

      // ✅ New method (2025+)
      window.location.href = session.url;
    } catch (error) {
      console.error("Checkout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="bg-white text-gray-800 p-10 rounded-2xl shadow-2xl w-[400px] text-center">
        <h2 className="text-2xl font-bold mb-3">Buy Premium Access 🚀</h2>
        <p className="text-gray-500 mb-6">
          Get unlimited features for just <strong>$9.99</strong>
        </p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:from-indigo-600 hover:to-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Redirecting..." : "Pay with Stripe"}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Test card: <span className="font-mono text-gray-600">4242 4242 4242 4242</span>
        </p>
      </div>
    </div>
  );
}
