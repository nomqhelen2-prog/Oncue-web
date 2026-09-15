import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, type Invoice, type PromoterApplication } from "../lib/supabase";
import {
  LogOut, CheckCircle, Clock, Search, ChevronDown, ChevronUp, X, FileText, Menu, Trash2, Download, Settings, Users,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number | null) {
  if (n == null) return "—";
  return `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}
function getWeek(d: string) {
  const date = new Date(d);
  const jan1 = new Date(date.getFullYear(), 0, 1);
  return Math.ceil(((date.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7);
}
function currentWeek() {
  return getWeek(new Date().toISOString().split("T")[0]);
}

// ── Detail drawer ─────────────────────────────────────────────────────────────
function DetailDrawer({ inv, onClose, onTogglePaid, onDelete, onUpdate }: {
  inv: Invoice; onClose: () => void; onTogglePaid: (id: string, paid: boolean) => void;
  onDelete: (id: string) => void; onUpdate: (id: string, patch: Partial<Invoice>) => void;
}) {
  const [notes, setNotes]       = useState(inv.admin_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [edit, setEdit]         = useState({
    whatsapp:        inv.whatsapp        ?? "",
    bank_name:       inv.bank_name       ?? "",
    account_holder:  inv.account_holder  ?? "",
    account_number:  inv.account_number  ?? "",
    branch_code:     inv.branch_code     ?? "",
    account_type:    inv.account_type    ?? "",
    whatsapp_group:  inv.whatsapp_group  ?? "",
    job_type:        inv.job_type        ?? "",
    days_worked:     inv.days_worked     ?? "",
    daily_rate:      inv.daily_rate      != null ? String(inv.daily_rate)      : "",
    fixed_rate:      inv.fixed_rate      != null ? String(inv.fixed_rate)      : "",
    setup_rate:      inv.setup_rate      != null ? String(inv.setup_rate)      : "",
    stores_worked:   inv.stores_worked   ?? "",
    purchase_amount: inv.purchase_amount != null ? String(inv.purchase_amount) : "",
    fuel_amount:     inv.fuel_amount     != null ? String(inv.fuel_amount)     : "",
    pre_pay_amount:  inv.pre_pay_amount  != null ? String(inv.pre_pay_amount)  : "",
    total_owed:      inv.total_owed      != null ? String(inv.total_owed)      : "",
  });

  function upd(k: keyof typeof edit, v: string) { setEdit(e => ({ ...e, [k]: v })); }

  async function saveNotes() {
    setSavingNotes(true);
    await supabase.from("invoices").update({ admin_notes: notes }).eq("id", inv.id);
    setSavingNotes(false);
  }

  async function saveEdits() {
    setSaving(true);
    const patch: Partial<Invoice> = {
      whatsapp:        edit.whatsapp       || null,
      bank_name:       edit.bank_name      || null,
      account_holder:  edit.account_holder || null,
      account_number:  edit.account_number || null,
      branch_code:     edit.branch_code    || null,
      account_type:    edit.account_type   || null,
      whatsapp_group:  edit.whatsapp_group || null,
      job_type:        edit.job_type       || null,
      days_worked:     edit.days_worked    || null,
      daily_rate:      edit.daily_rate     ? parseFloat(edit.daily_rate)      : null,
      fixed_rate:      edit.fixed_rate     ? parseFloat(edit.fixed_rate)      : null,
      setup_rate:      edit.setup_rate     ? parseFloat(edit.setup_rate)      : null,
      stores_worked:   edit.stores_worked  || null,
      purchase_amount: edit.purchase_amount ? parseFloat(edit.purchase_amount) : null,
      fuel_amount:     edit.fuel_amount    ? parseFloat(edit.fuel_amount)     : null,
      pre_pay_amount:  edit.pre_pay_amount ? parseFloat(edit.pre_pay_amount)  : null,
      total_owed:      edit.total_owed     ? parseFloat(edit.total_owed)      : null,
    } as any;
    await supabase.from("invoices").update(patch).eq("id", inv.id);
    onUpdate(inv.id, patch);
    setSaving(false);
    setEditing(false);
  }

  const inCls = "w-full bg-white/5 border-b border-white/20 px-1 py-1.5 text-white text-sm focus:outline-none focus:border-[var(--color-gold)] transition";

  const rows = ([
    ["Email", inv.email],
    ["WhatsApp", inv.whatsapp],
    ["Bank", inv.bank_name],
    ["Account Holder", inv.account_holder],
    ["Account Number", inv.account_number],
    ["Branch Code", inv.branch_code],
    ["Account Type", inv.account_type],
    ["WhatsApp Group", inv.whatsapp_group],
    ["Job Type", inv.job_type],
    ["Days Worked", inv.days_worked],
    inv.daily_rate   ? ["Daily Rate", fmt(inv.daily_rate)]   : ["", ""],
    inv.fixed_rate   ? ["Fixed Rate", fmt(inv.fixed_rate)]   : ["", ""],
    inv.setup_rate   ? ["Setup Rate", fmt(inv.setup_rate)]   : ["", ""],
    ["Venues Worked", inv.stores_worked],
    ["Labour Total", fmt(inv.labour_total)],
    ["Bought Items", inv.bought_items],
    inv.bought_items === "yes" ? ["Purchase Details", inv.purchase_details] : ["", ""],
    inv.bought_items === "yes" ? ["Purchase Amount", fmt(inv.purchase_amount)] : ["", ""],
    ["Fuel Contribution", inv.fuel_contribution],
    inv.fuel_contribution === "yes" ? ["Fuel Amount", fmt(inv.fuel_amount)] : ["", ""],
    ["Pre-Pay Received", inv.pre_pay],
    inv.pre_pay === "yes" ? ["Pre-Pay Amount", fmt(inv.pre_pay_amount)] : ["", ""],
    ["Total Owed", fmt(inv.total_owed)],
    ["Submission Date", fmtDate(inv.submission_date || inv.created_at)],
    ["Agreed to T&Cs", inv.agreed_to_terms ? "Yes" : "No"],
  ] as [string, string][]).filter(([k]) => k);

  const dayRows: [string, string][] = [];
  for (let i = 1; i <= 7; i++) {
    const h = inv[`day_${i}_hours` as keyof Invoice] as number | null;
    const r = inv[`day_${i}_rate` as keyof Invoice] as number | null;
    const d = inv[`day_${i}_date` as keyof Invoice] as string | null;
    if (h != null) {
      const dateLabel = d ? ` (${d})` : "";
      dayRows.push([`Day ${i}${dateLabel}`, `${h} hrs @ ${fmt(r)}/hr`]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f0f0f] w-full max-w-md h-full overflow-y-auto border-l border-white/10 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              {inv.first_name} {inv.last_name}
            </h2>
            <p className="text-white/50 text-xs mt-1">{fmtDate(inv.submission_date)}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition p-1">
            <X size={18} />
          </button>
        </div>

        <button
          onClick={() => onTogglePaid(inv.id, !inv.paid)}
          className={`w-full py-3 font-black uppercase tracking-widest text-sm transition rounded-sm ${
            inv.paid
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-[var(--color-gold)] text-black hover:brightness-110"
          }`}
        >
          {inv.paid ? "✓ Paid — Mark as Unpaid" : "Mark as Paid"}
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setEditing(e => !e)}
            className="flex-1 py-2.5 font-bold uppercase tracking-widest text-xs transition rounded-sm border border-white/20 text-white/70 hover:border-white/50 hover:text-white"
          >
            {editing ? "Cancel Edit" : "✏ Edit Invoice"}
          </button>
          <button
            onClick={() => { onClose(); onDelete(inv.id); }}
            className="flex-1 py-2.5 font-bold uppercase tracking-widest text-xs transition rounded-sm border border-red-900/40 text-red-400 hover:bg-red-950/40 flex items-center justify-center gap-2"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>

        {/* ── Edit form ── */}
        {editing ? (
          <div className="flex flex-col gap-4">
            {([
              ["WhatsApp",        "whatsapp"],
              ["Bank",            "bank_name"],
              ["Account Holder",  "account_holder"],
              ["Account Number",  "account_number"],
              ["Branch Code",     "branch_code"],
              ["Account Type",    "account_type"],
              ["WhatsApp Group",  "whatsapp_group"],
              ["Job Type",        "job_type"],
              ["Days Worked",     "days_worked"],
              ["Daily Rate (R)",  "daily_rate"],
              ["Fixed Rate (R)",  "fixed_rate"],
              ["Setup Rate (R)",  "setup_rate"],
              ["Venue",           "stores_worked"],
              ["Purchase Amt (R)","purchase_amount"],
              ["Fuel Amt (R)",    "fuel_amount"],
              ["Pre-Pay Amt (R)", "pre_pay_amount"],
              ["Total Owed (R)",  "total_owed"],
            ] as [string, keyof typeof edit][]).map(([label, key]) => (
              <div key={key}>
                <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1">{label}</label>
                <input
                  className={inCls}
                  value={edit[key]}
                  onChange={e => upd(key, e.target.value)}
                />
              </div>
            ))}
            <button
              onClick={saveEdits}
              disabled={saving}
              className="w-full py-3 bg-[var(--color-gold)] text-black font-black uppercase tracking-widest text-sm hover:brightness-110 transition disabled:opacity-50 mt-2"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-white/5">
              {[...rows, ...dayRows].map(([k, v], idx) => v ? (
                <div key={k} className={`flex justify-between gap-4 py-2.5 ${idx % 2 === 0 ? "" : "bg-white/[0.02] -mx-2 px-2"}`}>
                  <span className="text-[11px] uppercase tracking-widest text-white/50 flex-shrink-0">{k}</span>
                  <span className="text-sm text-white text-right font-medium">{v}</span>
                </div>
              ) : null)}
            </div>

            <div className="border border-[var(--color-gold)]/40 rounded-sm px-4 py-3 flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-widest text-[var(--color-gold)] font-bold">Total Owed</span>
              <span className="font-black text-white text-lg">{fmt(inv.total_owed)}</span>
            </div>
          </>
        )}

        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-white/60 mb-2 font-bold">Admin Notes</label>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Add internal notes..."
            className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-white text-sm focus:outline-none focus:border-white/30 resize-none placeholder:text-white/30"
          />
          <button
            onClick={saveNotes} disabled={savingNotes}
            className="mt-2 text-xs uppercase tracking-widest text-[var(--color-gold)] hover:text-white transition disabled:opacity-40 font-bold"
          >
            {savingNotes ? "Saving…" : "Save Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Promoter drawer ───────────────────────────────────────────────────────────
function PromoterDrawer({ promo, onClose, onStatusChange, onDelete }: {
  promo: PromoterApplication;
  onClose: () => void;
  onStatusChange: (id: string, status: PromoterApplication["status"]) => void;
  onDelete: (id: string) => void;
}) {
  const [notes, setNotes]         = useState(promo.admin_notes ?? "");
  const [savingNotes, setSaving]  = useState(false);
  const images = [promo.image_1_url, promo.image_2_url, promo.image_3_url, promo.image_4_url].filter(Boolean) as string[];

  async function saveNotes() {
    setSaving(true);
    await supabase.from("promoter_applications").update({ admin_notes: notes }).eq("id", promo.id);
    setSaving(false);
  }

  // WhatsApp link — opens WhatsApp WEB (browser) so it uses the OnCue Marketing
  // account logged in there, not the personal phone app.
  const waNumber = (promo.phone ?? "").replace(/\D/g, "");
  const waText   = encodeURIComponent(
    `Hi ${promo.name ?? "there"}! 🎉 Your OnCue Marketing promoter application has been approved. We'd love to have you on the team — please reply so we can discuss next steps.`
  );
  const waHref = `https://web.whatsapp.com/send?phone=${waNumber}&text=${waText}`;

  // Email — build the mailto string and open via window.open() for reliability
  const emailSubject = "Your OnCue Marketing Application — Approved!";
  const emailBody    =
    `Hi ${promo.name ?? "there"},\n\nCongratulations! We are pleased to let you know that your application to join the OnCue Marketing promoter team has been approved.\n\nWe will be in touch with more details about upcoming activations.\n\nWarm regards,\nOnCue Marketing Team`;
  const emailHref = `mailto:${promo.email ?? ""}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const [emailCopied, setEmailCopied] = useState(false);
  function copyEmail() {
    if (!promo.email) return;
    navigator.clipboard.writeText(promo.email).then(() => {
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    });
  }
  function openEmail() {
    // window.open forces the browser to try the mailto handler
    window.open(emailHref, "_self");
  }

  const details: [string, string][] = [
    ["Age",        promo.age        ?? "—"],
    ["Location",   promo.location   ?? "—"],
    ["Height",     promo.height     ?? "—"],
    ["Dress Size", promo.dress_size ?? "—"],
    ["Top Size",   promo.top_size   ?? "—"],
    ["Pant Size",  promo.pant_size  ?? "—"],
    ["Applied",    new Date(promo.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })],
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f0f0f] w-full max-w-md h-full overflow-y-auto border-l border-white/10 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">{promo.name}</h2>
            <p className="text-white/50 text-xs mt-1">{promo.location} · Age {promo.age}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition p-1"><X size={18} /></button>
        </div>

        {/* Contact details — WhatsApp & Email clearly separated */}
        <div className="bg-white/5 border border-white/10 divide-y divide-white/5">
          {promo.phone ? (
            <a
              href={`https://web.whatsapp.com/send?phone=${waNumber}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 group hover:bg-white/5 transition"
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">WhatsApp / Call</p>
                <p className="text-sm text-white font-semibold">{promo.phone}</p>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-green-400 group-hover:text-green-300 font-bold">Message ↗</span>
            </a>
          ) : (
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">WhatsApp / Call</p>
              <p className="text-sm text-white/30 italic">No number on file</p>
            </div>
          )}
          {promo.email ? (
            <div className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Email</p>
                <p className="text-sm text-white font-semibold break-all">{promo.email}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={openEmail}
                  className="text-[10px] uppercase tracking-widest text-[var(--color-gold)] hover:text-white font-bold transition whitespace-nowrap"
                >
                  Open ↗
                </button>
                <button
                  onClick={copyEmail}
                  className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white font-bold transition whitespace-nowrap"
                >
                  {emailCopied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-0.5">Email</p>
              <p className="text-sm text-white/30 italic">No email on file</p>
            </div>
          )}
        </div>

        {/* Status buttons */}
        <div className="flex gap-2">
          {(["pending", "approved", "rejected"] as const).map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(promo.id, s)}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-widest transition border ${
                promo.status === s
                  ? s === "approved" ? "bg-green-600 border-green-600 text-white"
                    : s === "rejected" ? "bg-red-700 border-red-700 text-white"
                    : "bg-amber-500 border-amber-500 text-black"
                  : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Quick-contact buttons — only show when approved */}
        {promo.status === "approved" && (
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
              Send approval message to {promo.name}
            </p>
            <div className="flex gap-2">
              {promo.phone ? (
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold text-center">WhatsApp</p>
                  <div className="flex gap-1">
                    <a
                      href={`https://wa.me/${waNumber}?text=${waText}`}
                      target="_blank" rel="noopener noreferrer"
                      title="Opens your phone's WhatsApp app"
                      className="flex-1 flex flex-col items-center justify-center py-2.5 bg-[#25D366] text-black font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition"
                    >
                      <span>📱 App</span>
                      <span className="text-[8px] font-normal mt-0.5 opacity-60 normal-case">Phone</span>
                    </a>
                    <a
                      href={waHref}
                      target="_blank" rel="noopener noreferrer"
                      title="Opens WhatsApp Web in the browser"
                      className="flex-1 flex flex-col items-center justify-center py-2.5 bg-[#128C7E] text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition"
                    >
                      <span>💻 Web</span>
                      <span className="text-[8px] font-normal mt-0.5 opacity-60 normal-case">Browser</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-3 bg-white/10 text-white/30 text-xs uppercase tracking-widest">
                  No number
                </div>
              )}
              {promo.email ? (
                <button
                  onClick={openEmail}
                  className="flex-1 flex flex-col items-center justify-center py-3 bg-[var(--color-gold)] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition"
                >
                  <span>✉ Email</span>
                  <span className="text-[9px] font-normal mt-0.5 opacity-70 normal-case tracking-normal max-w-full truncate px-1">{promo.email}</span>
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-center py-3 bg-white/10 text-white/30 text-xs uppercase tracking-widest">
                  No email
                </div>
              )}
            </div>
            <p className="text-[10px] text-white/30 leading-relaxed">
              Opens WhatsApp / your mail app with a pre-written message — you can edit before sending.
            </p>
          </div>
        )}

        {/* Photos */}
        {images.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-3 font-bold">Photos</p>
            <div className="grid grid-cols-2 gap-2">
              {images.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                  <img src={url} alt={`Photo ${i + 1}`} className="w-full aspect-square object-cover hover:opacity-80 transition" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="divide-y divide-white/5">
          {details.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5">
              <span className="text-[11px] uppercase tracking-widest text-white/50 flex-shrink-0">{k}</span>
              <span className="text-sm text-white text-right font-medium">{v}</span>
            </div>
          ))}
        </div>

        {/* About */}
        {promo.description && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-2 font-bold">About</p>
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{promo.description}</p>
          </div>
        )}

        {/* Admin notes */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-white/60 mb-2 font-bold">Admin Notes</label>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Add internal notes…"
            className="w-full bg-white/5 border border-white/10 p-3 text-white text-sm focus:outline-none focus:border-white/30 resize-none placeholder:text-white/30"
          />
          <button
            onClick={saveNotes} disabled={savingNotes}
            className="mt-2 text-xs uppercase tracking-widest text-[var(--color-gold)] hover:text-white transition disabled:opacity-40 font-bold"
          >
            {savingNotes ? "Saving…" : "Save Notes"}
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={() => { onClose(); onDelete(promo.id); }}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-xs uppercase tracking-widest transition py-1 font-bold"
        >
          <Trash2 size={13} /> Delete Application
        </button>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: string;
}) {
  return (
    <div className="bg-white rounded-none p-5 flex flex-col gap-2 shadow-sm border border-gray-100">
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">{label}</p>
      <p className={`text-3xl font-black ${accent ?? "text-gray-800"}`}>{value}</p>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

type NavItem = { id: string; label: string; icon: React.ReactNode };

const NAV: NavItem[] = [
  { id: "submissions", label: "Submissions",  icon: <FileText size={17} /> },
  { id: "promoters",   label: "Promoters",    icon: <Users    size={17} /> },
];

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(invoices: Invoice[], label: string) {
  const headers = [
    "Name","Email","WhatsApp","Job Date","WhatsApp Group","Job Type",
    "Daily Rate","Days Worked","Fixed Rate","Setup Rate",
    "Labour Total","Purchase Amount","Fuel Amount","Pre-Pay Amount",
    "Total Owed","Bank","Account Holder","Account Number","Branch Code","Account Type",
    "Status","Submission Date",
  ];

  // Force text for fields Excel would misformat (phone numbers, long IDs)
  const asText = (v: unknown) => `="${String(v ?? "").replace(/"/g, '""')}"`;

  const rows = invoices.map(inv => [
    `${inv.first_name ?? ""} ${inv.last_name ?? ""}`.trim(),
    inv.email ?? "",
    asText(inv.whatsapp ?? ""),
    inv.submission_date ?? inv.created_at?.split("T")[0] ?? "",
    inv.whatsapp_group ?? "",
    inv.job_type ?? "",
    inv.daily_rate ?? "",
    inv.days_worked ?? "",
    inv.fixed_rate ?? "",
    inv.setup_rate ?? "",
    inv.labour_total ?? "",
    inv.purchase_amount ?? "",
    inv.fuel_amount ?? "",
    inv.pre_pay_amount ?? "",
    inv.total_owed ?? "",
    inv.bank_name ?? "",
    inv.account_holder ?? "",
    asText(inv.account_number ?? ""),
    asText(inv.branch_code ?? ""),
    inv.account_type ?? "",
    inv.paid ? "Paid" : "Unpaid",
    inv.created_at?.split("T")[0] ?? "",
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const BOM  = "﻿"; // UTF-8 BOM — makes Excel open with correct encoding
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `oncue-invoices-${label}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices]         = useState<Invoice[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [weekFilter, setWeekFilter]     = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">("unpaid");
  const [selected, setSelected]         = useState<Invoice | null>(null);
  const [sortDesc, setSortDesc]         = useState(true);
  const [adminEmail, setAdminEmail]     = useState("");
  const [adminName, setAdminName]       = useState("");
  const [activeNav, setActiveNav]       = useState("submissions");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [monthFilter, setMonthFilter]   = useState<string>("all"); // "all" or "YYYY-MM"

  // Promoters
  const [promoters, setPromoters]           = useState<PromoterApplication[]>([]);
  const [promoLoading, setPromoLoading]     = useState(false);
  const [selectedPromo, setSelectedPromo]   = useState<PromoterApplication | null>(null);
  const [promoSearch, setPromoSearch]       = useState("");

  // Auth guard + get admin name
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate("/admin/login");
      } else {
        const email = data.session.user.email ?? "";
        setAdminEmail(email);
        const name = email.split("@")[0];
        setAdminName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    });
  }, []);

  useEffect(() => {
    if (activeNav === "promoters" && promoters.length === 0) fetchPromoters();
  }, [activeNav]);

  async function fetchPromoters() {
    setPromoLoading(true);
    const { data } = await supabase
      .from("promoter_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setPromoters(data ?? []);
    setPromoLoading(false);
  }

  async function updatePromoStatus(id: string, status: PromoterApplication["status"]) {
    await supabase.from("promoter_applications").update({ status }).eq("id", id);
    setPromoters(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    setSelectedPromo(prev => prev?.id === id ? { ...prev, status } : prev);
  }

  async function deletePromo(id: string) {
    if (!confirm("Delete this application? This cannot be undone.")) return;
    await supabase.from("promoter_applications").delete().eq("id", id);
    setPromoters(prev => prev.filter(p => p.id !== id));
    if (selectedPromo?.id === id) setSelectedPromo(null);
  }

  useEffect(() => {
    fetchInvoices();
    const channel = supabase
      .channel("invoices")
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, fetchInvoices)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchInvoices() {
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    setInvoices(data ?? []);
    setLoading(false);
  }

  async function togglePaid(id: string, paid: boolean) {
    await supabase.from("invoices").update({
      paid,
      paid_at: paid ? new Date().toISOString() : null,
    }).eq("id", id);
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, paid, paid_at: paid ? new Date().toISOString() : null } : inv));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, paid } : null);
  }

  async function deleteInvoice(id: string) {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    await supabase.from("invoices").delete().eq("id", id);
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  const filtered = invoices
    .filter(inv => {
      const week = getWeek(inv.submission_date || inv.created_at);
      if (weekFilter !== "all" && week !== weekFilter) return false;
      if (monthFilter !== "all") {
        const m = (inv.submission_date || inv.created_at || "").slice(0, 7);
        if (m !== monthFilter) return false;
      }
      if (statusFilter === "paid" && inv.paid !== true) return false;
      if (statusFilter === "unpaid" && inv.paid === true) return false;
      if (search) {
        const q = search.toLowerCase();
        const name = `${inv.first_name} ${inv.last_name}`.toLowerCase();
        if (!name.includes(q) && !inv.whatsapp_group?.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const da = new Date(a.submission_date || a.created_at).getTime();
      const db = new Date(b.submission_date || b.created_at).getTime();
      return sortDesc ? db - da : da - db;
    });

  const weeks  = Array.from(new Set(invoices.map(i => getWeek(i.submission_date || i.created_at)))).sort((a, b) => b - a);
  const months = Array.from(new Set(invoices.map(i => (i.submission_date || i.created_at || "").slice(0, 7)))).filter(Boolean).sort().reverse();

  // Stat cards always reflect ALL invoices (global overview)
  const pendingCount  = invoices.filter(i => !i.paid).length;
  const paidCount     = invoices.filter(i => i.paid).length;
  const totalPaidAmt  = invoices.filter(i => i.paid).reduce((s, i) => s + (i.total_owed ?? 0), 0);
  const totalOwedAmt  = invoices.filter(i => !i.paid).reduce((s, i) => s + (i.total_owed ?? 0), 0);

  // Table footer totals follow the current filter
  const filteredTotal = filtered.reduce((s, i) => s + (i.total_owed ?? 0), 0);

  // Sidebar inner content — shared between desktop and mobile drawer
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--color-gold)] flex items-center justify-center rounded-sm flex-shrink-0">
            <img src="/logoonly.png" alt="" className="w-5 h-5 object-contain brightness-0" />
          </div>
          <span style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
            className="text-sm tracking-widest text-white font-bold leading-tight">
            OnCue <span className="font-black">MARKETING</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white transition">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-none text-sm font-semibold tracking-wide transition text-left ${
              activeNav === item.id
                ? "bg-[var(--color-gold)] text-black"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Settings link */}
      <div className="px-3 pb-2">
        <Link
          to="/admin/settings"
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wide text-white/60 hover:text-white hover:bg-white/5 transition"
        >
          <Settings size={17} /> Settings
        </Link>
      </div>

      {/* User + sign out */}
      <div className="border-t border-white/10 px-4 py-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] text-sm font-black flex-shrink-0">
            {adminName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{adminName}</p>
            <p className="text-white/40 text-xs truncate">{adminEmail}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 text-white/50 hover:text-white text-xs uppercase tracking-widest transition py-1"
        >
          <LogOut size={13} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#f5f0eb] font-sans overflow-hidden" style={{ WebkitOverflowScrolling: "touch" }}>

      {/* ── Mobile sidebar overlay ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar — desktop always visible, mobile slide-in ─────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-black flex flex-col h-full transition-transform duration-300
        lg:relative lg:translate-x-0 lg:w-64 lg:flex-shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {sidebarContent}
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0">
          <div className="bg-[var(--color-gold)] px-5 sm:px-8 py-4 sm:py-5 flex items-center gap-4">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-black/70 hover:text-black transition flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-black/60 font-bold">Invoice Dashboard</p>
              <h1 className="text-xl sm:text-3xl font-black text-black mt-0.5 leading-tight">
                Welcome back, {adminName || "Admin"}
              </h1>
            </div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-16 pt-4 sm:pt-6 space-y-4 sm:space-y-6" style={{ WebkitOverflowScrolling: "touch" }}>

          {/* ── Promoters section ── */}
          {activeNav === "promoters" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center justify-between">
                <h2 className="text-base font-black text-gray-900">Promoter Applications</h2>
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text" placeholder="Search name or city…" value={promoSearch}
                      onChange={e => setPromoSearch(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-none pl-8 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-gold)] w-52"
                    />
                  </div>
                  <button onClick={fetchPromoters} className="px-3 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition">
                    Refresh
                  </button>
                </div>
              </div>

              {promoLoading ? (
                <p className="text-gray-400 text-sm py-16 text-center">Loading applications…</p>
              ) : promoters.length === 0 ? (
                <div className="py-20 text-center bg-white border border-gray-100">
                  <Users size={32} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm">No applications yet.</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <div style={{ minWidth: 700 }}>
                      <div className="grid grid-cols-[180px_100px_140px_110px_120px_48px] border-b border-gray-100 bg-gray-50">
                        {["Name", "Age", "Location", "Applied", "Status", ""].map(h => (
                          <div key={h} className="px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-gray-500 font-bold">{h}</div>
                        ))}
                      </div>
                      {promoters
                        .filter(p => {
                          if (!promoSearch) return true;
                          const q = promoSearch.toLowerCase();
                          return (p.name ?? "").toLowerCase().includes(q) || (p.location ?? "").toLowerCase().includes(q);
                        })
                        .map((p, idx) => (
                          <div
                            key={p.id}
                            onClick={() => setSelectedPromo(p)}
                            className={`grid grid-cols-[180px_100px_140px_110px_120px_48px] border-b border-gray-50 last:border-0 hover:bg-amber-50/60 cursor-pointer transition group ${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }`}
                          >
                            <div className="px-4 py-4">
                              <p className="text-sm font-bold text-gray-900 group-hover:text-[#b8621a] transition truncate">{p.name}</p>
                              {p.phone && <p className="text-xs text-green-700 mt-0.5 truncate">📱 {p.phone}</p>}
                              {p.email && <p className="text-xs text-gray-400 truncate">✉ {p.email}</p>}
                            </div>
                            <div className="px-4 py-4 flex items-center text-sm text-gray-700">{p.age ?? "—"}</div>
                            <div className="px-4 py-4 flex items-center text-sm text-gray-700 truncate">{p.location ?? "—"}</div>
                            <div className="px-4 py-4 flex items-center text-sm text-gray-700 whitespace-nowrap">
                              {new Date(p.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                            <div className="px-4 py-4 flex items-center">
                              <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 ${
                                p.status === "approved"  ? "text-green-700 bg-green-100" :
                                p.status === "rejected"  ? "text-red-700 bg-red-100" :
                                "text-amber-700 bg-amber-100"
                              }`}>{p.status}</span>
                            </div>
                            <div className="flex items-center justify-center">
                              <button
                                onClick={e => { e.stopPropagation(); deletePromo(p.id); }}
                                className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-500 p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400">{promoters.length} application{promoters.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              )}

              {/* Promoter detail drawer */}
              {selectedPromo && (
                <PromoterDrawer
                  promo={selectedPromo}
                  onClose={() => setSelectedPromo(null)}
                  onStatusChange={updatePromoStatus}
                  onDelete={deletePromo}
                />
              )}
            </div>
          )}

          {activeNav !== "promoters" && (<>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Pending"
              value={String(pendingCount)}
              sub="awaiting payment"
              accent="text-amber-500"
            />
            <StatCard
              label="Paid Out"
              value={String(paidCount)}
              sub={fmt(totalPaidAmt)}
              accent="text-green-600"
            />
            <StatCard
              label="Outstanding"
              value={fmt(totalOwedAmt)}
              sub={`${pendingCount} invoice${pendingCount !== 1 ? "s" : ""}`}
              accent="text-gray-800"
            />
          </div>

          {/* Table card */}
          <div className="bg-white rounded-none shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">

            {/* Table header / filters */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
              <h2 className="text-base font-black text-gray-900 mr-auto">All Submissions</h2>

              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Search name or group…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-none pl-8 pr-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[var(--color-gold)] w-52"
                />
              </div>

              {/* Month filter */}
              <select
                value={monthFilter}
                onChange={e => setMonthFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-800 focus:outline-none appearance-none pr-7"
              >
                <option value="all">All months</option>
                {months.map(m => (
                  <option key={m} value={m}>
                    {new Date(m + "-01").toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
                  </option>
                ))}
              </select>

              {/* Week filter */}
              <select
                value={weekFilter}
                onChange={e => setWeekFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 rounded-none px-3 py-2 text-sm text-gray-800 focus:outline-none appearance-none pr-7"
              >
                <option value="all">All weeks</option>
                {weeks.map(w => (
                  <option key={w} value={w}>
                    Week {w}{w === currentWeek() ? " (this week)" : ""}
                  </option>
                ))}
              </select>

              {/* Export CSV */}
              <button
                onClick={() => {
                  const label = monthFilter !== "all" ? monthFilter : new Date().toISOString().slice(0, 7);
                  exportCSV(filtered, label);
                }}
                title="Export filtered invoices as CSV"
                className="flex items-center gap-1.5 px-3 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
              >
                <Download size={13} /> Export
              </button>

              {/* Status toggle */}
              <div className="flex rounded-none border border-gray-200 overflow-hidden text-xs font-bold uppercase tracking-wider">
                {(["unpaid", "all", "paid"] as const).map(s => (
                  <button
                    key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-2 transition ${
                      statusFilter === s
                        ? "bg-[var(--color-gold)] text-black"
                        : "text-gray-500 hover:text-gray-800 bg-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table — min-width forces horizontal scroll on mobile */}
            <div style={{ minWidth: 768 }}>

            {/* Column headers */}
            <div className="grid grid-cols-[200px_160px_110px_130px_130px_110px_48px] border-b border-gray-100 bg-gray-50">
              {["Name", "Group / Job", "Job Type", "Submitted", "Total Owed", "Status", ""].map((h) => (
                <div key={h} className="px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-gray-500 font-bold whitespace-nowrap">
                  {h === "Submitted" ? (
                    <button onClick={() => setSortDesc(!sortDesc)} className="flex items-center gap-1 hover:text-gray-800 transition">
                      {h} {sortDesc ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                    </button>
                  ) : h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {loading ? (
              <p className="text-gray-400 text-sm py-16 text-center">Loading submissions…</p>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-400 text-sm mb-2">No submissions match your filters.</p>
                <p className="text-gray-300 text-xs">Try adjusting the week or status filter.</p>
              </div>
            ) : (
              <div>
                {filtered.map((inv, idx) => (
                  <div
                    key={inv.id}
                    onClick={() => setSelected(inv)}
                    className={`grid grid-cols-[200px_160px_110px_130px_130px_110px_48px] border-b border-gray-50 last:border-0 hover:bg-amber-50/60 cursor-pointer transition group ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <div className="px-4 py-4">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#b8621a] transition whitespace-nowrap overflow-hidden text-ellipsis">
                        {inv.first_name} {inv.last_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{inv.email}</p>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <p className="text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">{inv.whatsapp_group || "—"}</p>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm text-gray-700 capitalize whitespace-nowrap">{inv.job_type || "—"}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm text-gray-700 whitespace-nowrap">{fmtDate(inv.submission_date || inv.created_at)}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{fmt(inv.total_owed)}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      {inv.paid ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-green-700 bg-green-100 px-2 py-1 whitespace-nowrap">
                          <CheckCircle size={10} /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-1 whitespace-nowrap">
                          <Clock size={10} /> Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={e => { e.stopPropagation(); deleteInvoice(inv.id); }}
                        className="opacity-0 group-hover:opacity-100 transition text-gray-300 hover:text-red-500 p-1"
                        title="Delete submission"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>{/* end min-width wrapper */}

            {/* Footer */}
            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-400">{filtered.length} submission{filtered.length !== 1 ? "s" : ""}</p>
                <p className="text-xs font-bold text-gray-700">Total: <span className="text-gray-900">{fmt(filteredTotal)}</span></p>
              </div>
            )}
          </div>{/* end overflow-x-auto */}
          </div>{/* end table card */}

          </>)}
        </div>
      </div>

      {selected && (
        <DetailDrawer
          inv={selected}
          onClose={() => setSelected(null)}
          onTogglePaid={(id, paid) => {
            togglePaid(id, paid);
            setSelected(prev => prev ? { ...prev, paid } : null);
          }}
          onDelete={deleteInvoice}
          onUpdate={(id, patch) => {
            setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
            setSelected(prev => prev ? { ...prev, ...patch } : null);
          }}
        />
      )}
    </div>
  );
}
