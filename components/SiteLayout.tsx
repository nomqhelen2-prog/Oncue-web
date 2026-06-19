import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, Instagram } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

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

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  // Scroll-driven image scale effect — re-runs on every route change
  useEffect(() => {
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          el.style.transform = `scale(${0.97 + entry.intersectionRatio * 0.03})`;
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
              loading="lazy"
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
            Connect With Us
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
      <footer className="border-t border-white/10 bg-black text-white/85">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          {/* Brand Block */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-start gap-3 mb-4">
              <img
                src="/logoonly.png"
                alt="OnCue Marketing"
                className="w-8 h-8 object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
                loading="lazy"
              />
              <span
                style={{ fontFamily: "'Montserrat', Arial, sans-serif" }}
                className="font-black tracking-widest text-white"
              >
                OnCue <strong>MARKETING</strong>
              </span>
            </div>
            <p className="text-sm max-w-md">
              Experiential and Promotional Marketing agency: turning brand goals into shared wins across Johannesburg, Cape Town and Durban.
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
                  <WhatsAppIcon className="w-4 h-4 text-[var(--color-gold)]" />
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
