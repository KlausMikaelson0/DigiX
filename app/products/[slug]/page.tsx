import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getProductBySlug, getProducts } from "@/lib/store";
import { formatSar } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ProductDetailsProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const related = (await getProducts({ categorySlug: product.category_slug, limit: 3 })).filter((item) => item.id !== product.id);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr]">
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <div className="relative h-[420px]">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
            </div>
          </div>

          <aside className="glass-panel rounded-3xl p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-electric-purple">{product.category_slug.replace(/-/g, " ")}</p>
            <h1 className="mt-3 text-3xl font-semibold">{product.title}</h1>
            <div className="mt-4 text-4xl font-semibold text-gold">{formatSar(product.price_sar)}</div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Instant access after checkout. Includes secure download delivery and dashboard access for future re-download.
            </p>
            <Link
              href={`/checkout?product=${product.slug}`}
              className="mt-6 inline-flex rounded-full bg-electric-purple px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-purple-500"
            >
              Buy with Stripe / Paddle Simulation
            </Link>
          </aside>
        </div>

        <section className="mt-10 rounded-3xl border border-white/10 bg-surface/70 p-7">
          <h2 className="text-2xl font-semibold">Persuasive Product Description</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted">
            {product.description.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-10">
            <h3 className="text-2xl font-semibold">More from this collection</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="rounded-2xl border border-white/10 bg-surface/75 p-4 transition hover:border-electric-purple/45"
                >
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-xs text-muted">{formatSar(item.price_sar)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
