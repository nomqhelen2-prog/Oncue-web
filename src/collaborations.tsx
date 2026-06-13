import { images } from "./assets/images";

export default CollabPage;

const collabs = [
  { name: "Rolex",                   tag: "Luxury Retail",       img: images.collaborations.rolex,                type: "portrait" },
  { name: "Nespresso",               tag: "In-store Sampling",   img: images.collaborations.nespresso,            type: "portrait" },
  { name: "D'Ussé x Ashmed Hour",    tag: "Brand Activation",    img: images.collaborations.dusseAshmedHour,      type: "portrait" },
  
 { name: "D'Ussé",                  tag: "Instore Activations", img: images.collaborations.dusse },
 { name: "FNB",                     tag: "Corporate",           img: images.collaborations.fnb },
  {name: "Private Patrón Masterclass", tag: "Intimate Activation", img: images.collaborations.patronPrivate,     type: "portrait" },
   { name: "Luxe Awards 2026",        tag: "Awards Hospitality",  img: images.collaborations.luxeAwards,          type: "medium" },
  { name: "Tempo",                     tag: "Corporate",           img: images.collaborations.tempo, type: "portrait" },
  { name: "Patrón x Formula 1",      tag: "Luxury Spirits",      img: images.collaborations.patronFormula },
  { name: "Homie Lover Friend",       tag: "Lifestyle Campaign",  img: images.collaborations.homieBombay,         type: "portrait" },
  { name: "Comfort Fabric Softener", tag: "Product Launch",      img: images.collaborations.comfortFabricSoftener, type: "portrait" },
  { name: "Shaka Ilembe",            tag: "Film Premier",        img: images.collaborations.shakaIlembePremier,  type: "portrait" },
  { name: "Ayoosh Global",           tag: "Product Launch",      img: images.collaborations.ayooshGlobalLaunch,  type: "medium" },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-[400px]">
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
