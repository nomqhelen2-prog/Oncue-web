import { useState, useEffect } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { images } from "./assets/images";

export default Index;

const portfolioItems = [
  { img: images.home.carousel.slide1, label: "Brand Activation", client: "Ayoosh Global Launch" },
  { img: images.home.carousel.slide2, label: "Corporate Event",  client: "D'Ussé × Ashmed Hour" },
  { img: images.home.carousel.slide3, label: "Brand Activation", client: "Patrón Tequila"       },
];

const brandsRow1 = [
  { name: "ROLEX",   font: "'Cormorant Garamond', serif" },
  { name: "NESPRESSO", font: "'Cinzel', serif" },
  { name: "D'USSÉ",  font: "'Playfair Display', serif" },
  { name: "PATRÓN",  font: "'Libre Baskerville', serif" },
  { name: "FNB",     font: "'Bebas Neue', sans-serif" },
  { name: "AYOOSH",  font: "'Raleway', sans-serif" },
  { name: "COMFORT", font: "'Nunito', sans-serif" },
  { name: "TEMPO",   font: "'Montserrat', sans-serif" },
];

const brandsRow2 = [
  { name: "HOMIE LOVER FRIEND",  font: "'Playfair Display', serif" },
  { name: "BOMBAY SAPPHIRE",     font: "'Cormorant Garamond', serif" },
  { name: "SHAKA ILEMBE",        font: "'Cinzel', serif" },
  { name: "LUXE AWARDS",         font: "'Libre Baskerville', serif" },
  { name: "FORMULA 1",           font: "'Bebas Neue', sans-serif" },
  { name: "ONCUE MARKETING",     font: "'Montserrat', sans-serif" },
];

const brandsRow3 = [
  { name: "BRAND ACTIVATIONS",       font: "'Raleway', sans-serif" },
  { name: "EXPERIENTIAL MARKETING",  font: "'Montserrat', sans-serif" },
  { name: "PROMOTIONAL STAFFING",    font: "'Cinzel', serif" },
  { name: "PRODUCT LAUNCHES",        font: "'Playfair Display', serif" },
  { name: "CORPORATE EVENTS",        font: "'Cormorant Garamond', serif" },
  { name: "IN-STORE ACTIVATIONS",    font: "'Libre Baskerville', serif" },
];

function MarqueeRow({
  brands,
  reverse = false,
  slow = false,
}: {
  brands: { name: string; font: string }[];
  reverse?: boolean;
  slow?: boolean;
}) {
  const trackClass = reverse
    ? "marquee-track marquee-track--reverse"
    : slow
    ? "marquee-track marquee-track--slow"
    : "marquee-track";

  return (
    <div className="marquee-row py-2">
      <div className={trackClass}>
        <span className="marquee-inner">
          {brands.map((b, i) => (
            <span key={i} className="marquee-brand" style={{ fontFamily: b.font }}>
              {b.name}
              <span className="marquee-dot mx-3">·</span>
            </span>
          ))}
        </span>
        <span className="marquee-inner" aria-hidden="true">
          {brands.map((b, i) => (
            <span key={i} className="marquee-brand" style={{ fontFamily: b.font }}>
              {b.name}
              <span className="marquee-dot mx-3">·</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

function Index() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setCurrentIndex((i) => (i + 1) % portfolioItems.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + portfolioItems.length) % portfolioItems.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, currentIndex]);

  return (
    <div id="home" className="bg-black text-white">
      {/* ── Hero ── */}
      <section className="hero oncue-background">
        <img
          className="hero-image"
          src={images.home.heroBackground}
          alt=""
          aria-hidden="true"
        />
        <div className="hero-overlay" />
        <div className="hero-copy">
          <div className="hero-content hero-content--right">
            <h1 className="hero-title hero-title--right" aria-label="OnCue Marketing">
              <span className="hero-title-line hero-title-line-top">OnCue</span>
              <span className="hero-title-line hero-title-line-bottom">MARKETING</span>
            </h1>
          </div>
          <p className="tagline hero-tagline">TURNING YOUR BRAND GOALS INTO SHARED WINS</p>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="home-overview" className="panel max-w-7xl mx-auto py-24 px-6 border-b border-white/10">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6">
            <img
              src={images.home.aboutImage}
              alt="OnCue Marketing team"
              className="w-full aspect-[4/3] object-cover object-center"
            />
          </div>
          <div className="md:col-span-6">
<h2 className="text-4xl md:text-6xl font-black mb-8 uppercase leading-tight">Who we are</h2>
            <p className="text-white/80 text-lg max-w-3xl mb-8 leading-relaxed">
              OnCue Marketing is a dynamic experiential and promotional marketing agency, partnering with brands and event companies to deliver impactful, memorable brand experiences. We translate brand ambition into immersive moments that captivate audiences.
            </p>
            <Link
              to="/about"
              className="text-[var(--color-gold)] font-bold tracking-wider hover:underline inline-flex items-center gap-2 uppercase text-sm"
            >
              Read Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Portfolio Carousel ── */}
      <section
        id="home-portfolio"
        className="panel max-w-7xl mx-auto py-24 px-6 border-b border-white/10 relative"
      >
        <div className="mb-16">
<h2 className="text-xl sm:text-4xl md:text-6xl font-black uppercase tracking-tight">
            OUR COLLABORATIONS
          </h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slide track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {portfolioItems.map((item, idx) => (
                <div key={idx} className="w-full flex-shrink-0 relative h-[600px]">
                  <img
                    src={item.img}
                    alt={item.client}
                    className="w-full h-full object-contain object-top bg-black"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-8 py-6">
                    <p className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-white font-black text-2xl uppercase tracking-wide">
                      {item.client}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev arrow */}
          <button
            onClick={() => { prev(); setPaused(false); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next arrow */}
          <button
            onClick={() => { next(); setPaused(false); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:text-black transition"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-3 mt-6">
          {portfolioItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-[var(--color-gold)] w-6" : "bg-white/30 w-2"
              }`}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/collaborations"
            className="text-[var(--color-gold)] font-bold tracking-wider hover:underline inline-flex items-center gap-2 uppercase text-sm"
          >
            View All Collaborations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="home-contact" className="panel max-w-6xl mx-auto py-24 px-6">
        <div className="bg-[#1a1a1a] p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase text-white">
            Connect with us
          </h2>
          <p className="text-white text-lg mb-8">
            Partner with us | Join our promoter team
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[var(--color-gold)] text-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition"
          >
            Contact Us Now
          </Link>
        </div>
      </section>

      {/* ── Brand Marquee ── */}
      <div className="brand-marquee-section py-8 overflow-hidden">
        <MarqueeRow brands={brandsRow1} />
        <MarqueeRow brands={brandsRow2} reverse />
        <MarqueeRow brands={brandsRow3} slow />
      </div>
    </div>
  );
}
