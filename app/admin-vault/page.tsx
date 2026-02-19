import { AdminProductManager } from "@/components/admin-product-manager";
import { AdminSalesChart } from "@/components/admin-sales-chart";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getAdminSnapshot, getCategories, getProducts } from "@/lib/store";
import { formatSar } from "@/lib/utils";

interface AdminVaultProps {
  searchParams?: {
    key?: string;
  };
}

export default async function AdminVaultPage({ searchParams }: AdminVaultProps) {
  const expectedKey = process.env.ADMIN_VAULT_KEY ?? "vanguard-vault";
  const unlocked = searchParams?.key === expectedKey;

  if (!unlocked) {
    return (
      <>
        <Navbar />
        <main className="mx-auto w-full max-w-2xl px-6 py-14">
          <section className="glass-panel rounded-3xl p-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-electric-purple">Restricted Area</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Admin Vault Locked</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              This route is intentionally secret. Open <code className="rounded bg-white/10 px-2 py-1">/admin-vault?key=YOUR_KEY</code> and
              set <code className="rounded bg-white/10 px-2 py-1">ADMIN_VAULT_KEY</code> in your environment for secure access.
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const [snapshot, products, categories] = await Promise.all([getAdminSnapshot(), getProducts(), getCategories()]);

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl space-y-6 px-6 py-10">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] text-electric-purple">Admin Vault</p>
          <h1 className="mt-2 text-4xl font-semibold">Vanguard Digital Operations</h1>
          <p className="mt-2 text-muted">Sales analytics, order pulse, and product management in one premium console.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Revenue", value: formatSar(snapshot.totalRevenueSar) },
            { label: "Total Orders", value: snapshot.totalOrders.toString() },
            { label: "Products Live", value: snapshot.totalProducts.toString() },
            { label: "Conversion Signal", value: `${snapshot.conversionRate}%` }
          ].map((metric) => (
            <article key={metric.label} className="glass-panel rounded-2xl p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-muted">{metric.label}</p>
              <p className="mt-2 text-3xl font-semibold text-gold">{metric.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <AdminSalesChart points={snapshot.chart} />
          <div className="glass-panel rounded-2xl p-6">
            <p className="text-xs uppercase tracking-[0.16em] text-electric-purple">Top Products</p>
            <h3 className="text-lg font-semibold text-white">Revenue Leaders</h3>
            <div className="mt-4 space-y-3">
              {snapshot.topProducts.length === 0 ? (
                <p className="text-sm text-muted">No orders yet. Complete checkouts to populate analytics.</p>
              ) : (
                snapshot.topProducts.map((item) => (
                  <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <div className="mt-1 text-xs text-muted">
                      {item.units} sales · {formatSar(item.revenue)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-electric-purple">Recent Orders</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {snapshot.recentOrders.length === 0 ? (
              <p className="text-sm text-muted">No sales yet. Run a checkout simulation to generate data.</p>
            ) : (
              snapshot.recentOrders.map((order) => (
                <article key={order.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{order.product?.title ?? "Product"}</p>
                  <p className="text-xs text-muted">{order.buyer_email}</p>
                  <p className="mt-1 text-xs text-gold">{formatSar(order.amount_sar)}</p>
                </article>
              ))
            )}
          </div>
        </section>

        <AdminProductManager initialProducts={products} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
