import { createClient } from "@supabase/supabase-js";

// VITE_ prefix = safe for frontend (anon key + RLS protects data)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

export type Invoice = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  bank_name: string;
  account_holder: string;
  account_number: string;
  branch_code: string;
  account_type: string;
  whatsapp_group: string;
  job_type: string;
  daily_rate: number | null;
  days_worked: string;
  fixed_rate: number | null;
  setup_rate: number | null;
  day_1_hours: number | null; day_1_rate: number | null;
  day_2_hours: number | null; day_2_rate: number | null;
  day_3_hours: number | null; day_3_rate: number | null;
  day_4_hours: number | null; day_4_rate: number | null;
  day_5_hours: number | null; day_5_rate: number | null;
  day_6_hours: number | null; day_6_rate: number | null;
  day_7_hours: number | null; day_7_rate: number | null;
  stores_worked: string;
  labour_total: number | null;
  bought_items: string;
  purchase_details: string;
  purchase_amount: number | null;
  fuel_contribution: string;
  fuel_amount: number | null;
  pre_pay: string;
  pre_pay_amount: number | null;
  total_owed: number | null;
  agreed_to_terms: boolean;
  submission_date: string;
  paid: boolean;
  paid_at: string | null;
  admin_notes: string | null;
};
