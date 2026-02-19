import { Product } from "@/lib/types";
import { formatSar } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-surface/80 transition hover:-translate-y-1 hover:border-electric-purple/45">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
        />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-electric-purple">{product.category_slug.replace(/-/g, " ")}</p>
        <h3 className="line-clamp-2 text-lg font-semibold">{product.title}</h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{product.description}</p>
        <div className="flex items-center justify-between pt-1">
          <div className="text-xl font-semibold text-gold">{formatSar(product.price_sar)}</div>
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-electric-purple px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-500"
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  );
}
