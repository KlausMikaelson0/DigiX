"use client";

import { Category } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

export function FeaturedCollections({ categories }: { categories: Category[] }) {
  return (
    <section className="px-6 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-electric-purple">Featured Collections</p>
            <h2 className="mt-2 text-3xl font-semibold">Curated for Growth and Prestige</h2>
          </div>
          <Link href="/products" className="text-sm text-gold hover:text-white">
            View all products
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="glass-panel rounded-2xl p-5"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-muted">Collection</div>
              <h3 className="mt-2 text-lg font-semibold text-white">{category.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{category.description}</p>
              <Link
                href={`/products?category=${category.slug}`}
                className="mt-5 inline-block rounded-full border border-white/15 px-4 py-2 text-xs text-gold transition hover:border-gold/50 hover:text-white"
              >
                Enter Collection
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
