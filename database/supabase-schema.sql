-- Ejecuta este archivo en el SQL Editor de Supabase antes de conectar producción.
create extension if not exists pgcrypto;

create type public.tcg_kind as enum ('pokemon', 'riftbound', 'yugioh');
create type public.product_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  tcg public.tcg_kind not null,
  name text not null,
  slug text not null unique,
  category text not null,
  description text,
  condition text not null default 'Nuevo / sellado',
  price_mxn numeric(10,2) not null check (price_mxn >= 0),
  stock integer not null default 0 check (stock >= 0),
  status public.product_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  position smallint not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique(product_id, position)
);

create table public.catalog_covers (
  tcg public.tcg_kind primary key,
  storage_path text not null,
  alt_text text,
  updated_at timestamptz not null default now()
);

create index products_catalog_idx on public.products(tcg, status, created_at desc);
create index product_images_product_idx on public.product_images(product_id, position);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.catalog_covers enable row level security;

create function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

create policy "public reads published products" on public.products for select using (status = 'published' or public.is_admin());
create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads product images" on public.product_images for select using (exists(select 1 from public.products where products.id = product_id and (products.status = 'published' or public.is_admin())));
create policy "admins manage product images" on public.product_images for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads catalog covers" on public.catalog_covers for select using (true);
create policy "admins manage catalog covers" on public.catalog_covers for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('catalog-images', 'catalog-images', true)
on conflict (id) do nothing;

create policy "public reads catalog assets" on storage.objects for select using (bucket_id = 'catalog-images');
create policy "admins upload catalog assets" on storage.objects for insert with check (bucket_id = 'catalog-images' and public.is_admin());
create policy "admins update catalog assets" on storage.objects for update using (bucket_id = 'catalog-images' and public.is_admin());
create policy "admins delete catalog assets" on storage.objects for delete using (bucket_id = 'catalog-images' and public.is_admin());
