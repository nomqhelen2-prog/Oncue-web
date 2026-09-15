import { useRef, useState } from "react";
import { z } from "zod";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import { supabase } from "./lib/supabase";

export default JoinPage;

// ── Validation ────────────────────────────────────────────────────────────────
const schema = z.object({
  name:        z.string().trim().min(1, "Name is required").max(120),
  age:         z.string().trim().min(1, "Age is required").max(3),
  location:    z.string().trim().min(1, "Location is required").max(80),
  height:      z.string().trim().min(1, "Height is required").max(15),
  dress_size:  z.string().trim().min(1, "Dress size is required").max(10),
  top_size:    z.string().trim().min(1, "Top size is required").max(10),
  pant_size:   z.string().trim().min(1, "Pant size is required").max(10),
  description: z.string().trim().min(20, "Tell us more about yourself (min 20 characters)").max(1500),
  phone:       z.string().trim().min(7, "Phone number is required").max(20),
});

// ── Image compression ─────────────────────────────────────────────────────────
async function compressImage(file: File, maxPx = 900, quality = 0.75): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      const scale  = Math.min(1, maxPx / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(width  * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Compression failed")), "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function uploadImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const compressed = await compressImage(file);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { data, error } = await supabase.storage
      .from("promoter-images")
      .upload(filename, compressed, { contentType: "image/jpeg", upsert: false });
    if (error) throw new Error(`Image upload failed: ${error.message}`);
    const { data: { publicUrl } } = supabase.storage
      .from("promoter-images")
      .getPublicUrl(data.path);
    urls.push(publicUrl);
  }
  return urls;
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full bg-transparent border-b border-white/20 py-3 focus:outline-none focus:border-[var(--color-gold)] text-white placeholder:text-white/30 text-sm";
const labelCls = "block text-[11px] uppercase tracking-widest text-white/70 mb-2 font-semibold";

// ── Page ──────────────────────────────────────────────────────────────────────
function JoinPage() {
  const EMPTY = {
    name: "", age: "", location: "", height: "",
    dress_size: "", top_size: "", pant_size: "",
    description: "", phone: "",
  };
  const [form, setForm]         = useState(EMPTY);
  const [images, setImages]     = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus]     = useState<"idle" | "uploading" | "submitting" | "success" | "error">("idle");
  const [error, setError]       = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const f = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value })),
  });

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []).slice(0, 4);
    setImages(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
    e.target.value = "";
  }

  function removeImage(idx: number) {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Invalid input"); return; }
    if (images.length < 4) { setError("Please upload all 4 photos before submitting."); return; }

    setStatus("uploading");
    setProgress("Compressing and uploading photos…");

    let imageUrls: string[];
    try {
      imageUrls = await uploadImages(images);
    } catch (err: any) {
      setStatus("error");
      setError("Photo upload failed — please check your connection and try again.");
      return;
    }

    setStatus("submitting");
    setProgress("Submitting your application…");

    try {
      const res = await fetch("/api/promoter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: { ...form, images: imageUrls } }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Submission failed");
      }
      setStatus("success");
      setForm(EMPTY);
      setImages([]);
      setPreviews([]);
    } catch (err: any) {
      setStatus("error");
      setError(err.message ?? "Submission failed — please try again or reach us on WhatsApp.");
    }
  }

  const busy = status === "uploading" || status === "submitting";

  return (
    <div className="bg-black text-white min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/DUSSE%20X%20NOSTRA-55.jpeg"
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />
        {/* Fade to black at the bottom so form section blends in */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 50%, #000 100%)" }} />

        {/* Content */}
        <div className="relative z-10 px-6 py-28 max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-[var(--color-gold)] mb-4">Promoters</p>
          <h1 className="text-5xl sm:text-7xl font-black uppercase leading-[0.9] mb-6">
            Join the<br />
            <span className="text-[var(--color-gold)]">Team</span>
          </h1>
          <p className="text-white/70 max-w-xl text-base leading-relaxed">
            OnCue Marketing works with brand ambassadors and promoters across Johannesburg, Cape Town, and Durban.
            Fill in the form below and we'll be in touch if you're a good fit.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        {status === "success" ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-[var(--color-gold)] text-4xl font-black uppercase tracking-widest">✓</p>
            <p className="text-2xl font-black uppercase">Application received</p>
            <p className="text-white/50">We'll review your application and reach out if you're a match.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-8">

            {/* Personal */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-bold mb-6">Personal Details</h2>
              <div className="space-y-6">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input required maxLength={120} className={inputCls} placeholder="Your full name" {...f("name")} />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelCls}>Age</label>
                    <input required maxLength={3} className={inputCls} placeholder="e.g. 23" {...f("age")} />
                  </div>
                  <div>
                    <label className={labelCls}>Location (City)</label>
                    <input required maxLength={80} className={inputCls} placeholder="e.g. Johannesburg" {...f("location")} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Phone Number <span className="normal-case text-white/40 tracking-normal">(WhatsApp &amp; calls)</span></label>
                  <input required maxLength={20} className={inputCls} placeholder="+27 60 000 0000" {...f("phone")} />
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-bold mb-6">Measurements</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>Height</label>
                  <input required maxLength={15} className={inputCls} placeholder="e.g. 1.72m" {...f("height")} />
                </div>
                <div>
                  <label className={labelCls}>Dress Size</label>
                  <input required maxLength={10} className={inputCls} placeholder="e.g. 34, S, M" {...f("dress_size")} />
                </div>
                <div>
                  <label className={labelCls}>Top Size</label>
                  <input required maxLength={10} className={inputCls} placeholder="e.g. S, M, L" {...f("top_size")} />
                </div>
                <div>
                  <label className={labelCls}>Pant Size</label>
                  <input required maxLength={10} className={inputCls} placeholder="e.g. 32, 34" {...f("pant_size")} />
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-bold mb-6">About You</h2>
              <div>
                <label className={labelCls}>Brief description of yourself</label>
                <textarea required maxLength={1500} rows={5} className={`${inputCls} resize-none`}
                  placeholder="Tell us about yourself — your experience, personality, availability, and why you want to work with OnCue"
                  {...f("description")} />
                <p className="text-[11px] text-white/30 mt-1">{form.description.length}/1500</p>
              </div>
            </div>

            {/* Photos */}
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)] font-bold mb-2">Photos</h2>
              <p className="text-white/40 text-xs mb-6">
                Upload exactly 4 photos — a clear face shot, a full-body shot, and two others showing your style.
                Photos are compressed automatically to save space.
              </p>

              <div className="grid grid-cols-4 gap-3 mb-4">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="aspect-square border border-white/15 relative overflow-hidden">
                    {previews[i] ? (
                      <>
                        <img src={previews[i]} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-red-600 transition"
                        >
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-1">
                        <ImagePlus size={18} />
                        <span className="text-[10px] uppercase tracking-wider">Photo {i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onFileChange}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="flex items-center gap-2 border border-white/20 px-5 py-3 text-xs uppercase tracking-widest text-white/70 hover:border-white/50 hover:text-white transition disabled:opacity-40"
              >
                <Upload size={13} />
                {images.length === 0 ? "Select Photos" : `${images.length} selected — change`}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {busy && <p className="text-white/50 text-sm">{progress}</p>}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 bg-[var(--color-gold)] text-black px-10 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {busy ? progress : "Submit Application"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
