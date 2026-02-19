import { CheckoutForm } from "@/components/checkout-form";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getProductBySlug } from "@/lib/store";
import { formatSar } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface CheckoutPageProps {
  searchParams?: {
    product?: string;
  };
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const slug = searchParams?.product;
  const product = slug ? await getProductBySlug(slug) : null;

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        {!product ? (
          <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center">
            <h1 className="text-3xl font-semibold text-white">Select a product first</h1>
            <p className="mt-3 text-muted">Checkout is available from any product details page.</p>
            <Link href="/products" className="mt-6 inline-block rounded-full bg-electric-purple px-6 py-3 text-sm font-semibold">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-surface/70">
              <div className="relative h-72">
                <Image src={product.image_url} alt={product.title} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-electric-purple">{product.category_slug.replace(/-/g, " ")}</p>
                <h1 className="mt-2 text-2xl font-semibold text-white">{product.title}</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-6">{product.description}</p>
                <div className="mt-5 text-3xl font-semibold text-gold">{formatSar(product.price_sar)}</div>
              </div>
            </section>

            <CheckoutForm product={product} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
