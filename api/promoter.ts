import { createClient } from "@supabase/supabase-js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { fields } = req.body;
  if (!fields) return res.status(400).json({ error: "Missing fields" });

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const images: string[] = fields.images ?? [];

  const record = {
    name:        fields.name        || null,
    age:         fields.age         || null,
    location:    fields.location    || null,
    height:      fields.height      || null,
    dress_size:  fields.dress_size  || null,
    top_size:    fields.top_size    || null,
    pant_size:   fields.pant_size   || null,
    description: fields.description || null,
    phone:       fields.phone       || null,
    image_1_url: images[0]          || null,
    image_2_url: images[1]          || null,
    image_3_url: images[2]          || null,
    image_4_url: images[3]          || null,
    status:      "pending",
  };

  const { error } = await supabase.from("promoter_applications").insert([record]);
  if (error) return res.status(500).json({ error: error.message });

  // Email notification — non-blocking
  try {
    const apiKey    = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const from      = process.env.RESEND_FROM ?? "onboarding@resend.dev";

    if (apiKey && adminEmail) {
      const name     = fields.name ?? "Unknown";
      const location = fields.location ?? "—";
      const age      = fields.age ?? "—";

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

      const html = `
        <div style="font-family:sans-serif;max-width:540px;margin:0 auto;color:#111">
          <div style="background:#c9a84c;padding:24px 32px">
            <h1 style="margin:0;font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#000">
              New Promoter Application
            </h1>
          </div>
          <div style="padding:32px;border:1px solid #eee">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#888;width:130px">Name</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Age</td><td style="padding:8px 0">${age}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Location</td><td style="padding:8px 0">${location}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0">${fields.phone ?? "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Height</td><td style="padding:8px 0">${fields.height ?? "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Dress Size</td><td style="padding:8px 0">${fields.dress_size ?? "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Top Size</td><td style="padding:8px 0">${fields.top_size ?? "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#888">Pant Size</td><td style="padding:8px 0">${fields.pant_size ?? "—"}</td></tr>
            </table>
            <div style="margin-top:16px;padding-top:16px;border-top:1px solid #eee">
              <p style="color:#888;font-size:12px;margin:0 0 8px">About</p>
              <p style="font-size:14px;line-height:1.6;margin:0">${(fields.description ?? "").replace(/\n/g, "<br>")}</p>
            </div>
            <div style="margin-top:24px">
              <a href="${baseUrl}/admin" style="display:inline-block;background:#c9a84c;color:#000;padding:12px 24px;font-weight:900;text-transform:uppercase;letter-spacing:2px;font-size:12px;text-decoration:none">
                View in Dashboard →
              </a>
            </div>
          </div>
        </div>`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: adminEmail,
          subject: `New Promoter Application — ${name} (${location})`,
          html,
        }),
      }).catch(() => {});
    }
  } catch { /* never block the submission */ }

  return res.status(200).json({ success: true });
}
