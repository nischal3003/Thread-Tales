create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  price integer not null,
  is_new boolean not null default false,
  tagline text not null default '',
  description text not null default '',
  care text not null default '',
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  label text not null,
  stock integer not null default 0,
  unique (product_id, label)
);

alter table products enable row level security;
alter table product_sizes enable row level security;

create policy "Public can read products"
  on products for select
  to anon, authenticated
  using (true);

create policy "Public can read product sizes"
  on product_sizes for select
  to anon, authenticated
  using (true);

-- No insert/update/delete policies for anon/authenticated: only the
-- service_role key (used server-side in the admin panel) can write,
-- and service_role bypasses RLS entirely.

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

-- No select/insert policies for anon/authenticated: signups go through
-- the /api/newsletter route using the service_role key server-side.
