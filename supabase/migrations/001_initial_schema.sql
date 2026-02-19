-- Vanguard Digital Marketplace schema
-- Run this migration in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id text primary key,
  name text not null unique,
  slug text not null unique,
  description text not null,
  accent text not null default '#8b5cf6',
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text not null,
  role text not null default 'buyer' check (role in ('buyer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  category_id text not null references public.categories(id) on delete restrict,
  category_slug text not null,
  slug text not null unique,
  title text not null,
  description text not null,
  price_sar integer not null check (price_sar >= 50 and price_sar <= 500),
  download_link text not null,
  image_url text not null,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  buyer_email text not null,
  product_id text not null references public.products(id) on delete restrict,
  amount_sar integer not null check (amount_sar > 0),
  payment_provider text not null check (payment_provider in ('stripe_sim', 'paddle_sim')),
  payment_reference text not null unique,
  status text not null check (status in ('pending', 'paid', 'failed')) default 'paid',
  download_link text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category_slug on public.products(category_slug);
create index if not exists idx_orders_buyer_email on public.orders(buyer_email);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

alter table public.categories enable row level security;
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "public can read categories" on public.categories;
create policy "public can read categories" on public.categories for select using (true);

drop policy if exists "public can read products" on public.products;
create policy "public can read products" on public.products for select using (true);

drop policy if exists "public can manage products for demo" on public.products;
create policy "public can manage products for demo" on public.products for all using (true) with check (true);

drop policy if exists "public can manage users for demo" on public.users;
create policy "public can manage users for demo" on public.users for all using (true) with check (true);

drop policy if exists "public can manage orders for demo" on public.orders;
create policy "public can manage orders for demo" on public.orders for all using (true) with check (true);
