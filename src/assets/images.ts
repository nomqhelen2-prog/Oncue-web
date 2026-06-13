const img = (filename: string) => `/images/${encodeURIComponent(filename)}`;

export const images = {
  // ── Homepage sections ────────────────────────────────────────────────────
  home: {
    // Main hero background (full-screen image behind the title)
    heroBackground: img("background2.png"),

    // "Who we are" about section image
    aboutImage: img("IMG_2122.jpeg"),

    // Carousel slides — swap filenames here to change each slide
    carousel: {
      slide1: img("Ayoosh Global Launch.jpeg"),   // Brand Activation
      slide2: img("D'usse X Ashmed Hour.jpeg"),    // Corporate Event
      slide3: img("IMG_8964.jpeg"),                // Brand Activation — Patrón
    },
  },

  // ── About page ───────────────────────────────────────────────────────────
  about: {
    elAlta: img("el alta.jpeg"),
    img8975: img("IMG_8975.jpeg"),
    activation: img("c5079eb0-3b8f-49a3-b67e-8ce8cd351923.jpeg"),
    aboutUs3: img("ayoosh.jpeg"),
    img1403: img("IMG_1403.jpeg"),
  },

  // ── Services page ────────────────────────────────────────────────────────
  servicesBackground: img("c5079eb0-3b8f-49a3-b67e-8ce8cd351923.jpeg"),

  // ── Contact page ─────────────────────────────────────────────────────────
  contact: img("Copy of 303.jpeg"),
  collaborations: {
    nespresso:            img("Nespresso.jpeg"),
    dusseAshmedHour:      img("D'usse X Ashmed Hour.jpeg"),
    dusse:                img("DUSSE.jpeg"),
    fnb:                  img("FNB.jpeg"),
    luxeAwards:           img("Luxe Awards 2026.jpeg"),
    rolex:                img("Rolex.jpeg"),
    shakaIlembePremier:   img("Shaka Ilembe Premier.jpeg"),
    ayooshGlobalLaunch:   img("Ayoosh Global Launch.jpeg"),
    comfortFabricSoftener:img("Comfort Fabric Softener.jpeg"),
    patronFormula:        img("Patron x Formula 1.jpeg"),
    patronPrivate:        img("Patron.jpeg"),
    homieBombay:          img("Homie Lover Friend x Bombay Saphire.jpeg"),
    tempo:                img("tempo.JPG"),
  },
} as const;
