"use client";

import { motion } from "framer-motion";

export interface ChartPoint {
  label: string;
  revenue: number;
}

export function AdminSalesChart({ points }: { points: ChartPoint[] }) {
  const max = Math.max(...points.map((point) => point.revenue), 100);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-electric-purple">Sales Chart</p>
          <h3 className="text-lg font-semibold text-white">7-Day Revenue Trend</h3>
        </div>
      </div>
      <div className="flex h-56 items-end gap-3">
        {points.map((point, index) => {
          const height = Math.max(8, Math.round((point.revenue / max) * 100));
          return (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="w-full rounded-t-xl bg-gradient-to-t from-electric-purple to-gold"
              />
              <span className="text-xs text-muted">{point.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
