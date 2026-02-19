-- Vanguard Digital seed data
-- Inserts 5 categories + 100 products + demo users/orders.

with category_map as (
  select *
  from (
    values
      ('cat-social-media-assets', 'Social Media Assets', 'social-media-assets', 'Luxury social media packs engineered to maximize engagement and authority.', '#8b5cf6', 'Social Media Vault', 1),
      ('cat-e-books', 'E-books', 'e-books', 'Persuasive, high-converting digital books for creators and operators.', '#f5c451', 'Knowledge Blueprint', 2),
      ('cat-business-templates', 'Business Templates', 'business-templates', 'Executive-grade templates to help founders launch and scale faster.', '#6d28d9', 'Business Framework', 3),
      ('cat-programming-scripts', 'Programming Scripts', 'programming-scripts', 'Production-ready scripts and automations built for modern teams.', '#f59e0b', 'Code Accelerator', 4),
      ('cat-graphic-design', 'Graphic Design', 'graphic-design', 'Premium design resources crafted for brand impact and speed.', '#a855f7', 'Design Prestige Kit', 5)
  ) as c(id, name, slug, description, accent, title_seed, ordinal)
)
insert into public.categories (id, name, slug, description, accent)
select id, name, slug, description, accent
from category_map
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  accent = excluded.accent;

with
  title_leads as (
    select
      array[
        'Elite', 'Imperial', 'Royal', 'Prestige', 'Signature', 'Prime', 'Apex', 'Noble', 'Founders''', 'Executive',
        'Infinite', 'Velocity', 'Growth', 'Authority', 'Platinum', 'Command', 'Legacy', 'Momentum', 'Quantum', 'Visionary'
      ]::text[] as arr
  ),
  title_closers as (
    select
      array[
        'Master Suite', 'Conversion Edition', 'Revenue Kit', 'Launch Collection', 'Scale Pack', 'Authority Bundle',
        'Premium System', 'Pro Toolkit', 'Performance Stack', 'Monetization Engine', 'Accelerator Vault', 'Luxury Bundle',
        'Executive Blueprint', 'Profit Sprint', 'Creator Arsenal', 'High-Ticket Formula', 'Impact Framework', 'Growth Engine',
        'Domination Pack', 'Smart Asset Vault'
      ]::text[] as arr
  ),
  hooks as (
    select
      array[
        'Built for ambitious operators, this product gives you a polished foundation that instantly elevates brand perception.',
        'Every element was crafted to look premium out of the box, so you can launch with confidence and skip low-quality guesswork.',
        'Designed for digital entrepreneurs, this asset combines aesthetics and conversion psychology in a single ready-to-use package.',
        'If you want to move faster while maintaining a luxury brand image, this resource becomes your unfair advantage from day one.',
        'Engineered for modern creators, it transforms scattered ideas into a clear, profitable system that is easy to execute.'
      ]::text[] as arr
  ),
  category_map as (
    select *
    from (
      values
        ('cat-social-media-assets', 'Social Media Assets', 'social-media-assets', 'Social Media Vault', 1),
        ('cat-e-books', 'E-books', 'e-books', 'Knowledge Blueprint', 2),
        ('cat-business-templates', 'Business Templates', 'business-templates', 'Business Framework', 3),
        ('cat-programming-scripts', 'Programming Scripts', 'programming-scripts', 'Code Accelerator', 4),
        ('cat-graphic-design', 'Graphic Design', 'graphic-design', 'Design Prestige Kit', 5)
    ) as c(id, name, slug, title_seed, ordinal)
  ),
  generated as (
    select
      format('prod-%s-%s', c.slug, lpad(gs::text, 2, '0')) as id,
      c.id as category_id,
      c.slug as category_slug,
      lower(
        regexp_replace(
          format(
            '%s-%s-%s-%s',
            c.slug,
            words.lead_word,
            words.close_word,
            gs::text
          ),
          '[^a-z0-9]+',
          '-',
          'g'
        )
      ) as slug,
      format('%s %s %s', words.lead_word, c.title_seed, words.close_word) as title,
      concat(
        words.hook,
        E'\n\n',
        format(
          'Inside "%s %s %s", you get structured components that reduce production time, improve visual consistency, and help your %s workflow feel enterprise-ready. Instead of rebuilding from scratch, you deploy a refined system that supports higher pricing and stronger customer trust.',
          words.lead_word,
          c.title_seed,
          words.close_word,
          lower(c.name)
        ),
        E'\n\n',
        'Use it as your plug-and-play growth layer: deploy quickly, customize the details, and position your offer like a premium brand. The result is faster execution, cleaner delivery, and a storefront experience that feels worthy of a 10,000 SAR build budget.'
      ) as description,
      (50 + mod((c.ordinal * 67 + gs * 29), 451))::int as price_sar,
      format('https://downloads.vanguard-digital.com/%s/%s.zip', c.slug, lower(regexp_replace(format('%s-%s-%s', c.slug, words.lead_word, gs), '[^a-z0-9]+', '-', 'g'))) as download_link,
      format('https://picsum.photos/seed/vanguard-%s-%s/1280/860', c.slug, gs) as image_url,
      (gs <= 3 or mod(gs, 9) = 0) as featured,
      now() - ((20 - gs) || ' days')::interval as created_at
    from category_map c
    cross join generate_series(1, 20) as gs
    cross join lateral (
      select
        leads.arr[gs] as lead_word,
        closers.arr[((gs + c.ordinal * 3 - 1) % 20) + 1] as close_word,
        hook_arr.arr[((gs - 1) % 5) + 1] as hook
      from title_leads leads, title_closers closers, hooks as hook_arr
    ) as words
  )
insert into public.products (id, category_id, category_slug, slug, title, description, price_sar, download_link, image_url, featured, created_at)
select id, category_id, category_slug, slug, title, description, price_sar, download_link, image_url, featured, created_at
from generated
on conflict (id) do update
set
  category_id = excluded.category_id,
  category_slug = excluded.category_slug,
  slug = excluded.slug,
  title = excluded.title,
  description = excluded.description,
  price_sar = excluded.price_sar,
  download_link = excluded.download_link,
  image_url = excluded.image_url,
  featured = excluded.featured;

insert into public.users (email, full_name, role)
values
  ('admin@vanguard.digital', 'Vault Administrator', 'admin'),
  ('buyer1@example.com', 'Nora Al-Sayegh', 'buyer'),
  ('buyer2@example.com', 'Youssef Kareem', 'buyer'),
  ('buyer3@example.com', 'Amira Salem', 'buyer'),
  ('buyer4@example.com', 'Fahad Nasser', 'buyer'),
  ('buyer5@example.com', 'Laila Rahman', 'buyer')
on conflict (email) do update
set
  full_name = excluded.full_name,
  role = excluded.role;

with buyers as (
  select id, email
  from public.users
  where role = 'buyer'
  order by email
),
generated_orders as (
  select
    gen_random_uuid() as id,
    b.id as user_id,
    b.email as buyer_email,
    p.id as product_id,
    p.price_sar as amount_sar,
    case when (row_number() over ()) % 2 = 0 then 'stripe_sim' else 'paddle_sim' end as payment_provider,
    format('SEED-%s-%s', replace(split_part(b.email, '@', 1), '.', ''), row_number() over ()) as payment_reference,
    'paid'::text as status,
    p.download_link,
    now() - ((row_number() over ()) % 10 || ' days')::interval as created_at
  from buyers b
  join lateral (
    select id, price_sar, download_link
    from public.products
    where category_slug in ('social-media-assets', 'e-books', 'business-templates', 'programming-scripts', 'graphic-design')
    order by random()
    limit 4
  ) p on true
)
insert into public.orders (id, user_id, buyer_email, product_id, amount_sar, payment_provider, payment_reference, status, download_link, created_at)
select id, user_id, buyer_email, product_id, amount_sar, payment_provider, payment_reference, status, download_link, created_at
from generated_orders
on conflict (payment_reference) do nothing;
