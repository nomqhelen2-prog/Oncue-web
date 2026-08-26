const img = (filename: string) => `/images/${encodeURIComponent(filename)}`;

export const images = {
  // ── Homepage sections ────────────────────────────────────────────────────
  home: {
    // Main hero background (full-screen image behind the title)
    heroBackground: img("Oncue homepage background.png"),

    // "Who we are" about section image
    aboutImage: img("IMG_2122.jpeg"),

    // Carousel slides — swap filenames here to change each slide
    carousel: {
      slide1: img("Ayoosh Global Launch.jpeg"),   // Brand Activation
      slide2: img("D'usse X Ashmed Hour.jpeg"),    // Corporate Event
      slide3: img("IMG_8964.JPG"),                  // Brand Activation — Patrón
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
    nespresso:            "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Nespresso.webp",
    dusseAshmedHour:      "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/D%27usse%20X%20Ashmed%20Hour.jpeg",
    dusse:                "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/DUSSE.jpeg",
    fnb:                  "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/FNB.webp",
    luxeAwards:           "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Luxe%20Awards%202026.jpeg",
    rolex:                "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Rolex.webp",
    shakaIlembePremier:   "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Shaka%20Ilembe%20Premier.jpeg",
    ayooshGlobalLaunch:   "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Ayoosh%20Global%20Launch.webp",
    comfortFabricSoftener:"https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Comfort%20Fabric%20Softener.webp",
    patronFormula:        "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Patron%20x%20Formula%201.jpeg",
    patronPrivate:        "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Patron.webp",
    homieBombay:          "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Homie%20Lover%20Friend%20x%20Bombay%20Saphire.webp",
    maxhosaKultureFestival:"https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Maxhosa%20Kulture%20Festival.webp",
    dusse2:                "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Dusse%20Instore%20Activation.webp",
    gwmWomenWhoMoveUs:     "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/GMW.webp",
    gwmRegistration:       "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/GMW%20Registration.webp",
    ldvLaunch:             "https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/LDV.webp",
  },
} as const;
