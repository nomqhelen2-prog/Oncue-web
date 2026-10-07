import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { X, Loader2, ArrowRight } from "lucide-react";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

const inputCls = "w-full bg-white/10 border border-white/40 px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-gold)] placeholder:text-white/50 transition-colors";
const labelCls = "block text-[11px] uppercase tracking-[0.2em] text-white/90 mb-2 font-bold";

export function EnquiryModal({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const f = formRef.current!;
      const get = (n: string) => (f.elements.namedItem(n) as HTMLInputElement)?.value || "";
      (f.elements.namedItem("message") as HTMLInputElement).value = get("message_body");
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, f, EMAILJS_PUBLIC_KEY);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-black w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">

        {/* Header */}
        <div className="bg-[var(--color-gold)] px-8 py-6 relative text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/60 font-bold mb-0.5">OnCue Marketing</p>
          <h2 className="text-xl font-black uppercase tracking-tight text-black">Connect With Us</h2>
          <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-5 text-black/50 hover:text-black transition" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          {status === "success" ? (
            <div className="text-center py-12">
              <p className="text-[var(--color-gold)] text-2xl font-black uppercase tracking-widest mb-2">✓</p>
              <p className="text-white font-black uppercase tracking-widest text-base">Message sent!</p>
              <p className="text-white/50 text-sm mt-2">We'll be in touch shortly.</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className={labelCls}>Name</label>
                <input type="text" name="from_name" placeholder="Your full name" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" name="from_email" placeholder="you@brand.com" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Message</label>
                <textarea
                  name="message_body" rows={4}
                  placeholder="Tell us about your brand and activation goals"
                  className={`${inputCls} resize-none`}
                />
              </div>

              <input type="hidden" name="message" />

              {status === "error" && (
                <p className="text-red-500 text-sm">Something went wrong — please try again.</p>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="submit" disabled={status === "loading"}
                  className="w-full bg-[var(--color-gold)] text-black py-4 font-black uppercase tracking-widest text-sm hover:brightness-105 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Submit Enquiry
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/30" />
                  <span className="text-xs text-white/60 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-white/30" />
                </div>

                <Link
                  to="/join"
                  className="w-full bg-[var(--color-gold)] text-black py-4 font-black uppercase tracking-widest text-sm hover:brightness-105 transition flex items-center justify-center gap-2"
                >
                  Join as Promoter <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
