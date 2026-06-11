import { Sparkles, Users, Rocket, Crown, Megaphone } from "lucide-react";
import { Starburst } from "@/components/Starburst";
import { images } from "./assets/images";

export default ServicesPage;

const services = [
  {
    icon: Sparkles,
    title: "Experiential Marketing & Brand Activations",
    body: "Bring brands to life through immersive consumer experiences that turn passive audiences into loyal advocates.",
  },
  {
    icon: Users,
    title: "Event Coordination & Promotional Staffing",
    body: "Seamless personnel management for corporate events, product launches and large-scale brand campaigns.",
  },
  {
    icon: Rocket,
    title: "Product Launches & Corporate Brand Experiences",
    body: "Tailored designs engineered to generate intense excitement and undeniable market impact on day one.",
  },
  {
    icon: Crown,
    title: "Professional Brand Ambassadors",
    body: "Hostesses and promoters who represent your brand with absolute confidence, eloquence and professionalism.",
  },
  {
    icon: Megaphone,
    title: "Campaign Support & Activation Execution",
    body: "End-to-end tactical support built for marketing agencies, event groups and leading commercial brands.",
  },
];

function ServicesPage() {
  return (
    <div className="bg-black text-white">
      <section className="relative border-b border-white/10 overflow-hidden">
        <img src={images.servicesBackground} alt="Premium event activation" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <Starburst className="absolute top-12 right-10 w-28 h-28 text-white" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60 mb-6">Company Profile / 2026</p>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight">Our Services</h1>
          <p className="mt-6 max-w-2xl text-white/80 text-lg">
            OnCue Marketing delivers strategic experiential and promotional solutions designed to elevate brand visibility, engage audiences, and create memorable brand interactions.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-px bg-white/10">
          {services.map(({ icon: Icon, title, body }) => (
            <article key={title} className="bg-black p-8 md:p-10 hover:bg-[var(--color-gold)] hover:text-black transition-colors duration-300 group">
              <Icon className="w-10 h-10 text-[var(--color-gold)] group-hover:text-black mb-6" strokeWidth={1.5} />
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide mb-3 leading-snug">{title}</h3>
              <p className="text-white/75 group-hover:text-black/85 leading-relaxed">{body}</p>
            </article>
          ))}
          <article className="bg-black p-8 md:p-10 flex flex-col justify-center">
            <Starburst className="w-12 h-12 text-white mb-6" />
            <p className="text-white/80 leading-relaxed">
              We provide highly trained teams and seamless operational support, ensuring every activation is executed with <span className="text-[var(--color-gold)] font-bold">precision, professionalism and measurable impact</span>.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
