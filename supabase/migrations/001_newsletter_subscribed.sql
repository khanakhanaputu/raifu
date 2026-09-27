-- Run this in the Supabase SQL Editor against an already-provisioned project
-- to add newsletter subscription support without re-running schema.sql.

alter table public.profiles
  add column if not exists newsletter_subscribed boolean not null default false;
