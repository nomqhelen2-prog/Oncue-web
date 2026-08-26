import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase, type Invoice } from "../lib/supabase";
import {
  LogOut, CheckCircle, Clock, Search, ChevronDown, ChevronUp, X, FileText, Menu, Trash2, Download, Settings,
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
function DetailDrawer({ inv, onClose, onTogglePaid, onDelete }: {
  inv: Invoice; onClose: () => void; onTogglePaid: (id: string, paid: boolean) => void; onDelete: (id: string) => void;
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
    inv.daily_rate   ? ["Daily Rate", fmt(inv.daily_rate)]   : ["", ""],
    inv.fixed_rate   ? ["Fixed Rate", fmt(inv.fixed_rate)]   : ["", ""],
    inv.setup_rate   ? ["Setup Rate", fmt(inv.setup_rate)]   : ["", ""],
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
    ["Submission Date", fmtDate(inv.submission_date || inv.created_at)],
    ["Agreed to T&Cs", inv.agreed_to_terms ? "Yes" : "No"],
  ] as [string, string][]).filter(([k]) => k);

  const dayRows: [string, string][] = [];
  for (let i = 1; i <= 7; i++) {
    const h = inv[`day_${i}_hours` as keyof Invoice] as number | null;
    const r = inv[`day_${i}_rate` as keyof Invoice] as number | null;
    if (h != null) dayRows.push([`Day ${i}`, `${h} hrs @ ${fmt(r)}/hr`]);
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

        <button
          onClick={() => { onClose(); onDelete(inv.id); }}
          className="w-full py-2.5 font-bold uppercase tracking-widest text-xs transition rounded-sm border border-red-900/40 text-red-400 hover:bg-red-950/40 flex items-center justify-center gap-2"
        >
          <Trash2 size={13} /> Delete Submission
        </button>

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
  { id: "submissions", label: "Submissions", icon: <FileText size={17} /> },
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

  const rows = invoices.map(inv => [
    `${inv.first_name ?? ""} ${inv.last_name ?? ""}`.trim(),
    inv.email ?? "",
    inv.whatsapp ?? "",
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
    inv.account_number ?? "",
    inv.branch_code ?? "",
    inv.account_type ?? "",
    inv.paid ? "Paid" : "Unpaid",
    inv.created_at?.split("T")[0] ?? "",
  ]);

  const csv = [headers, ...rows]
    .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
  const [activeNav]                     = useState("submissions");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [monthFilter, setMonthFilter]   = useState<string>("all"); // "all" or "YYYY-MM"

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
            onClick={() => setSidebarOpen(false)}
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
        />
      )}
    </div>
  );
}
