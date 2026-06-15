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
    nespresso:            img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Nespresso.webp"),
    dusseAshmedHour:      img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/D%27usse%20X%20Ashmed%20Hour.jpeg"),
    dusse:                img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/DUSSE.jpeg"),
    fnb:                  img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/FNB.webp"),
    luxeAwards:           img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Luxe%20Awards%202026.jpeg"),
    rolex:                img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Rolex.webp"),
    shakaIlembePremier:   img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Shaka%20Ilembe%20Premier.jpeg"),
    ayooshGlobalLaunch:   img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Ayoosh%20Global%20Launch.webp"),
    comfortFabricSoftener:img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Comfort%20Fabric%20Softener.webp"),
    patronFormula:        img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Patron%20x%20Formula%201.jpeg"),
    patronPrivate:        img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/Patron.webp"),
    homieBombay:          img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/IMG_2122.webp"),
    tempo:                img("https://sjqncrtrprldnmfg.public.blob.vercel-storage.com/tempo.webp"),
  },
} as const;
