-- Raifu Supabase schema. Paste this whole file into Supabase SQL Editor and run once.

create extension if not exists pgcrypto;

-- 1. profiles: 1:1 with auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  sex text not null default 'lainnya' check (sex in ('wanita','pria','lainnya')),
  age integer not null default 0,
  weight_kg numeric not null default 0,
  height_cm numeric not null default 0,
  start_weight_kg numeric not null default 0,
  target_weight_kg numeric not null default 0,
  activity text not null default 'ringan' check (activity in ('sedentari','ringan','moderat','aktif')),
  goal text not null default 'jaga' check (goal in ('turun','jaga','naik')),
  joined_label text not null default '',
  xp integer not null default 0,
  onboarded boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- 2. meal_entries
create table public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  meal_type text not null check (meal_type in ('sarapan','siang','malam','camilan')),
  name text not null,
  entry_time text not null,
  kcal numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  fiber numeric not null default 0,
  tags text[] not null default '{}',
  source text not null default 'manual' check (source in ('manual','scan','menu')),
  image text,
  created_at timestamptz not null default now()
);

create index meal_entries_user_date_idx on public.meal_entries (user_id, entry_date);
alter table public.meal_entries enable row level security;
create policy "meal_entries_all_own" on public.meal_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. water_logs
create table public.water_logs (
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  ml integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, log_date)
);
alter table public.water_logs enable row level security;
create policy "water_logs_all_own" on public.water_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. freeze_dates
create table public.freeze_dates (
  user_id uuid not null references auth.users(id) on delete cascade,
  freeze_date date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, freeze_date)
);
alter table public.freeze_dates enable row level security;
create policy "freeze_dates_all_own" on public.freeze_dates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. reminders (label/time/description stay static in app code; only `enabled` is per-user)
create table public.reminders (
  user_id uuid not null references auth.users(id) on delete cascade,
  reminder_id text not null check (reminder_id in ('sarapan','siang','malam','streak','hidrasi')),
  enabled boolean not null default true,
  primary key (user_id, reminder_id)
);
alter table public.reminders enable row level security;
create policy "reminders_all_own" on public.reminders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6. auto-provision profile + reminder rows the instant a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, joined_label)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    'Anggota Sejak ' || to_char(now(), 'Mon YYYY')
  );

  insert into public.reminders (user_id, reminder_id, enabled) values
    (new.id, 'sarapan', true),
    (new.id, 'siang', true),
    (new.id, 'malam', true),
    (new.id, 'streak', true),
    (new.id, 'hidrasi', false);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
