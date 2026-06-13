import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, Instagram } from "lucide-react";

const nav = [
  { href: "/",               label: "Home" },
  { href: "/about",          label: "About" },
  { href: "/services",       label: "Services" },
  { href: "/collaborations", label: "Collaborations" },
  { href: "/contact",        label: "Contact" },
] as const;

interface SiteLayoutProps {
  children: ReactNode;
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll-driven image scale effect — re-runs on every route change
  useEffect(() => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          el.style.transform = `scale(${0.93 + entry.intersectionRatio * 0.07})`;
        });
      },
      { threshold: thresholds }
    );

    const imgs = document.querySelectorAll<HTMLElement>(
      'img[src*="/images/"], img[src*=".jpeg"], img[src*=".jpg"], img[src*=".JPG"]'
    );
    imgs.forEach((img) => observer.observe(img));
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logoonly.png"
              alt="OnCue Marketing"
              className="w-6 h-6 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span
              style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
              className="text-sm tracking-widest text-white"
            >
              OnCue <strong>MARKETING</strong>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link
            to="/contact"
            className="hidden md:inline-flex bg-[var(--color-gold)] text-black px-5 py-2 text-xs font-black uppercase tracking-widest hover:bg-[var(--color-gold-deep)] transition"
          >
            Start a project
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black">
            <div className="px-6 py-4 flex flex-col gap-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-bold uppercase tracking-widest text-white/90 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black text-white/70">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          {/* Brand Block */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-start gap-3 mb-4">
              <img
                src="/logoonly.png"
                alt="OnCue Marketing"
                className="w-8 h-8 object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <span
                style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
                className="font-black tracking-widest text-white"
              >
                OnCue <strong>MARKETING</strong>
              </span>
            </div>
            <p className="text-sm max-w-md">
              Experiential and promotional marketing agency turning brand goals into shared wins across Johannesburg, Cape Town and Durban.
            </p>
          </div>

          {/* Navigate Block */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">Navigate</p>
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="hover:text-[var(--color-gold)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Block */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white mb-4">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://wa.me/27601064358"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-gold)] transition-colors"
                >
                  <Phone className="w-4 h-4 text-[var(--color-gold)]" />
                  +27 60 106 4358
                </a>
              </li>
              <li>
                <a
                  href="mailto:admin@oncuemarketing.info"
                  className="flex items-center gap-2 hover:text-[var(--color-gold)] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[var(--color-gold)]" />
                  admin@oncuemarketing.info
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/oncuemarketing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--color-gold)] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[var(--color-gold)]" />
                  @oncuemarketing
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 py-6 text-center text-xs uppercase tracking-widest text-white/40">
          © {new Date().getFullYear()} OnCue Marketing — JHB | CPT | DBN
        </div>
      </footer>
    </div>
  );
}
