/**
 * POST /api/notify
 * Sends a WhatsApp message via CallMeBot.
 *
 * Env vars required (set in Vercel):
 *   CALLMEBOT_PHONE   — recipient number in international format without +  (e.g. 27821234567)
 *   CALLMEBOT_API_KEY — API key from CallMeBot (free, see settings page for setup)
 *
 * Can be called:
 *   { test: true }                  → sends a test message
 *   { name, amount, jobDate, group } → sends an invoice-received alert
 */
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const phone  = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) {
    return res.status(500).json({ error: "CALLMEBOT_PHONE or CALLMEBOT_API_KEY not set in Vercel env vars" });
  }

  const body = req.body ?? {};
  let text: string;

  if (body.test) {
    text = "✅ OnCue Marketing — WhatsApp alerts are working! You will receive a notification each time a staff invoice is submitted.";
  } else {
    const { name = "Unknown", amount = "—", jobDate = "—", group = "—" } = body;
    text = `📋 *New Invoice — OnCue Marketing*\n\n👤 ${name}\n📅 ${jobDate}\n💬 ${group}\n💰 R ${amount}\n\nLog in to review: https://oncuemarketing.co.za/admin`;
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const waRes = await fetch(url);
    if (!waRes.ok) {
      const err = await waRes.text();
      return res.status(502).json({ error: "CallMeBot error", detail: err });
    }
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to reach CallMeBot", detail: err?.message });
  }
}
