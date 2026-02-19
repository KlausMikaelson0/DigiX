"use client";

import { Category, Product } from "@/lib/types";
import { formatSar } from "@/lib/utils";
import { FormEvent, useState } from "react";

interface NewProductInput {
  title: string;
  categorySlug: string;
  description: string;
  priceSar: number;
  imageUrl: string;
  downloadLink: string;
}

const emptyInput: NewProductInput = {
  title: "",
  categorySlug: "",
  description: "",
  priceSar: 120,
  imageUrl: "https://picsum.photos/seed/vanguard-admin-new/1280/860",
  downloadLink: "https://downloads.vanguard-digital.com/custom/new-product.zip"
};

export function AdminProductManager({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<NewProductInput>({
    ...emptyInput,
    categorySlug: categories[0]?.slug ?? "social-media-assets"
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error("Failed to create product");
      const payload = (await response.json()) as { product: Product };
      setProducts((previous) => [payload.product, ...previous]);
      setForm({ ...emptyInput, categorySlug: categories[0]?.slug ?? form.categorySlug });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setBusy(false);
    }
  };

  const toggleFeatured = async (product: Product) => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, featured: !product.featured })
      });
      if (!response.ok) throw new Error("Failed to update product");
      setProducts((previous) => previous.map((item) => (item.id === product.id ? { ...item, featured: !item.featured } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setBusy(false);
    }
  };

  const removeProduct = async (product: Product) => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/products?productId=${product.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
      setProducts((previous) => previous.filter((item) => item.id !== product.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="glass-panel rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white">Product Management</h3>
        <p className="mt-1 text-sm text-muted">Add premium products or optimize feature visibility from this vault.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            required
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Product title"
            className="rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
          />
          <select
            value={form.categorySlug}
            onChange={(event) => setForm((prev) => ({ ...prev, categorySlug: event.target.value }))}
            className="rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={50}
            max={500}
            value={form.priceSar}
            onChange={(event) => setForm((prev) => ({ ...prev, priceSar: Number(event.target.value) }))}
            placeholder="Price (SAR)"
            className="rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
          />
          <input
            required
            value={form.imageUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            placeholder="Image URL"
            className="rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2"
          />
          <input
            required
            value={form.downloadLink}
            onChange={(event) => setForm((prev) => ({ ...prev, downloadLink: event.target.value }))}
            placeholder="Download link"
            className="rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2 md:col-span-2"
          />
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="3-paragraph persuasive description"
            className="rounded-xl border border-white/15 bg-background px-4 py-2 text-white outline-none ring-electric-purple transition focus:ring-2 md:col-span-2"
          />
        </div>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-4 rounded-full bg-electric-purple px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {busy ? "Saving..." : "Create Product"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-surface/70 text-sm">
            {products.slice(0, 20).map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{product.title}</div>
                  <div className="line-clamp-1 text-xs text-muted">{product.slug}</div>
                </td>
                <td className="px-4 py-3 text-muted">{product.category_slug.replace(/-/g, " ")}</td>
                <td className="px-4 py-3 text-gold">{formatSar(product.price_sar)}</td>
                <td className="px-4 py-3 text-muted">{product.featured ? "Featured" : "Standard"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleFeatured(product)}
                      disabled={busy}
                      className="rounded-full border border-white/20 px-3 py-1 text-xs text-white transition hover:border-electric-purple hover:text-electric-purple"
                    >
                      {product.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      onClick={() => removeProduct(product)}
                      disabled={busy}
                      className="rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-200 transition hover:bg-rose-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
