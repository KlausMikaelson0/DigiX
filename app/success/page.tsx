import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getOrderById } from "@/lib/store";
import { formatSar } from "@/lib/utils";
import Link from "next/link";

interface SuccessPageProps {
  searchParams?: {
    order?: string;
  };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams?.order;
  const order = orderId ? await getOrderById(orderId) : null;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 py-12">
        <section className="glass-panel rounded-3xl p-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-electric-purple">Payment Successful</p>
          <h1 className="mt-2 text-4xl font-semibold">Welcome to Vanguard Digital</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Your purchase is confirmed and your download is now unlocked. This mirrors the final state of Stripe/Paddle webhooks in production.
          </p>

          {order ? (
            <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
              <p className="text-sm text-muted">Product</p>
              <p className="text-xl font-semibold text-white">{order.product?.title ?? "Premium Product"}</p>
              <p className="mt-1 text-sm text-muted">
                Paid {formatSar(order.amount_sar)} · {order.payment_provider === "stripe_sim" ? "Stripe Simulation" : "Paddle Simulation"}
              </p>
              <a
                href={order.download_link}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-full border border-gold/50 px-5 py-2 text-sm font-semibold text-gold transition hover:bg-gold/10"
              >
                Download Asset
              </a>
              <div className="mt-5 border-t border-white/10 pt-5">
                <Link href={`/dashboard?email=${encodeURIComponent(order.buyer_email)}`} className="text-sm text-electric-purple hover:text-white">
                  Open buyer dashboard →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-dashed border-white/20 p-5 text-sm text-muted">
              No order was supplied. Complete checkout to see delivery details here.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
