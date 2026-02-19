import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vanguard Digital | فانغارد الرقمي",
  description:
    "Luxury digital products marketplace built with Next.js, Tailwind CSS, and Supabase. Launch your digital empire with premium assets."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white antialiased">
        <div className="min-h-screen bg-hero-radial">{children}</div>
      </body>
    </html>
  );
}
