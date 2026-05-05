-- =============================================
-- COSMIC DESTINY — Supabase Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- 1. Free Predictions table
create table if not exists public.free_predictions (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  name         text not null,
  dob          date not null,
  tob          text,
  place        text not null,
  gender       text not null,
  zodiac_sign  text,
  moon_sign    text,
  nakshatra    text,
  lagna        text,
  dasha        text,
  tagline      text,
  locale       text default 'en',
  user_id      uuid references auth.users(id) on delete set null
);

-- 2. Consultation bookings table
create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  name         text not null,
  email        text,
  phone        text,
  slot_date    date,
  slot_time    text,
  type         text default 'consultation',   -- 'consultation' | 'report'
  amount       integer default 500,
  status       text default 'pending',        -- 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_id   text,
  notes        text,
  user_id      uuid references auth.users(id) on delete set null
);

-- 3. Enable Row-Level Security (RLS) but allow anon inserts
alter table public.free_predictions enable row level security;
alter table public.bookings         enable row level security;

-- Allow anon to INSERT (website visitors)
create policy "anon_insert_predictions" on public.free_predictions
  for insert to anon with check (true);

create policy "anon_insert_bookings" on public.bookings
  for insert to anon with check (true);

-- Allow authenticated users to INSERT (logged-in visitors)
create policy "auth_insert_predictions" on public.free_predictions
  for insert to authenticated with check (true);

create policy "auth_insert_bookings" on public.bookings
  for insert to authenticated with check (true);

-- Allow authenticated (admin) to SELECT all rows
create policy "auth_select_predictions" on public.free_predictions
  for select to authenticated using (true);

create policy "auth_select_bookings" on public.bookings
  for select to authenticated using (true);

create policy "auth_update_bookings" on public.bookings
  for update to authenticated using (true);

-- ── Run these ALTER statements if the tables already exist ──
-- (safe to run on an existing database)
alter table public.free_predictions add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.bookings         add column if not exists user_id uuid references auth.users(id) on delete set null;
