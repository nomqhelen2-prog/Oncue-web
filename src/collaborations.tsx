import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { images } from "./assets/images";
import { ProgressiveImage } from "./components/ProgressiveImage";

export default CollabPage;

const B = "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Logos/";

type Category = "All" | "Spirits & Beverages" | "Luxury & Lifestyle" | "Events & Entertainment" | "Finance";

const brandLogos: { name: string; logo: string; url: string | null; category: Category }[] = [
  { name: "Rolex",                        logo: `${B}rolex-removebg-preview.png`,                                          url: "https://www.rolex.com",              category: "Luxury & Lifestyle" },
  { name: "Nespresso",                    logo: `${B}nespresso-removebg-preview.png`,                                      url: "https://www.nespresso.com",          category: "Spirits & Beverages" },
  { name: "D'Ussé",                       logo: `${B}d_usse-removebg-preview.png`,                                         url: "https://www.dusse.com",              category: "Spirits & Beverages" },
  { name: "FNB",                          logo: `${B}fnb-removebg-preview.png`,                                            url: "https://www.fnb.co.za",              category: "Finance" },
  { name: "Patrón",                       logo: `${B}patron_tequila-removebg-preview.png`,                                 url: "https://www.patrontequila.com",      category: "Spirits & Beverages" },
  { name: "Formula 1",                    logo: `${B}f1-removebg-preview.png`,                                             url: "https://www.formula1.com",           category: "Events & Entertainment" },
  { name: "Bombay Sapphire",              logo: `${B}bombay-removebg-preview.png`,                                         url: "https://www.bombaysapphire.com",     category: "Spirits & Beverages" },
  { name: "Comfort",                      logo: `${B}comfort-removebg-preview.png`,                                        url: "https://www.comfortfabriccare.com",  category: "Luxury & Lifestyle" },
  { name: "Ayoosh",                       logo: `${B}ayoosh-removebg-preview.png`,                                         url: "https://www.ayoosh.co.za",           category: "Luxury & Lifestyle" },
  { name: "Homie Lover Friend x Bombay", logo: `${B}Homie_Lover_Friend_x_Bombay_Saphire_logo-removebg-preview.png`,       url: "https://www.bombaysapphire.com",     category: "Events & Entertainment" },
  { name: "Shaka Ilembe",                logo: `${B}shaka-removebg-preview.png`,                                          url: "https://www.shakailembe.co.za",      category: "Events & Entertainment" },
  { name: "Luxe Awards",                 logo: `${B}luxe-removebg-preview.png`,                                           url: null,                                 category: "Events & Entertainment" },
  { name: "GWM",                         logo: "/images/women who move us-cropped.webp",                                    url: "https://www.gwm.co.za",              category: "Luxury & Lifestyle" },
  { name: "LDV",                         logo: "/images/ldv logo-cropped.webp",                                             url: "https://www.ldv.co.za",              category: "Luxury & Lifestyle" },
];

const CATEGORIES: Category[] = ["All", "Spirits & Beverages", "Luxury & Lifestyle", "Events & Entertainment", "Finance"];

function LogoCard({ name, logo, url }: { name: string; logo: string; url: string | null }) {
  const [failed, setFailed] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const initials = name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 3);

  const inner = (
    <div className="aspect-[4/3] bg-white rounded-2xl relative flex items-center justify-center p-6 transition-all duration-300 group-hover:shadow-[0_0_0_2px_var(--color-gold)] group-hover:scale-[1.03] overflow-hidden">
      {logo && !failed ? (
        <>
          {/* Skeleton pulse until logo loads */}
          {!logoLoaded && (
            <div className="absolute inset-4 bg-gray-100 animate-pulse rounded-lg" />
          )}
          <img
            src={logo}
            srcSet={`${logo} 1x`}
            alt={name}
            className={`w-4/5 h-4/5 object-contain transition-opacity duration-400 ${logoLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLogoLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      ) : (
        <span className="text-black font-black text-lg tracking-widest text-center leading-tight">
          {initials}
        </span>
      )}
      {/* Name tooltip — absolute so it never affects card height */}
      <p className="absolute bottom-3 left-0 right-0 text-black/50 text-[10px] uppercase tracking-[0.2em] font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {name}
      </p>
    </div>
  );

  return (
    <div className="group cursor-pointer">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

const collabs = [
  { name: "Rolex",                   tag: "Luxury Brand Launches",       img: images.collaborations.rolex,                type: "portrait" },
  { name: "Nespresso",               tag: "Corporate Year Ends",   img: images.collaborations.nespresso,            type: "portrait" },
  { name: "D'Ussé x Ashmed Hour",    tag: "Experiential Lifestyle Events",    img: images.collaborations.dusseAshmedHour,      type: "portrait" },

 { name: "D'Ussé",                  tag: "Brand Activation", img: images.collaborations.dusse },
 { name: "FNB",                     tag: "Corporate Gatherings",           img: images.collaborations.fnb },
  { name: "Patrón", tag: "Intimate Brand Events", img: images.collaborations.patronPrivate, type: "portrait" },
   { name: "Luxe Awards 2026",        tag: "Hospitality Awards",  img: images.collaborations.luxeAwards,          type: "medium" },

  { name: "Patrón x Formula 1",      tag: "Watch Party",      img: images.collaborations.patronFormula },
  { name: "Homie Lover Friend x Bombay",       tag: "Lifestyle Events",  img: images.collaborations.homieBombay,         type: "portrait" },
  { name: "Comfort", tag: " Influencer Party",      img: images.collaborations.comfortFabricSoftener, type: "portrait" },
  { name: "Shaka Ilembe",            tag: "Film Premier",        img: images.collaborations.shakaIlembePremier,  type: "portrait" },
  { name: "Ayoosh Global",           tag: "Product Launch",      img: images.collaborations.ayooshGlobalLaunch,  type: "medium" },
  { name: "Maxhosa Kulture Festival", tag: "Festival",  img: images.collaborations.maxhosaKultureFestival, type: "portrait" },
  { name: "D'Ussé",                  tag: "In-Store Activation",          img: images.collaborations.dusse2,            type: "portrait" },
  { name: "GWM — Women Who Move Us", tag: "Women's Lifestyle Event",      img: images.collaborations.gwmWomenWhoMoveUs, type: "portrait" },
  { name: "LDV",                     tag: "Vehicle Launch Event",         img: images.collaborations.ldvLaunch,         type: "portrait" },
];

function CollabPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = activeCategory === "All"
    ? brandLogos
    : brandLogos.filter(b => b.category === activeCategory);

  return (
    <div className="bg-black text-white min-h-screen">

      {/* ── Brands section ── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-16 border-b border-white/10">

        {/* Top: left-aligned text */}
        <div className="mb-10">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.9] mb-6">
            Brands that have<br />Trusted Us
          </h2>
          <p className="text-white text-base leading-relaxed max-w-2xl mb-8">
            OnCue Marketing has proudly supported a range of brands and event agencies through
            professional staffing, brand activations and experiential marketing support. We welcome
            opportunities to collaborate with brands, agencies and event companies looking to deliver
            exceptional experiences.
          </p>
          <p className="text-[var(--color-gold)] text-sm tracking-widest uppercase mb-4">
            Select a category to filter
          </p>
        </div>

        {/* Category filter dropdown */}
        <div className="flex justify-start mb-10 relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-3 border border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:border-[var(--color-gold)] transition-colors min-w-[220px] justify-between"
          >
            <span>{activeCategory}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full mt-1 left-0 bg-[#111] border border-white/15 z-20 min-w-[220px] shadow-2xl">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setDropdownOpen(false); }}
                  className={`w-full text-left px-6 py-3 text-sm uppercase tracking-widest font-bold transition-colors hover:bg-white/5 ${
                    activeCategory === cat ? "text-[var(--color-gold)]" : "text-white/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filtered.map((b) => (
            <LogoCard key={b.name} name={b.name} logo={b.logo} url={b.url} />
          ))}
        </div>

      </section>

      {/* ── Collaborations heading + photo grid ── */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight mb-10">
          Our Collaborations
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 auto-rows-[400px]">
          {collabs.map((c, idx) => (
            <figure
              key={c.name}
              className={`relative overflow-hidden rounded-3xl group cursor-pointer ${
                c.type === "portrait"
                  ? "md:row-span-2"
                  : c.type === "medium"
                  ? ""
                  : "md:row-span-1"
              }`}
            >
              <ProgressiveImage
                src={c.img}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                skeletonClass="bg-gray-900"
                sizes="(max-width: 768px) 100vw, 50vw"
                objectPosition="center 20%"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <figcaption className="absolute bottom-6 left-6 text-white">
                <p className="text-2xl font-bold uppercase tracking-widest">{c.name}</p>
                {c.tag && (
                  <p className="text-xs text-[var(--color-gold)] uppercase tracking-widest mt-2 font-semibold">
                    {c.tag}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

    </div>
  );
}
