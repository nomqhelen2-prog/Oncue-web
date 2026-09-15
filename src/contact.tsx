import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { z } from "zod";
import { ArrowUpRight, MessageCircle, Mail, Instagram, MapPin, Loader2 } from "lucide-react";
import { Starburst } from "@/components/Starburst";
import { images } from "./assets/images";

export default ContactPage;

// ─── EmailJS config ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

// ─── Schemas ──────────────────────────────────────────────────────────────────
const bizSchema = z.object({
  name:    z.string().trim().min(1, "Name is required").max(120),
  email:   z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

// ─── Rate limiting ────────────────────────────────────────────────────────────
const RATE_LIMIT_KEY    = "oncue_form_submissions";
const RATE_LIMIT_MAX    = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;

function checkRateLimit(): { allowed: boolean; waitMinutes?: number } {
  const raw = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();
  const timestamps: number[] = raw ? JSON.parse(raw) : [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) {
    const oldest = Math.min(...recent);
    const waitMs = RATE_LIMIT_WINDOW - (now - oldest);
    return { allowed: false, waitMinutes: Math.ceil(waitMs / 60000) };
  }
  recent.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
  return { allowed: true };
}

const inputCls =
  "w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[var(--color-gold)] text-white placeholder:text-white/30";
const labelCls = "block text-xs uppercase tracking-widest text-white/80 mb-2";

// ─── Page ─────────────────────────────────────────────────────────────────────
function ContactPage() {
  const bizRef = useRef<HTMLFormElement>(null);

  const [bizForm, setBizForm]     = useState({ name: "", email: "", message: "" });
  const [bizStatus, setBizStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [bizError, setBizError]   = useState<string | null>(null);

  async function onBizSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBizError(null);
    const { allowed, waitMinutes } = checkRateLimit();
    if (!allowed) { setBizError(`Too many submissions. Please wait ${waitMinutes} minute${waitMinutes === 1 ? "" : "s"}.`); return; }
    const parsed = bizSchema.safeParse(bizForm);
    if (!parsed.success) { setBizError(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    setBizStatus("loading");
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, bizRef.current!, EMAILJS_PUBLIC_KEY);
      setBizStatus("success");
      setBizForm({ name: "", email: "", message: "" });
    } catch {
      setBizStatus("error");
      setBizError("Could not send your message. Please try again or email us directly.");
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

      {/* ── Hero ── */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 relative">
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black uppercase leading-[0.9]">
              Let's <br />Work <br />
              <span className="text-[var(--color-gold)]">Together</span>
            </h1>
            <Starburst className="absolute -top-6 right-0 w-16 h-16 text-white/80 hidden md:block" />
          </div>
          <div className="md:col-span-5 relative">
            <img
              src={images.contact}
              alt="Brand activation celebration"
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* ── Business enquiry ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-12 gap-12">
        {/* Channels */}
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
                  <p className="text-xs uppercase tracking-widest text-white/75 mb-1 flex items-center gap-2">
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

        {/* Biz form */}
        <form ref={bizRef} onSubmit={onBizSubmit} className="md:col-span-7 border border-white/15 p-8 md:p-10 space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wide leading-tight">
            Partner With Us
          </h2>
          <p className="text-white/50 text-sm">
            Brands, agencies, and event organisers — tell us about your next activation.
          </p>

          <div>
            <label className={labelCls}>Company / Name</label>
            <input required name="from_name" value={bizForm.name}
              onChange={(e) => setBizForm({ ...bizForm, name: e.target.value })}
              maxLength={120} className={inputCls} placeholder="Your name or brand" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input required type="email" name="from_email" value={bizForm.email}
              onChange={(e) => setBizForm({ ...bizForm, email: e.target.value })}
              maxLength={255} className={inputCls} placeholder="you@brand.com" />
          </div>
          <div>
            <label className={labelCls}>Tell us about your project</label>
            <textarea required name="message" value={bizForm.message}
              onChange={(e) => setBizForm({ ...bizForm, message: e.target.value })}
              maxLength={2000} rows={5} className={`${inputCls} resize-none`}
              placeholder="Tell us about your brand and activation goals" />
          </div>

          {bizError && <p className="text-red-400 text-sm">{bizError}</p>}
          {bizStatus === "success" && (
            <p className="text-[var(--color-gold)] text-sm font-bold uppercase tracking-widest">
              Thanks — we'll be in touch shortly.
            </p>
          )}
          <button type="submit" disabled={bizStatus === "loading"}
            className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition disabled:opacity-60">
            {bizStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Send Enquiry
          </button>
        </form>
      </section>

      {/* ── Join the Team CTA ── */}
      <section className="relative overflow-hidden">
        {/* Background image — lazy loaded, absolutely positioned */}
        <img
          src="https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/DUSSE%20X%20NOSTRA-55.jpeg"
          alt=""
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay + fade to black at bottom */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, #000 100%)" }} />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-4">Promoters</p>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-[0.9] mb-6">
              Want to Join<br />the Team?
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              We're always looking for talented promoters and brand ambassadors across JHB, CPT, and DBN. Apply on our dedicated page — we'll review your application and be in touch.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Link
              to="/join"
              className="inline-flex items-center gap-3 bg-[var(--color-gold)] text-black px-10 py-5 font-black uppercase tracking-widest text-sm hover:bg-white transition"
            >
              Apply Now <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
