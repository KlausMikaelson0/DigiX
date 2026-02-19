import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="group">
          <div className="text-lg font-semibold tracking-wide text-white">
            Vanguard <span className="text-electric-purple">Digital</span>
          </div>
          <div className="text-xs text-gold transition group-hover:text-white">فانغارد الرقمي</div>
        </Link>

        <nav className="flex items-center gap-3 text-sm text-muted">
          <Link href="/products" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
            Products
          </Link>
          <Link href="/dashboard" className="rounded-full px-4 py-2 transition hover:bg-white/10 hover:text-white">
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
