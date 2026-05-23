-- LocalBoost AI — Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
create table if not exists public.users (
  id                    text primary key,          -- Clerk user ID
  email                 text not null unique,
  name                  text,
  image_url             text,
  subscription_tier     text not null default 'free' check (subscription_tier in ('free', 'pro', 'business')),
  lemon_squeezy_customer_id    text unique,
  lemon_squeezy_subscription_id text unique,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- CONTENT GENERATIONS
-- ============================================================
create table if not exists public.content_generations (
  id              uuid default gen_random_uuid() primary key,
  user_id         text not null references public.users(id) on delete cascade,
  content_type    text not null check (content_type in ('social_post','blog_intro','email','ad_copy','product_description','seo_description')),
  platform        text check (platform in ('instagram','facebook','twitter','linkedin','google','general')),
  business_name   text not null,
  prompt          text not null,
  result          text not null,
  tokens_used     integer default 0,
  created_at      timestamptz default now()
);

create index if not exists content_generations_user_id_idx on public.content_generations(user_id);
create index if not exists content_generations_created_at_idx on public.content_generations(created_at desc);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table if not exists public.subscriptions (
  id                    text primary key,           -- LemonSqueezy subscription ID
  user_id               text not null references public.users(id) on delete cascade,
  status                text not null check (status in ('active','canceled','past_due','trialing','incomplete')),
  price_id              text not null,
  current_period_start  timestamptz,
  current_period_end    timestamptz,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users enable row level security;
alter table public.content_generations enable row level security;
alter table public.subscriptions enable row level security;

-- Users: read own row
create policy "users_select_own" on public.users
  for select using (auth.uid()::text = id);

-- Content: full access to own rows
create policy "content_select_own" on public.content_generations
  for select using (auth.uid()::text = user_id);

create policy "content_insert_own" on public.content_generations
  for insert with check (auth.uid()::text = user_id);

create policy "content_delete_own" on public.content_generations
  for delete using (auth.uid()::text = user_id);

-- Subscriptions: read own
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid()::text = user_id);

-- Service role bypasses RLS (used in server actions / webhooks)
