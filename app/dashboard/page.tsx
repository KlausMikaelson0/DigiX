import { DashboardDownloads } from "@/components/dashboard-downloads";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

interface DashboardPageProps {
  searchParams?: {
    email?: string;
  };
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-electric-purple">User Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Your Purchased Downloads</h1>
          <p className="mt-2 text-muted">Access every product you bought with instant delivery links and payment references.</p>
        </header>
        <DashboardDownloads initialEmail={searchParams?.email} />
      </main>
      <Footer />
    </>
  );
}
