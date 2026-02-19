export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Vanguard Digital (فانغارد الرقمي). Crafted for premium digital commerce.
        </p>
        <p>Dark Luxury Theme · Electric Purple + Gold</p>
      </div>
    </footer>
  );
}
