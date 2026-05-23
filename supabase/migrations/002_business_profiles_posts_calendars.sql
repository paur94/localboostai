-- Migration 002: Add business_profiles, content_calendars, generated_posts
-- Run after 001 (schema.sql) in your Supabase SQL editor

-- ============================================================
-- BUSINESS PROFILES (one per user)
-- ============================================================
create table if not exists public.business_profiles (
  id                  uuid default gen_random_uuid() primary key,
  user_id             text not null unique references public.users(id) on delete cascade,
  business_name       text not null,
  description         text,
  industry            text,
  website             text,
  phone               text,
  address             text,
  city                text,
  state               text,
  country             text default 'US',
  social_handles      jsonb default '{}',
  logo_url            text,
  tone                text not null default 'professional'
                        check (tone in ('professional','casual','friendly','humorous','urgent')),
  target_audience     text,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

drop trigger if exists business_profiles_updated_at on public.business_profiles;
create trigger business_profiles_updated_at
  before update on public.business_profiles
  for each row execute procedure public.handle_updated_at();

create index if not exists business_profiles_user_id_idx on public.business_profiles(user_id);

-- ============================================================
-- CONTENT CALENDARS (many per business profile)
-- ============================================================
create table if not exists public.content_calendars (
  id                    uuid default gen_random_uuid() primary key,
  business_profile_id   uuid not null references public.business_profiles(id) on delete cascade,
  name                  text not null,
  description           text,
  start_date            date not null,
  end_date              date,
  status                text not null default 'active'
                          check (status in ('active','completed','archived')),
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

drop trigger if exists content_calendars_updated_at on public.content_calendars;
create trigger content_calendars_updated_at
  before update on public.content_calendars
  for each row execute procedure public.handle_updated_at();

create index if not exists content_calendars_business_profile_id_idx on public.content_calendars(business_profile_id);
create index if not exists content_calendars_start_date_idx         on public.content_calendars(start_date);
create index if not exists content_calendars_status_idx             on public.content_calendars(status);

-- ============================================================
-- GENERATED POSTS (many per business profile)
-- ============================================================
create table if not exists public.generated_posts (
  id                    uuid default gen_random_uuid() primary key,
  business_profile_id   uuid not null references public.business_profiles(id) on delete cascade,
  content_calendar_id   uuid references public.content_calendars(id) on delete set null,
  content_type          text not null
                          check (content_type in ('social_post','blog_intro','email','ad_copy','product_description','seo_description')),
  platform              text
                          check (platform in ('instagram','facebook','twitter','linkedin','google','general')),
  prompt                text not null,
  content               text not null,
  status                text not null default 'draft'
                          check (status in ('draft','scheduled','published','archived')),
  scheduled_at          timestamptz,
  published_at          timestamptz,
  tokens_used           integer default 0,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

drop trigger if exists generated_posts_updated_at on public.generated_posts;
create trigger generated_posts_updated_at
  before update on public.generated_posts
  for each row execute procedure public.handle_updated_at();

create index if not exists generated_posts_business_profile_id_idx on public.generated_posts(business_profile_id);
create index if not exists generated_posts_calendar_id_idx         on public.generated_posts(content_calendar_id);
create index if not exists generated_posts_status_idx              on public.generated_posts(status);
create index if not exists generated_posts_scheduled_at_idx        on public.generated_posts(scheduled_at);
create index if not exists generated_posts_created_at_idx          on public.generated_posts(created_at desc);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.business_profiles enable row level security;
alter table public.content_calendars  enable row level security;
alter table public.generated_posts    enable row level security;

-- Business profiles: owner only
create policy "business_profiles_select_own" on public.business_profiles
  for select using (auth.uid()::text = user_id);

create policy "business_profiles_insert_own" on public.business_profiles
  for insert with check (auth.uid()::text = user_id);

create policy "business_profiles_update_own" on public.business_profiles
  for update using (auth.uid()::text = user_id);

create policy "business_profiles_delete_own" on public.business_profiles
  for delete using (auth.uid()::text = user_id);

-- Content calendars: owner via business profile join
create policy "content_calendars_select_own" on public.content_calendars
  for select using (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = content_calendars.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

create policy "content_calendars_insert_own" on public.content_calendars
  for insert with check (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = content_calendars.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

create policy "content_calendars_update_own" on public.content_calendars
  for update using (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = content_calendars.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

create policy "content_calendars_delete_own" on public.content_calendars
  for delete using (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = content_calendars.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

-- Generated posts: owner via business profile join
create policy "generated_posts_select_own" on public.generated_posts
  for select using (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = generated_posts.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

create policy "generated_posts_insert_own" on public.generated_posts
  for insert with check (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = generated_posts.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

create policy "generated_posts_update_own" on public.generated_posts
  for update using (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = generated_posts.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

create policy "generated_posts_delete_own" on public.generated_posts
  for delete using (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = generated_posts.business_profile_id
        and bp.user_id = auth.uid()::text
    )
  );

-- Service role bypasses RLS (server actions / webhooks)
