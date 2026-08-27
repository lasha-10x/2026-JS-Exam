-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query)

create table if not exists users (
  id bigint generated always as identity primary key,
  full_name text not null,
  email text not null unique,
  -- [HASHING DISABLED] Uncomment line below and remove the plain-text line to re-enable:
  -- password_hash text not null,
  password text not null,
  company text,
  created_at timestamptz not null default now()
);

alter table users enable row level security;

-- This project calls Supabase directly from the browser with the public
-- anon key (there's no separate backend server). These policies open up
-- exactly the operations the app needs: signup (insert), login/profile
-- lookups (select), and profile/password edits (update).
create policy "Allow public insert" on users
  for insert to anon
  with check (true);

create policy "Allow public select" on users
  for select to anon
  using (true);

create policy "Allow public update" on users
  for update to anon
  using (true);
