"use client";

import { Product } from "@/lib/types";
import { formatSar } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function CheckoutForm({ product }: { product: Product }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] = useState<"stripe_sim" | "paddle_sim">("stripe_sim");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          fullName,
          email,
          provider
        })
      });

      if (!response.ok) {
        throw new Error("Unable to process payment simulation");
      }

      const payload = (await response.json()) as { successUrl: string; buyerEmail: string };
      localStorage.setItem("vanguard:lastBuyerEmail", payload.buyerEmail);
      router.push(payload.successUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-surface/75 p-6">
      <h2 className="text-xl font-semibold text-white">Secure Checkout Simulation</h2>
      <p className="text-sm text-muted">
        Product total: <span className="font-semibold text-gold">{formatSar(product.price_sar)}</span>
      </p>

      <label className="block text-sm text-muted">
        Full Name
        <input
          required
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
          placeholder="Your premium client name"
        />
      </label>

      <label className="block text-sm text-muted">
        Email Address
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
          placeholder="you@brand.com"
        />
      </label>

      <label className="block text-sm text-muted">
        Payment Provider
        <select
          value={provider}
          onChange={(event) => setProvider(event.target.value as "stripe_sim" | "paddle_sim")}
          className="mt-1 w-full rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
        >
          <option value="stripe_sim">Stripe Simulation</option>
          <option value="paddle_sim">Paddle Simulation</option>
        </select>
      </label>

      {error && <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-electric-purple px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Processing..." : "Pay & Unlock Instant Download"}
      </button>
    </form>
  );
}
