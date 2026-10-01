-- =========================================================================
-- Stella Clothing E-Commerce - Complete Supabase PostgreSQL Schema & Storage
-- Safe, idempotent script. You can run this multiple times in SQL Editor.
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. STORAGE BUCKETS SETUP FOR IMAGES
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

-- Storage Policies
drop policy if exists "Public Access to Avatars" on storage.objects;
create policy "Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

drop policy if exists "Public Upload to Avatars" on storage.objects;
create policy "Public Upload to Avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

drop policy if exists "Public Access to Product Images" on storage.objects;
create policy "Public Access to Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

drop policy if exists "Public Upload to Product Images" on storage.objects;
create policy "Public Upload to Product Images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' );

-- 2. USERS TABLE
create table if not exists public.users (
  id text primary key,
  name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  role text not null default 'customer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. USER ADDRESSES TABLE
create table if not exists public.addresses (
  id text primary key,
  user_id text references public.users(id) on delete cascade,
  full_name text not null,
  phone_number text not null,
  street text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  brand text not null,
  description text,
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  available_sizes text[] not null default '{}',
  available_colors jsonb not null default '[]'::jsonb,
  stock integer not null default 0,
  rating numeric(3, 2) not null default 4.5,
  reviews_count integer not null default 0,
  status text not null default 'in_stock',
  material text,
  fit text,
  image_url text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Performance Indexes
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_price on public.products(price);
create index if not exists idx_products_status on public.products(status);

-- 5. CART ITEMS TABLE
create table if not exists public.cart_items (
  id text primary key,
  user_id text not null,
  product_id text references public.products(id) on delete cascade,
  size text not null,
  color jsonb not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  added_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. WISHLIST ITEMS TABLE
create table if not exists public.wishlist_items (
  id text primary key,
  user_id text not null,
  product_id text references public.products(id) on delete cascade,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, product_id)
);

-- 7. ORDERS TABLE
create table if not exists public.orders (
  id text primary key,
  user_id text not null,
  customer_name text not null,
  customer_email text not null,
  items jsonb not null default '[]'::jsonb,
  shipping_address jsonb not null,
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) not null default 0,
  shipping numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  payment_method text not null,
  payment_status text not null default 'Pending',
  order_status text not null default 'Confirmed',
  estimated_delivery text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(order_status);

-- 8. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text,
  product_name text not null,
  brand text not null,
  category text not null,
  size text not null,
  color jsonb not null,
  quantity integer not null default 1 check (quantity > 0),
  price numeric(10, 2) not null,
  discount_price numeric(10, 2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

-- Row Level Security (RLS) setup
alter table public.products enable row level security;
alter table public.users enable row level security;
alter table public.addresses enable row level security;
alter table public.cart_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Table Access Policies
drop policy if exists "Allow public read access on products" on public.products;
create policy "Allow public read access on products"
  on public.products for select using (true);

drop policy if exists "Allow all actions on products for service role/admin" on public.products;
create policy "Allow all actions on products for service role/admin"
  on public.products for all using (true);

drop policy if exists "Allow read and write on cart_items" on public.cart_items;
create policy "Allow read and write on cart_items"
  on public.cart_items for all using (true);

drop policy if exists "Allow read and write on wishlist_items" on public.wishlist_items;
create policy "Allow read and write on wishlist_items"
  on public.wishlist_items for all using (true);

drop policy if exists "Allow read and write on orders" on public.orders;
create policy "Allow read and write on orders"
  on public.orders for all using (true);

drop policy if exists "Allow read and write on order_items" on public.order_items;
create policy "Allow read and write on order_items"
  on public.order_items for all using (true);

drop policy if exists "Allow read and write on users" on public.users;
create policy "Allow read and write on users"
  on public.users for all using (true);

drop policy if exists "Allow read and write on addresses" on public.addresses;
create policy "Allow read and write on addresses"
  on public.addresses for all using (true);
