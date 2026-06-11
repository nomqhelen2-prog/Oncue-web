import { Starburst } from "@/components/Starburst";
import { images } from "./assets/images";

export default CollabPage;

const collabs: { name: string; tag?: string; img: string; span?: string }[] = [
  { name: "Rolex", tag: "Luxury Retail", img: images.collaborations.rolex, span: "md:row-span-2" },
  { name: "Nespresso", tag: "In-store Sampling", img: images.collaborations.nespresso },
  { name: "D'Ussé x Ashmed Hour", tag: "Brand Activation", img: images.collaborations.dusseAshmedHour, span: "md:row-span-2" },
  { name: "D'Ussé", tag: "Instore Activations", img: images.collaborations.dusse },
  { name: "SA Rugby Awards", tag: "Sports Hospitality", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80" },
  { name: "Patrón x Formula 1", tag: "Luxury Spirits", img: images.collaborations.patronFormula },
  { name: "Private Patrón Masterclass", tag: "Intimate Activation", img: images.collaborations.patronPrivate },
  { name: "Homie Lover Friend x Bombay Sapphire", tag: "Lifestyle Campaign", img: images.collaborations.homieBombay },
  { name: "FNB", tag: "Corporate", img: images.collaborations.fnb },
  { name: "Luxe Awards 2026", tag: "Awards Hospitality", img: images.collaborations.luxeAwards },
  { name: "Isibaya / Ishaka Ilembe Premier", tag: "Film Premier", img: images.collaborations.shakaIlembePremier },
  { name: "Ayoosh Global Launch", tag: "Product Launch", img: images.collaborations.ayooshGlobalLaunch },
  { name: "El Patron Launch", tag: "Spirits Launch", img: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&w=900&q=80" },
  { name: "Comfort Fabric Softener", tag: "Consumer Brand", img: images.collaborations.comfortFabricSoftener },
];

function CollabPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <Starburst className="absolute top-10 right-10 w-24 h-24 text-white/80" />
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-gold)] mb-6">Company Profile / 2026</p>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight">Brand<br/>Collaborations</h1>
          <p className="mt-8 max-w-3xl text-white/80 text-lg leading-relaxed">
            OnCue Marketing has proudly supported a range of brands and event agencies through professional staffing, brand activations, and experiential marketing support. We welcome opportunities to collaborate with brands, agencies and event companies looking to deliver exceptional experiences.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-3">
          {collabs.map((c) => (
            <figure key={c.name} className={`relative overflow-hidden group ${c.span ?? ""}`}>
              <img
                src={c.img}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
              <figcaption className="absolute top-2 left-2 bg-black/80 text-white text-[9px] md:text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 border border-white/10">
                {c.name}
              </figcaption>
              {c.tag && (
                <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-[var(--color-gold)] font-bold">
                  {c.tag}
                </span>
              )}
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
