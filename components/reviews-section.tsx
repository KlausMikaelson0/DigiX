"use client";

import { Review } from "@/lib/types";
import { motion } from "framer-motion";

export function ReviewsSection({ reviews }: { reviews: Review[] }) {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs uppercase tracking-[0.2em] text-electric-purple">Customer Reviews</p>
        <h2 className="mt-2 text-3xl font-semibold">Trusted by serious digital entrepreneurs</h2>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="glass-panel rounded-2xl p-6"
            >
              <div className="text-gold">{"★".repeat(review.rating)}</div>
              <p className="mt-4 text-sm leading-relaxed text-muted">“{review.quote}”</p>
              <div className="mt-5 text-sm font-semibold text-white">{review.name}</div>
              <div className="text-xs uppercase tracking-[0.14em] text-muted">{review.title}</div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
