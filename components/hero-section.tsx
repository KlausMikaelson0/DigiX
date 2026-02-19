"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-purple/40 bg-electric-purple/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-electric-purple">
            Luxury Marketplace Experience
          </div>
          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Start Your Digital Empire
            </h1>
            <p className="max-w-2xl text-pretty text-lg text-muted">
              Acquire premium-ready assets, templates, scripts, and digital products crafted for founders who sell with authority.
              Vanguard Digital gives you the speed of automation with the polish of a boutique agency.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-electric-purple px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-purple-500"
            >
              Explore the Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-gold/45 px-6 py-3 text-sm font-semibold text-gold shadow-gold transition hover:-translate-y-0.5 hover:bg-gold/10"
            >
              Access My Downloads
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="glass-panel rounded-3xl p-8"
        >
          <h2 className="text-xl font-semibold text-white">Vanguard Performance Snapshot</h2>
          <div className="mt-6 space-y-4 text-sm">
            {[
              { label: "Premium Products", value: "100+" },
              { label: "Average Delivery Time", value: "Instant" },
              { label: "Niche Collections", value: "5 Curated Segments" },
              { label: "Brand Experience", value: "Agency-Grade UI/UX" }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.15em] text-muted">{item.label}</div>
                <div className="mt-1 text-2xl font-semibold text-gold">{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
