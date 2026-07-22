import { useState } from "react";
import { images } from "./assets/images";

export default CollabPage;

const W = "https://commons.wikimedia.org/wiki/Special:FilePath/";

const brandLogos = [
  { name: "Rolex",           logo: `${W}Rolex_wordmark_logo.svg` },
  { name: "Nespresso",       logo: `${W}Nespresso_logo_(wordmark).svg` },
  { name: "D'Ussé",          logo: "https://logo.clearbit.com/dusse.com" },
  { name: "FNB",             logo: "https://logo.clearbit.com/fnb.co.za" },
  { name: "Patrón",          logo: "https://logo.clearbit.com/patrontequila.com" },
  { name: "Formula 1",       logo: `${W}Formula_One_logo.svg` },
  { name: "Bombay Sapphire", logo: "https://logo.clearbit.com/bombaysapphire.com" },
  { name: "Comfort",         logo: `${W}Comfort_(fabric_softener)_logo.svg` },
  { name: "Ayoosh",          logo: "https://logo.clearbit.com/ayoosh.co.za" },
  { name: "Maxhosa",         logo: "https://logo.clearbit.com/maxhosa.co.za" },
  { name: "Shaka Ilembe",    logo: null },
  { name: "Luxe Awards",     logo: null },
];

function LogoCell({ name, logo }: { name: string; logo: string | null }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 3);
  return (
    <div className="aspect-square border border-white/10 flex items-center justify-center p-5 bg-white/5">
      {logo && !failed ? (
        <img
          src={logo}
          alt={name}
          className="w-full h-full object-contain"
          style={{ filter: "brightness(0) invert(1)" }}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-[var(--color-gold)] font-black text-lg tracking-widest text-center leading-tight">
          {initials}
        </span>
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
  { name: "D'Ussé",         tag: "In-Store Activation",    img: images.collaborations.dusse2, type: "portrait" },
];

function CollabPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      <section className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-6">
          <h1 className="text-2xl sm:text-4xl md:text-8xl font-black uppercase tracking-tight">
            Brand<br />Collaborations
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pt-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 auto-rows-[400px]">
          {collabs.map((c) => (
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
              <img
                src={c.img}
                alt={c.name}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
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

      {/* ── Brand Logo Grid ── */}
      <section className="max-w-7xl mx-auto px-6 pb-24 border-t border-white/10 pt-12">
        <div className="grid grid-cols-4 gap-px bg-white/10">
          {brandLogos.map((b) => (
            <LogoCell key={b.name} name={b.name} logo={b.logo} />
          ))}
        </div>
      </section>
    </div>
  );
}
