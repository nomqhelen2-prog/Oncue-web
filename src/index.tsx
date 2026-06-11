import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { images } from "./assets/images";

export default Index;

function Index() {
  return (
    <div id="home" className="bg-black text-white">
      <section className="hero oncue-background">
        <img
          className="hero-image"
          src={images.heroBackground}
          alt=""
          aria-hidden="true"
        />
        <div className="hero-copy">
          <div className="hero-content">
            <h1 className="hero-title" aria-label="OnCue Marketing">
              <span className="hero-title-line hero-title-line-top">ONCUE</span>
              <span className="hero-title-line hero-title-line-bottom">MARKETING</span>
            </h1>
          </div>
          <p className="tagline hero-tagline">TURNING YOUR BRAND GOALS IN SHARED WINS</p>
        </div>
      </section>

      <section id="home-overview" className="panel max-w-6xl mx-auto py-24 px-6 border-b border-white/10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="panel-index text-[var(--color-gold)] font-bold uppercase tracking-widest block mb-2 text-sm">01 · About Us</span>
            <p className="panel-kicker text-white/50 uppercase tracking-wider text-xs mb-1">Overview</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase leading-tight">What we do</h2>
            <p className="text-white/80 text-lg max-w-3xl mb-8 leading-relaxed">
              OnCue Marketing is a dynamic experiential and promotional marketing agency, partnering with brands and event companies to deliver impactful, memorable brand experiences. We translate brand ambition into immersive moments that captivate audiences.
            </p>
            <Link to="/about" className="text-[var(--color-gold)] font-bold tracking-wider hover:underline inline-flex items-center gap-2 uppercase text-sm">
              Read Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="home-portfolio" className="panel max-w-6xl mx-auto py-24 px-6 border-b border-white/10">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="panel-index text-[var(--color-gold)] font-bold uppercase tracking-widest block mb-2 text-sm">02 · Portfolio</span>
            <p className="panel-kicker text-white/50 uppercase tracking-wider text-xs mb-1">Selected work</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase leading-tight">Selected work</h2>
            <p className="text-white/80 text-lg max-w-3xl mb-8 leading-relaxed">
              Explore our proudest activations, featuring high-profile executions for world-class luxury brands, athletic events, and public campaigns across major metropolitan hubs.
            </p>
            <Link to="/collaborations" className="text-[var(--color-gold)] font-bold tracking-wider hover:underline inline-flex items-center gap-2 uppercase text-sm">
              View Collaborations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section id="home-contact" className="panel max-w-6xl mx-auto py-24 px-6">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <span className="panel-index text-[var(--color-gold)] font-bold uppercase tracking-widest block mb-2 text-sm">03 · Get in touch</span>
            <p className="panel-kicker text-white/50 uppercase tracking-wider text-xs mb-1">Start a conversation</p>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase leading-tight">Start a conversation</h2>
            <p className="text-white/80 text-lg max-w-3xl mb-8 leading-relaxed">
              Ready to activate your brand? Get in touch with our operations teams across Johannesburg, Cape Town, and Durban.
            </p>
            <Link to="/contact" className="inline-block bg-[var(--color-gold)] text-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition">
              Contact Us Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
