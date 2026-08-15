import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { X, Loader2 } from "lucide-react";

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;


function Field({ label, name, placeholder, type = "text", required = false }: {
  label: string; name: string; placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-white/80 mb-3 font-bold">{label}</label>
      <input
        type={type} name={name} placeholder={placeholder} required={required}
        className="w-full bg-transparent border-b border-white/30 pb-3 text-white text-sm focus:outline-none focus:border-white placeholder:text-white/40 transition-colors"
      />
    </div>
  );
}

export function EnquiryModal({ onClose }: { onClose: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      // Build a combined message from all fields so existing EmailJS template still works
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-black text-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 p-8 md:p-12 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-black uppercase tracking-widest mb-8">Connect With Us</h2>

        {status === "success" ? (
          <div className="text-center py-16">
            <p className="text-[var(--color-gold)] text-xl font-black uppercase tracking-widest">
              Thanks — we'll be in touch shortly.
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} className="space-y-8">
            <Field label="Name"  name="from_name"  placeholder="Your full name"   required />
            <Field label="Email" name="from_email" placeholder="you@brand.com" type="email" required />
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-white/80 mb-3 font-bold">Message</label>
              <textarea
                name="message_body" rows={5} placeholder="Tell us about your brand and activation goals"
                className="w-full bg-transparent border-b border-white/30 pb-3 text-white text-sm focus:outline-none focus:border-white resize-none placeholder:text-white/40 transition-colors"
              />
            </div>

            {/* Hidden field that gets populated on submit */}
            <input type="hidden" name="message" />

            {status === "error" && (
              <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit" disabled={status === "loading"}
              className="bg-[var(--color-gold)] text-black px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition disabled:opacity-60 flex items-center gap-3"
            >
              {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Enquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
