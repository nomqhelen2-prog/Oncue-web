import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

const autofillStyle = {
  WebkitBoxShadow: "0 0 0px 1000px #000 inset",
  WebkitTextFillColor: "white",
  caretColor: "white",
  background: "transparent",
};

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/admin");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex relative overflow-hidden">

      {/* ── Left gold panel ───────────────────────────────────────────── */}
      <div
        className="hidden lg:block absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: "52%",
          background: "var(--color-gold)",
          clipPath: "polygon(0 0, 90% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* ── Form ─────────────────────────────────────────────────────── */}
      <div className="relative min-h-screen w-full flex items-center justify-end px-8 md:px-20 py-16">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <img
              src="/logoonly.png"
              alt="OnCue Marketing"
              className="w-6 h-6 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span
              style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
              className="text-sm tracking-widest text-white"
            >
              OnCue <strong>MARKETING</strong>
            </span>
          </div>

          <h2 className="text-lg font-black uppercase tracking-widest mb-8">Admin Portal</h2>

          <form onSubmit={handleLogin} className="space-y-8">

            {/* Email */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-white mb-3 font-bold">
                Email Address
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@oncuemarketing.info"
                autoComplete="email"
                className="w-full border-b border-white/30 pb-3 text-white text-sm focus:outline-none focus:border-white transition-colors"
                style={autofillStyle}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-white mb-3 font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full border-b border-white/30 pb-3 pr-10 text-white text-sm focus:outline-none focus:border-white transition-colors"
                  style={autofillStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-0 bottom-3 text-white/40 hover:text-white transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error — now shows Supabase's actual message */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="bg-[var(--color-gold)] text-black px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition disabled:opacity-60 flex items-center gap-3"
            >
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
              )}
              Sign In
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}
