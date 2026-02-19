# Vanguard Digital (فانغارد الرقمي)

Luxury dark-mode digital products marketplace built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

Headline: **Start Your Digital Empire**

---

## What is included

- Standalone web application (App Router architecture).
- Dark premium UI with **Electric Purple** + **Gold** accents.
- 5 curated categories:
  - Social Media Assets
  - E-books
  - Business Templates
  - Programming Scripts
  - Graphic Design
- **100 seeded products** (20 per category) with:
  - Professional titles
  - 3-paragraph persuasive descriptions
  - 50–500 SAR pricing
  - Mock download links
  - High-quality placeholder image URLs
- Landing page with:
  - Hero section
  - Featured collections
  - Simulated live sales popup
  - Customer reviews
- Buyer dashboard for purchased downloads.
- Secret admin route: `/admin-vault` (guarded by key query param).
- Stripe/Paddle simulation checkout that redirects to success page and unlocks download.

---

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase (`@supabase/supabase-js`)

---

## Project Structure

```text
app/
  api/
    admin/products/route.ts      # Admin product CRUD (simulation-friendly)
    checkout/route.ts            # Simulated payment -> paid order
    orders/route.ts              # Buyer orders endpoint
    products/route.ts            # Product catalog endpoint
  admin-vault/page.tsx           # Secret admin dashboard
  checkout/page.tsx              # Payment simulation UI
  dashboard/page.tsx             # Buyer download vault
  products/[slug]/page.tsx       # Product details
  products/page.tsx              # Product catalog
  success/page.tsx               # Post-payment success + delivery
  layout.tsx
  page.tsx                       # Landing page
  globals.css

components/
  admin-product-manager.tsx
  admin-sales-chart.tsx
  checkout-form.tsx
  dashboard-downloads.tsx
  featured-collections.tsx
  footer.tsx
  hero-section.tsx
  live-sales-toast.tsx
  navbar.tsx
  product-card.tsx
  reviews-section.tsx

lib/
  seed-data.ts                   # 100-product generator + reviews + sales feed names
  store.ts                       # Data access layer (Supabase + in-memory fallback)
  supabase.ts                    # Supabase client helper
  types.ts
  utils.ts

supabase/
  migrations/001_initial_schema.sql
  seed.sql
```

---

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended for full admin operations)
- `ADMIN_VAULT_KEY` (default: `vanguard-vault`)

Admin URL example:

```text
/admin-vault?key=vanguard-vault
```

---

## Supabase Setup

1. Open your Supabase project SQL editor.
2. Run:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/seed.sql`
3. This creates tables (`categories`, `products`, `orders`, `users`) and loads initial marketplace data.

---

## Automated Delivery System (logic)

1. Buyer opens a product and clicks buy.
2. Checkout form posts to `POST /api/checkout`.
3. API:
   - Upserts buyer in `users`
   - Creates a paid order in `orders` (`stripe_sim` or `paddle_sim`)
   - Stores `download_link` in order row
4. API returns success URL: `/success?order=<id>`.
5. Success page fetches order and renders **instant download button**.
6. Buyer can revisit `/dashboard` and enter the same email to access all purchased downloads.

> If Supabase env variables are missing, the app runs with an in-memory fallback for demo/testing.

---

## Run Locally

```bash
npm install
npm run dev
```

Optional checks:

```bash
npm run lint
npm run typecheck
npm run build
```

---

## Notes for buyer/maintainer

- This repository is structured for quick white-label handoff.
- Product seed logic is centralized in `lib/seed-data.ts`.
- Admin can create products, toggle featured status, and delete products from `/admin-vault`.
- Replace simulation with real Stripe/Paddle webhooks by extending `app/api/checkout/route.ts` and adding webhook endpoints.
