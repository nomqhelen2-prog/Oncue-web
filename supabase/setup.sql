-- Run this in your Supabase project → SQL Editor

create table invoices (
  id              uuid        default gen_random_uuid() primary key,
  created_at      timestamptz default now(),

  -- Personal
  first_name      text not null,
  last_name       text not null,
  email           text not null,
  whatsapp        text,

  -- Banking
  bank_name       text,
  account_holder  text,
  account_number  text,
  branch_code     text,
  account_type    text,

  -- Job
  whatsapp_group  text,
  job_type        text,
  daily_rate      numeric,
  days_worked     text,
  fixed_rate      numeric,
  setup_rate      numeric,

  -- Per-day breakdown (up to 7 days)
  day_1_hours numeric, day_1_rate numeric,
  day_2_hours numeric, day_2_rate numeric,
  day_3_hours numeric, day_3_rate numeric,
  day_4_hours numeric, day_4_rate numeric,
  day_5_hours numeric, day_5_rate numeric,
  day_6_hours numeric, day_6_rate numeric,
  day_7_hours numeric, day_7_rate numeric,

  -- Totals & extras
  stores_worked     text,
  labour_total      numeric,
  bought_items      text,
  purchase_details  text,
  purchase_amount   numeric,
  fuel_contribution text,
  fuel_amount       numeric,
  pre_pay           text,
  pre_pay_amount    numeric,
  total_owed        numeric,

  -- Meta
  agreed_to_terms boolean default false,
  submission_date date,

  -- Admin fields
  paid        boolean     default false,
  paid_at     timestamptz,
  admin_notes text
);

-- Enable Row Level Security
alter table invoices enable row level security;

-- Staff can submit (no login needed)
create policy "Public insert" on invoices
  for insert to anon with check (true);

-- Only logged-in admin can read
create policy "Admin read" on invoices
  for select to authenticated using (true);

-- Only logged-in admin can mark as paid / add notes
create policy "Admin update" on invoices
  for update to authenticated using (true);
