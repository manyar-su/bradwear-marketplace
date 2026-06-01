-- Bradwear Marketplace schema
-- Jalankan di project Supabase yang sama dengan dashboard Bradwear.

create extension if not exists pgcrypto;

create table if not exists public.marketplace_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.marketplace_users(id) on delete cascade,
  session_token_hash text not null unique,
  expires_at timestamptz not null,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  base_price bigint not null default 0,
  thumbnail_url text,
  is_active boolean not null default true,
  canvas_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.marketplace_users(id) on delete cascade,
  product_id text not null,
  design_url text not null,
  design_json jsonb not null default '{}'::jsonb,
  preview_url text,
  is_downloaded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.marketplace_users(id) on delete cascade,
  design_id uuid references public.marketplace_designs(id) on delete set null,
  konsumen_id uuid references public.konsumen(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  payment_proof_url text,
  payment_status_marketplace text not null default 'unpaid',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at_generic()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_marketplace_users_updated_at on public.marketplace_users;
create trigger trg_marketplace_users_updated_at
before update on public.marketplace_users
for each row execute function public.set_updated_at_generic();

drop trigger if exists trg_marketplace_products_updated_at on public.marketplace_products;
create trigger trg_marketplace_products_updated_at
before update on public.marketplace_products
for each row execute function public.set_updated_at_generic();

drop trigger if exists trg_marketplace_designs_updated_at on public.marketplace_designs;
create trigger trg_marketplace_designs_updated_at
before update on public.marketplace_designs
for each row execute function public.set_updated_at_generic();

drop trigger if exists trg_marketplace_orders_updated_at on public.marketplace_orders;
create trigger trg_marketplace_orders_updated_at
before update on public.marketplace_orders
for each row execute function public.set_updated_at_generic();

