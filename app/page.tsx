import { FeaturedCollections } from "@/components/featured-collections";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { LiveSalesToast } from "@/components/live-sales-toast";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { ReviewsSection } from "@/components/reviews-section";
import { seedReviews } from "@/lib/seed-data";
import { getCategories, getProducts } from "@/lib/store";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts({ featuredOnly: true, limit: 8 })
  ]);

  return (
    <>
      <Navbar />
      <main className="pb-12">
        <HeroSection />
        <FeaturedCollections categories={categories} />

        <section className="px-6 py-10">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-xs uppercase tracking-[0.2em] text-electric-purple">Featured Products</p>
            <h2 className="mt-2 text-3xl font-semibold">Premium assets ready for instant delivery</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <ReviewsSection reviews={seedReviews} />
      </main>
      <Footer />
      <LiveSalesToast products={featuredProducts} />
    </>
  );
}
