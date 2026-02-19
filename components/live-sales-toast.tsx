"use client";

import { simulatedBuyerNames } from "@/lib/seed-data";
import { Product } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface SaleEvent {
  id: string;
  buyer: string;
  productTitle: string;
  secondsAgo: number;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function LiveSalesToast({ products }: { products: Product[] }) {
  const [event, setEvent] = useState<SaleEvent | null>(null);
  const pool = useMemo(() => products.slice(0, 25), [products]);

  useEffect(() => {
    if (pool.length === 0) return;

    const renderEvent = () => {
      const product = pickRandom(pool);
      setEvent({
        id: crypto.randomUUID(),
        buyer: pickRandom(simulatedBuyerNames),
        productTitle: product.title,
        secondsAgo: Math.floor(Math.random() * 35) + 5
      });
    };

    renderEvent();
    const timer = setInterval(renderEvent, 5500);
    return () => clearInterval(timer);
  }, [pool]);

  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-50">
      <AnimatePresence mode="wait">
        {event && (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -25, y: 25 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -15, y: 15 }}
            transition={{ duration: 0.4 }}
            className="glass-panel pointer-events-auto max-w-sm rounded-2xl px-4 py-3 shadow-xl"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-electric-purple">Live Sale</div>
            <div className="mt-1 text-sm leading-relaxed text-white">
              <span className="font-semibold text-gold">{event.buyer}</span> purchased{" "}
              <span className="font-semibold">{event.productTitle}</span>
            </div>
            <div className="mt-1 text-xs text-muted">{event.secondsAgo} seconds ago</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
