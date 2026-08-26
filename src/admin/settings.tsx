import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Bell, BellOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [enabled, setEnabled]       = useState(true);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [testing, setTesting]       = useState(false);
  const [testResult, setTestResult] = useState<"ok" | "err" | null>(null);
  const [toast, setToast]           = useState("");

  // Auth guard
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, []);

  // Load settings (reuses existing whatsapp_enabled column)
  useEffect(() => {
    supabase.from("admin_settings").select("whatsapp_enabled").eq("id", 1).single()
      .then(({ data }) => {
        if (data) setEnabled(data.whatsapp_enabled ?? true);
        setLoading(false);
      });
  }, []);

  async function saveToggle(val: boolean) {
    setSaving(true);
    setEnabled(val);
    await supabase.from("admin_settings")
      .upsert({ id: 1, whatsapp_enabled: val, updated_at: new Date().toISOString() });
    setSaving(false);
    showToast(val ? "Email notifications enabled" : "Email notifications paused");
  }

  async function sendTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: true }),
      });
      setTestResult(res.ok ? "ok" : "err");
    } catch {
      setTestResult("err");
    }
    setTesting(false);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] font-sans">
      {/* Header */}
      <div className="bg-[var(--color-gold)] px-6 py-5 flex items-center gap-4">
        <Link to="/admin" className="text-black/60 hover:text-black transition">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/60 font-bold">Admin</p>
          <h1 className="text-2xl font-black text-black">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Email notifications card */}
        <div className="bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-3">
              {enabled
                ? <Bell size={18} className="text-green-600 flex-shrink-0" />
                : <BellOff size={18} className="text-gray-400 flex-shrink-0" />}
              <div>
                <p className="font-black text-gray-900 text-sm uppercase tracking-wide">Email Notifications</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Receive an email each time a staff member submits an invoice.
                </p>
              </div>
            </div>
            {/* Toggle */}
            <button
              disabled={loading || saving}
              onClick={() => saveToggle(!enabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
                enabled ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>

          <p className={`text-xs font-bold mt-4 ${enabled ? "text-green-600" : "text-gray-400"}`}>
            {loading ? "Loading…" : saving ? "Saving…" : enabled ? "● Active" : "○ Paused"}
          </p>

          {/* Test button */}
          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3">
            <button
              onClick={sendTest}
              disabled={testing}
              className="flex items-center gap-2 bg-black text-white text-xs uppercase tracking-widest font-bold px-4 py-2.5 hover:bg-gray-800 transition disabled:opacity-40"
            >
              {testing ? <Loader2 size={13} className="animate-spin" /> : null}
              Send Test Email
            </button>
            {testResult === "ok" && (
              <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                <CheckCircle size={13} /> Sent! Check your inbox.
              </span>
            )}
            {testResult === "err" && (
              <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                <AlertCircle size={13} /> Failed — check Vercel env vars
              </span>
            )}
          </div>
        </div>


      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold uppercase tracking-widest px-5 py-3 shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
