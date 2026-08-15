import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, type Invoice } from "../lib/supabase";
import { LogOut, CheckCircle, Clock, Search, ChevronDown, ChevronUp, X } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────
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
function DetailDrawer({ inv, onClose, onTogglePaid }: {
  inv: Invoice; onClose: () => void; onTogglePaid: (id: string, paid: boolean) => void;
}) {
  const [notes, setNotes] = useState(inv.admin_notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  async function saveNotes() {
    setSavingNotes(true);
    await supabase.from("invoices").update({ admin_notes: notes }).eq("id", inv.id);
    setSavingNotes(false);
  }

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
    inv.daily_rate ? ["Daily Rate", fmt(inv.daily_rate)] : ["", ""],
    inv.fixed_rate ? ["Fixed Rate", fmt(inv.fixed_rate)] : ["", ""],
    inv.setup_rate ? ["Setup Rate", fmt(inv.setup_rate)] : ["", ""],
    ["Stores Worked", inv.stores_worked],
    ["Labour Total", fmt(inv.labour_total)],
    ["Bought Items", inv.bought_items],
    inv.bought_items === "yes" ? ["Purchase Details", inv.purchase_details] : ["", ""],
    inv.bought_items === "yes" ? ["Purchase Amount", fmt(inv.purchase_amount)] : ["", ""],
    ["Fuel Contribution", inv.fuel_contribution],
    inv.fuel_contribution === "yes" ? ["Fuel Amount", fmt(inv.fuel_amount)] : ["", ""],
    ["Pre-Pay Received", inv.pre_pay],
    inv.pre_pay === "yes" ? ["Pre-Pay Amount", fmt(inv.pre_pay_amount)] : ["", ""],
    ["Total Owed", fmt(inv.total_owed)],
    ["Submission Date", fmtDate(inv.submission_date)],
    ["Agreed to T&Cs", inv.agreed_to_terms ? "Yes" : "No"],
  ] as [string, string][]).filter(([k]) => k);

  // Add per-day rows
  const dayRows: [string, string][] = [];
  for (let i = 1; i <= 7; i++) {
    const h = inv[`day_${i}_hours` as keyof Invoice] as number | null;
    const r = inv[`day_${i}_rate` as keyof Invoice] as number | null;
    if (h != null) dayRows.push([`Day ${i}`, `${h} hrs @ ${fmt(r)}/hr`]);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#111] w-full max-w-md h-full overflow-y-auto border-l border-white/10 p-8 flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white">
              {inv.first_name} {inv.last_name}
            </h2>
            <p className="text-white/40 text-xs mt-1">{fmtDate(inv.submission_date)}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Paid toggle */}
        <button
          onClick={() => onTogglePaid(inv.id, !inv.paid)}
          className={`w-full py-3 font-black uppercase tracking-widest text-sm transition ${
            inv.paid
              ? "bg-white/10 text-white/60 hover:bg-white/15"
              : "bg-[var(--color-gold)] text-black hover:bg-white"
          }`}
        >
          {inv.paid ? "✓ Paid — Mark as Unpaid" : "Mark as Paid"}
        </button>

        {/* Details */}
        <div className="space-y-0 border border-white/10">
          {rows.map(([k, v]) => v ? (
            <div key={k} className="flex justify-between gap-4 px-4 py-2.5 border-b border-white/5 last:border-0">
              <span className="text-[11px] uppercase tracking-widest text-white/40 flex-shrink-0">{k}</span>
              <span className="text-sm text-white text-right">{v}</span>
            </div>
          ) : null)}
          {dayRows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-4 py-2.5 border-b border-white/5 last:border-0">
              <span className="text-[11px] uppercase tracking-widest text-white/40 flex-shrink-0">{k}</span>
              <span className="text-sm text-white text-right">{v}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border border-[var(--color-gold)]/30 px-4 py-3 flex justify-between">
          <span className="text-[11px] uppercase tracking-widest text-[var(--color-gold)]">Total Owed</span>
          <span className="font-black text-white">{fmt(inv.total_owed)}</span>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-white/40 mb-2">Admin Notes</label>
          <textarea
            value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Add internal notes..."
            className="w-full bg-transparent border border-white/10 p-3 text-white text-sm focus:outline-none focus:border-white/30 resize-none placeholder:text-white/20"
          />
          <button
            onClick={saveNotes} disabled={savingNotes}
            className="mt-2 text-xs uppercase tracking-widest text-[var(--color-gold)] hover:text-white transition disabled:opacity-40"
          >
            {savingNotes ? "Saving…" : "Save Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-white/10 p-5">
      <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mb-2">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices]       = useState<Invoice[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [weekFilter, setWeekFilter]   = useState<number | "all">(currentWeek());
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [selected, setSelected]       = useState<Invoice | null>(null);
  const [sortDesc, setSortDesc]       = useState(true);

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, []);

  // Fetch
  useEffect(() => {
    fetchInvoices();
    // Real-time subscription
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

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/admin/login");
  }

  // Filter + sort
  const filtered = invoices
    .filter(inv => {
      const week = getWeek(inv.submission_date || inv.created_at);
      if (weekFilter !== "all" && week !== weekFilter) return false;
      if (statusFilter === "paid" && !inv.paid) return false;
      if (statusFilter === "unpaid" && inv.paid) return false;
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

  // Stats (current filter)
  const totalOwed    = filtered.reduce((s, i) => s + (i.total_owed ?? 0), 0);
  const totalPaid    = filtered.filter(i => i.paid).reduce((s, i) => s + (i.total_owed ?? 0), 0);
  const totalPending = totalOwed - totalPaid;

  // Week options
  const weeks = Array.from(new Set(invoices.map(i => getWeek(i.submission_date || i.created_at)))).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-gold)]">Admin</p>
          <h1 className="text-lg font-black uppercase tracking-tight">Invoice Dashboard</h1>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest transition">
          <LogOut size={14} /> Sign Out
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Total Owed" value={fmt(totalOwed)} sub={`${filtered.length} submissions`} />
          <Stat label="Paid Out" value={fmt(totalPaid)} sub={`${filtered.filter(i => i.paid).length} invoices`} />
          <Stat label="Outstanding" value={fmt(totalPending)} sub={`${filtered.filter(i => !i.paid).length} unpaid`} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text" placeholder="Search name or group..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 pl-8 pr-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Week filter */}
          <select
            value={weekFilter}
            onChange={e => setWeekFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none appearance-none pr-8"
          >
            <option value="all" className="bg-black">All weeks</option>
            {weeks.map(w => (
              <option key={w} value={w} className="bg-black">
                Week {w}{w === currentWeek() ? " (this week)" : ""}
              </option>
            ))}
          </select>

          {/* Status filter */}
          {(["all", "unpaid", "paid"] as const).map(s => (
            <button
              key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition ${
                statusFilter === s
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-black"
                  : "border-white/20 text-white/50 hover:text-white hover:border-white/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-white/30 text-sm py-12 text-center">Loading submissions…</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 text-sm py-12 text-center">No submissions match your filters.</p>
        ) : (
          <div className="border border-white/10 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] border-b border-white/10 bg-white/5">
              {["Name", "Group / Job", "Job Type", "Submitted", "Total Owed", "Status"].map((h) => (
                <div key={h} className="px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
                  {h === "Submitted" ? (
                    <button onClick={() => setSortDesc(!sortDesc)} className="flex items-center gap-1 hover:text-white transition">
                      {h} {sortDesc ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                    </button>
                  ) : h}
                </div>
              ))}
            </div>

            {/* Rows */}
            {filtered.map(inv => (
              <div
                key={inv.id}
                onClick={() => setSelected(inv)}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr] border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition group"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-bold text-white group-hover:text-[var(--color-gold)] transition">
                    {inv.first_name} {inv.last_name}
                  </p>
                  <p className="text-xs text-white/30">{inv.email}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-white/60 truncate">{inv.whatsapp_group || "—"}</p>
                </div>
                <div className="px-4 py-3">
                  <span className="text-xs text-white/50 capitalize">{inv.job_type || "—"}</span>
                </div>
                <div className="px-4 py-3">
                  <span className="text-xs text-white/50">{fmtDate(inv.submission_date || inv.created_at)}</span>
                </div>
                <div className="px-4 py-3">
                  <span className="text-sm font-bold text-white">{fmt(inv.total_owed)}</span>
                </div>
                <div className="px-4 py-3 flex items-center gap-2">
                  {inv.paid ? (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-green-400">
                      <CheckCircle size={13} /> Paid
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-gold)]">
                      <Clock size={13} /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && (
        <DetailDrawer
          inv={selected}
          onClose={() => setSelected(null)}
          onTogglePaid={(id, paid) => {
            togglePaid(id, paid);
            setSelected(prev => prev ? { ...prev, paid } : null);
          }}
        />
      )}
    </div>
  );
}
