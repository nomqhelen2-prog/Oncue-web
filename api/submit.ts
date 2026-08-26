import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { fields } = req.body;
  if (!fields) return res.status(400).json({ error: "Missing fields" });

  // Service key — bypasses RLS, server-side only
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Map form field names → snake_case DB columns
  const record = {
    first_name:       fields["First Name"],
    last_name:        fields["Last Name"],
    email:            fields["Email"],
    whatsapp:         fields["WhatsApp Number"],
    bank_name:        fields["Bank Name"],
    account_holder:   fields["Account Holder"],
    account_number:   fields["Account Number"],
    branch_code:      fields["Branch Code"],
    account_type:     fields["Account Type"],
    whatsapp_group:   fields["WhatsApp Group"],
    job_type:         fields["Job Type"],
    daily_rate:       toNum(fields["Daily Rate (ZAR)"]),
    days_worked:      fields["Days Worked"],
    fixed_rate:       toNum(fields["Fixed Rate (ZAR)"]),
    setup_rate:       toNum(fields["Setup Rate (ZAR)"]),
    day_1_hours: toNum(fields["Day 1 Hours"]), day_1_rate: toNum(fields["Day 1 Rate (ZAR)"]),
    day_2_hours: toNum(fields["Day 2 Hours"]), day_2_rate: toNum(fields["Day 2 Rate (ZAR)"]),
    day_3_hours: toNum(fields["Day 3 Hours"]), day_3_rate: toNum(fields["Day 3 Rate (ZAR)"]),
    day_4_hours: toNum(fields["Day 4 Hours"]), day_4_rate: toNum(fields["Day 4 Rate (ZAR)"]),
    day_5_hours: toNum(fields["Day 5 Hours"]), day_5_rate: toNum(fields["Day 5 Rate (ZAR)"]),
    day_6_hours: toNum(fields["Day 6 Hours"]), day_6_rate: toNum(fields["Day 6 Rate (ZAR)"]),
    day_7_hours: toNum(fields["Day 7 Hours"]), day_7_rate: toNum(fields["Day 7 Rate (ZAR)"]),
    stores_worked:    fields["Stores Worked"],
    labour_total:     toNum(fields["Labour Total (ZAR)"]),
    bought_items:     fields["Bought Items"],
    purchase_details: fields["Purchase Details"],
    purchase_amount:  toNum(fields["Purchase Amount (ZAR)"]),
    fuel_contribution:fields["Fuel Contribution"],
    fuel_amount:      toNum(fields["Fuel Amount (ZAR)"]),
    pre_pay:          fields["Pre-Pay Received"],
    pre_pay_amount:   toNum(fields["Pre-Pay Amount (ZAR)"]),
    total_owed:       toNum(fields["Total Owed (ZAR)"]),
    agreed_to_terms:  !!fields["Agreed to T&Cs"],
    submission_date:  fields["Submission Date"] || new Date().toISOString().split("T")[0],
  };

  const { error } = await supabase.from("invoices").insert([record]);

  if (error) return res.status(500).json({ error: error.message });

  // Fire WhatsApp alert if enabled — non-blocking, failure doesn't affect submission
  try {
    const { data: settings } = await supabase
      .from("admin_settings").select("whatsapp_enabled").eq("id", 1).single();

    if (settings?.whatsapp_enabled && process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_API_KEY) {
      const name   = `${fields["First Name"] ?? ""} ${fields["Last Name"] ?? ""}`.trim();
      const amount = fields["Total Owed (ZAR)"] ?? "—";
      const group  = fields["WhatsApp Group"] ?? "—";
      const jobDate = fields["Job Date"] ?? fields["Submission Date"] ?? "—";

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

      fetch(`${baseUrl}/api/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount, jobDate, group }),
      }).catch(() => { /* silent fail */ });
    }
  } catch { /* silent fail — never block the invoice submission */ }

  return res.status(200).json({ success: true });
}

function toNum(val: unknown): number | null {
  const n = parseFloat(String(val));
  return isNaN(n) ? null : n;
}
