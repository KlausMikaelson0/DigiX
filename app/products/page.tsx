import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { getCategories, getProducts } from "@/lib/store";
import Link from "next/link";

interface ProductsPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categorySlug = searchParams?.category;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug })
  ]);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-10">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-electric-purple">Marketplace Catalog</p>
          <h1 className="text-4xl font-semibold">100 Luxury Digital Products</h1>
          <p className="max-w-3xl text-muted">
            Explore premium assets across social media, books, business systems, code automation, and design kits.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`rounded-full border px-4 py-2 text-sm transition ${
              !categorySlug ? "border-electric-purple bg-electric-purple/20 text-white" : "border-white/20 text-muted hover:text-white"
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                category.slug === categorySlug
                  ? "border-electric-purple bg-electric-purple/20 text-white"
                  : "border-white/20 text-muted hover:text-white"
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
