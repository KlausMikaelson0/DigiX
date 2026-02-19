"use client";

import { OrderWithProduct } from "@/lib/store";
import { formatSar } from "@/lib/utils";
import { useEffect, useState } from "react";

export function DashboardDownloads({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async (targetEmail: string) => {
    if (!targetEmail) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/orders?email=${encodeURIComponent(targetEmail)}`);
      if (!response.ok) throw new Error("Unable to load purchases");
      const payload = (await response.json()) as { orders: OrderWithProduct[] };
      setOrders(payload.orders);
      localStorage.setItem("vanguard:lastBuyerEmail", targetEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialEmail) {
      fetchOrders(initialEmail);
      return;
    }
    const cached = localStorage.getItem("vanguard:lastBuyerEmail");
    if (cached) {
      setEmail(cached);
      fetchOrders(cached);
    }
  }, [initialEmail]);

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white">Buyer Access Portal</h2>
        <p className="mt-2 text-sm text-muted">Enter the same email used during checkout to unlock all purchased files.</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@brand.com"
            className="w-full rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
          />
          <button
            onClick={() => fetchOrders(email)}
            disabled={loading}
            className="rounded-full bg-electric-purple px-6 py-2 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Loading..." : "Load Purchases"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      </div>

      <div className="grid gap-4">
        {orders.length === 0 && !loading ? (
          <div className="rounded-2xl border border-dashed border-white/20 p-6 text-sm text-muted">
            No purchases found yet. Complete a checkout to auto-generate your download vault.
          </div>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-white/10 bg-surface/75 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{order.product?.title ?? "Premium Digital Product"}</h3>
                  <p className="text-sm text-muted">
                    Paid {formatSar(order.amount_sar)} · Ref {order.payment_reference}
                  </p>
                </div>
                <a
                  href={order.download_link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10 hover:text-white"
                >
                  Download Now
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
