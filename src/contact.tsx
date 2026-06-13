import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { z } from "zod";
import { ArrowUpRight, MessageCircle, Mail, Instagram, MapPin, Loader2 } from "lucide-react";
import { Starburst } from "@/components/Starburst";
import { images } from "./assets/images";

export default ContactPage;

// ─── EmailJS config (values come from .env.local / Vercel env vars) ──────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;
// ─────────────────────────────────────────────────────────────────────────────

const schema = z.object({
  name:    z.string().trim().min(1, "Name is required").max(120),
  email:   z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError]   = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setStatus("loading");

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current!,
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setError("Could not send your message. Please try again or email us directly.");
    }
  }

  const channels = [
    { icon: MessageCircle, label: "WhatsApp",  value: "+27 60 106 4358",           href: "https://wa.me/27601064358" },
    { icon: Mail,          label: "Email",      value: "admin@oncuemarketing.info", href: "mailto:admin@oncuemarketing.info" },
    { icon: Instagram,     label: "Instagram",  value: "@oncuemarketing",           href: "https://instagram.com/oncuemarketing" },
    { icon: MapPin,        label: "Reach",      value: "JHB | CPT | DBN" },
  ];

  return (
    <div className="bg-black text-white">
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 relative">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase leading-[0.9]">
              Let's <br />Work <br />
              <span className="text-[var(--color-gold)]">Together</span>
            </h1>
            <Starburst className="absolute -bottom-6 left-1/2 w-20 h-20 text-white/80 hidden md:block" />
          </div>
          <div className="md:col-span-5 relative">
            <img
              src={images.contact}
              alt="Brand activation celebration"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        {/* Contact channels */}
        <div className="md:col-span-5 space-y-8">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href ?? undefined}
              target={c.href?.startsWith("http") ? "_blank" : undefined}
              rel={c.href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="block group"
            >
              <div className="flex items-start gap-4">
                <ArrowUpRight className="w-5 h-5 text-[var(--color-gold)] mt-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-white/50 mb-1 flex items-center gap-2">
                    <c.icon className="w-3.5 h-3.5" /> {c.label}
                  </p>
                  <p className="text-lg sm:text-xl font-bold group-hover:text-[var(--color-gold)] transition break-words">
                    {c.value}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="md:col-span-7 border border-white/15 p-8 md:p-10 space-y-6"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wide leading-tight break-words">
            Send us a brief
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Name</label>
            <input
              required
              name="from_name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={120}
              className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[var(--color-gold)] text-white"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Email</label>
            <input
              required
              type="email"
              name="from_email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[var(--color-gold)] text-white"
              placeholder="you@brand.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-white/60 mb-2">Message</label>
            <textarea
              required
              name="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={2000}
              rows={5}
              className="w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[var(--color-gold)] text-white resize-none"
              placeholder="Tell us about your brand and activation goals"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {status === "success" && (
            <p className="text-[var(--color-gold)] text-sm font-bold uppercase tracking-widest">
              Thanks — we'll be in touch shortly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition disabled:opacity-60"
          >
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Submit Enquiry
          </button>
        </form>
      </section>
    </div>
  );
}
