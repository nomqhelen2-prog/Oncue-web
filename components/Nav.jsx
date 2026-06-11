import './Nav.css';

export default function Nav({ sections = [] } = {}) {
  const nav = document.createElement('nav');
  nav.className = 'topbar';
  nav.setAttribute('aria-label', 'Section navigation');

  const brand = document.createElement('div');
  brand.className = 'brand';
  brand.textContent = 'OnCue';

  const links = document.createElement('div');
  links.className = 'nav-links';

  const items = sections.length
    ? sections
    : [
        { href: '/', label: 'Home' },
        { href: '/about.html', label: 'About' },
        { href: '/services.html', label: 'Services' },
        { href: '/contact.html', label: 'Contact' },
      ];

  items.forEach(({ href, label }) => {
    const anchor = document.createElement('a');
    anchor.className = 'nav-link';
    anchor.href = href;
    anchor.textContent = label;
    links.appendChild(anchor);
  });

  nav.appendChild(brand);
  nav.appendChild(links);

  const updateSolid = () => {
    const home = document.getElementById('home');
    if (!home) {
      nav.classList.remove('solid');
      return;
    }
    const boundary = home.offsetHeight - 80;
    nav.classList.toggle('solid', window.scrollY > boundary);
  };

  window.addEventListener('scroll', updateSolid, { passive: true });
  updateSolid();

  return nav;
}
