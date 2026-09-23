/**
 * POST /api/notify
 * Sends an email via Resend when a staff invoice is submitted.
 *
 * Env vars required (set in Vercel):
 *   RESEND_API_KEY  — API key from resend.com (free tier works)
 *   ADMIN_EMAIL     — email address to receive notifications (e.g. hello@oncuemarketing.co.za)
 *   RESEND_FROM     — optional sender address (default: onboarding@resend.dev)
 *                     Set this once you verify oncuemarketing.co.za in Resend.
 *
 * Payloads:
 *   { test: true }                        → sends a test email
 *   { name, amount, jobDate, group }       → sends an invoice-received alert
 */
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey     = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const from       = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!apiKey)     return res.status(500).json({ error: "RESEND_API_KEY not set in Vercel env vars" });
  if (!adminEmail) return res.status(500).json({ error: "ADMIN_EMAIL not set in Vercel env vars" });

  const body = req.body ?? {};

  let subject: string;
  let html: string;

  if (body.test) {
    subject = "✅ OnCue Marketing — Email notifications are working!";
    html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#000;color:#fff;padding:32px;border-radius:8px;">
        <h2 style="color:#c9a84c;margin-top:0;">OnCue Marketing</h2>
        <p style="font-size:16px;">Email notifications are set up correctly. You'll receive an alert like this every time a staff invoice is submitted.</p>
        <p style="color:#999;font-size:13px;margin-top:32px;">OnCue Marketing · oncuemarketing.co.za</p>
      </div>
    `;
  } else {
    const { name = "Unknown", amount = "—", jobDate = "—", group = "—" } = body;
    subject = `📋 New Invoice Submitted — ${name}`;
    html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#000;color:#fff;padding:32px;border-radius:8px;">
        <h2 style="color:#c9a84c;margin-top:0;">New Invoice — OnCue Marketing</h2>
        <table style="width:100%;border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#999;width:140px;">Staff Member</td><td style="padding:10px 0;border-bottom:1px solid #222;font-weight:600;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#999;">Job Date</td><td style="padding:10px 0;border-bottom:1px solid #222;">${jobDate}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#999;">WhatsApp Group</td><td style="padding:10px 0;border-bottom:1px solid #222;">${group}</td></tr>
          <tr><td style="padding:10px 0;color:#999;">Total Owed</td><td style="padding:10px 0;color:#c9a84c;font-weight:700;font-size:18px;">R ${amount}</td></tr>
        </table>
        <a href="https://oncuemarketing.co.za/admin" style="display:inline-block;margin-top:24px;background:#c9a84c;color:#000;padding:12px 24px;text-decoration:none;font-weight:700;border-radius:4px;font-size:14px;letter-spacing:1px;">VIEW IN DASHBOARD →</a>
        <p style="color:#555;font-size:12px;margin-top:32px;">OnCue Marketing · oncuemarketing.co.za</p>
      </div>
    `;
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: adminEmail, subject, html }),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(502).json({ error: "Resend error", detail: err });
    }
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to reach Resend", detail: err?.message });
  }
}
