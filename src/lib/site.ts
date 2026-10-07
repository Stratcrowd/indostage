// Single source of truth for site-wide content. Copy mirrors the original indostage.in.

export const site = {
  name: "IndoStage",
  legalName: "IndoStage Creative & Production Pvt. Ltd.",
  url: "https://www.indostage.in",
  tagline: "Where Indian Heritage Meets Global Stages",
  description:
    "A premier cultural and entertainment company dedicated to presenting India's rich artistic legacy to audiences across the world.",
  email: "pradnya@indostage.in",
  phone: "+91 836 984 5536",
  phoneHref: "tel:+918369845536",
  whatsapp: "https://wa.me/918369845536",
  location: "Maharashtra, India",
  founder: "Pradnya Kale",
  // Add real profile URLs here; empty entries are hidden.
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  },
  credit: { name: "Stratcrowd", url: "https://stratcrowd.in" },
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/shivachatrapati", label: "Varsa Shauryacha" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
] as const;

export const stats = [
  { value: 15, suffix: "", label: "Performances" },
  { value: 50, suffix: "", label: "Artists Network" },
  { value: 5, suffix: "", label: "Years Experience" },
  { value: 3, suffix: "", label: "Countries Reached" },
];

export type Service = {
  slug: string;
  title: string;
  kicker: string;
  image: string;
  summary: string;
  intro: string;
  offers: string[];
  closing: string;
};

export const services: Service[] = [
  {
    slug: "classical",
    title: "Classical Music & Dance",
    kicker: "The Divine Essence of Ancient Arts",
    image: "/images/svc-classical.webp",
    summary:
      "Experience the divine essence of Hindustani & Carnatic ragas, the grace of Bharatanatyam, and the storytelling of Kathak—performed by maestros who have dedicated their lives to these ancient arts.",
    intro:
      "We present exceptional performances that embody the depth, purity, and spiritual essence of India's classical traditions. Our curated presentations feature maestros and virtuosos who have dedicated their lives to these sacred art forms.",
    offers: [
      "Hindustani Classical Music featuring legendary vocalists and instrumentalists",
      "Carnatic Music concerts with South India's finest musicians",
      "Bharatanatyam, Kathak, Odissi, Kuchipudi, and Mohiniyattam performances",
      "Instrumental recitals featuring sitar, tabla, sarod, santoor, and veena",
      "Jugalbandis and thematic classical productions",
      "Intimate baithak-style concerts and grand auditorium presentations",
    ],
    closing:
      "Our classical presentations celebrate the ragas of dawn and dusk, the taals that have echoed through millennia, and the mudras that speak the language of the divine.",
  },
  {
    slug: "folk",
    title: "Folk Music & Dance",
    kicker: "Celebrating India's Vibrant Heritage",
    image: "/images/svc-folk.webp",
    summary:
      "From the vibrant energy of Lavani to the mystical rhythms of Gondhal, we bring India's diverse folk traditions from rural heartlands to prestigious stages worldwide.",
    intro:
      "India's soul lives in its villages, and we bring that vibrant spirit to prestigious stages worldwide. Our folk presentations showcase the incredible diversity of India's regional traditions, from the colourful energy of Maharashtra to the rhythmic traditions of every state.",
    offers: [
      "Lavani performances with authentic traditional choreography",
      "Koli dance representing the fishing communities of Maharashtra",
      "Banjara, Gondhal, and Powada—storytelling through movement",
      "Regional folk music featuring traditional instruments",
      "Tribal and rural art forms from across India",
      "Curated folk festivals celebrating regional diversity",
    ],
    closing:
      "We strongly believe in bringing regional and rural artists to the mainstream stage, showcasing the breathtaking diversity of India's cultural fabric to the world.",
  },
  {
    slug: "fusion",
    title: "Conceptual & Fusion Concerts",
    kicker: "Where Tradition Meets Innovation",
    image: "/images/svc-fusion.webp",
    summary:
      "Where tradition meets innovation—our fusion concerts blend the timeless melodies of sitar with contemporary orchestration, creating unforgettable sonic journeys.",
    intro:
      "Innovation and tradition dance together in our fusion productions. We create thematic programs designed for modern audiences while respecting the roots of every art form we touch. These productions offer a refreshing mix of nostalgia, creativity, and global soundscapes.",
    offers: [
      "Live Concert Series of Bollywood classics",
      "Sitar Symphony—Indian classical meets orchestral grandeur",
      "Indian-Western Fusion Ensembles featuring world-class musicians",
      "Jazz blends with Indian classical ragas",
      "All-instrumental shows with contemporary arrangements",
      "Youth-oriented creative experiments and new-age collaborations",
    ],
    closing:
      "Our fusion concerts are sonic journeys that honor tradition while speaking to contemporary sensibilities—a bridge between generations and cultures.",
  },
  {
    slug: "corporate",
    title: "Corporate & Public Events",
    kicker: "Elevating Every Occasion",
    image: "/images/svc-corporate.webp",
    summary:
      "Elevate your corporate gatherings with cultural experiences that leave lasting impressions. Our bespoke productions transform ordinary events into extraordinary memories.",
    intro:
      "Transform your corporate gatherings into cultural experiences that leave lasting impressions. Our professional team brings creativity, seamless execution, and deep audience connect to every event we manage, from intimate corporate dinners to grand public festivals.",
    offers: [
      "Corporate shows with customized cultural programming",
      "Public cultural festivals and city celebrations",
      "Political and promotional events with heritage themes",
      "Historical and heritage theme productions",
      "Product launches with cultural entertainment",
      "Award ceremonies and gala evenings",
    ],
    closing:
      "With a strong execution team and decades of experience, we ensure every event exceeds expectations—delivering professionalism, creativity, and memorable experiences.",
  },
  {
    slug: "film",
    title: "Film & Media Production",
    kicker: "Stories Rooted in Culture",
    image: "/images/svc-film.webp",
    summary:
      "We craft compelling visual narratives that capture the soul of Indian culture—from intimate documentaries to grand musical productions.",
    intro:
      "Our production wing creates compelling visual narratives that capture the soul of Indian culture. We tell stories rooted in culture, history, tradition, and profound human experiences—stories that need to be told and deserve to be seen.",
    offers: [
      "Documentaries exploring cultural traditions and artistic journeys",
      "Short films with cultural and social themes",
      "Web series celebrating Indian heritage",
      "Music albums and live concert recordings",
      "Artist profiles and promotional films",
      "Cultural event documentation and archiving",
    ],
    closing:
      "Every frame we capture, every story we tell, is infused with respect for the traditions we document and love for the artists we feature.",
  },
  {
    slug: "training",
    title: "Training & Workshops",
    kicker: "Nurturing Tomorrow's Maestros",
    image: "/images/svc-training.webp",
    summary:
      "Nurturing the next generation of artists through immersive workshops led by distinguished gurus and contemporary masters of their craft.",
    intro:
      "The traditions we celebrate must be passed on. Our comprehensive training programs are designed to nurture the next generation of artists, providing them with the skills, knowledge, and platform they need to carry these ancient arts into the future.",
    offers: [
      "Acting workshops with theatre veterans",
      "Dance training in classical and folk forms",
      "Classical music workshops for vocals and instruments",
      "Folk art training preserving regional traditions",
      "Instrumental training with master musicians",
      "Future talent hunts and artist development programmes",
    ],
    closing:
      "We are building a future where every talented young artist has access to world-class training and the opportunity to share their gift with the world.",
  },
];

export const values = [
  {
    title: "Authenticity",
    text: "We honour the purity and essence of traditional art forms while presenting them with contemporary finesse.",
  },
  {
    title: "Inclusivity",
    text: "Every artist, regardless of their background, deserves a dignified platform to share their gift with the world.",
  },
  {
    title: "Excellence",
    text: "We pursue the highest standards in every production, from intimate recitals to grand international showcases.",
  },
  {
    title: "Innovation",
    text: "Tradition and creativity coexist in our work, creating fresh interpretations that resonate with modern audiences.",
  },
];

export const differentiators = [
  "Strong artistic network spanning classical, folk, and contemporary fields across India",
  "Professional production team with decades of combined experience",
  "Concept-driven, culturally rich programming that tells compelling stories",
  "Global-ready performance formats designed for diverse international audiences",
  "Unwavering commitment to quality, authenticity, and artistic integrity",
  "Deep relationships with maestros, emerging artists, and cultural institutions",
];

export const team = [
  { name: "Pradnya Kale", role: "Founder" },
  { name: "Gopal Awati", role: "Script Writer" },
  { name: "Pravin Joshi", role: "Script Writer" },
];

export const reachOutReasons = [
  "Planning a cultural event or festival",
  "Seeking artistic collaboration",
  "Interested in our training programs",
  "Looking to showcase your talent",
  "Media and production inquiries",
  "Corporate event entertainment",
];

export const whatsappLink = (text: string) =>
  `${site.whatsapp}?text=${encodeURIComponent(text)}`;

// Ravi Chary Crossing, 18 Oct 2026. Shared by the event page and the site-wide announcement.
export const crossing = {
  href: "/ravi-chary-crossing",
  passHref: "/pass",
  title: "Ravi Chary Crossing",
  dateLabel: "Sunday, 18 October 2026",
  time: "8:45 PM",
  startISO: "2026-10-18T20:45:00+05:30",
  // The announcement stops showing once the show day is over.
  endISO: "2026-10-19T00:00:00+05:30",
  venue: "Ravindra Natya Mandir",
  area: "Prabhadevi, Mumbai",
  entry: "FREE ENTRY",
  enquiry: "+91 83698 45539",
  enquiryHref: "tel:+918369845539",
  enquiryWhatsapp: "https://wa.me/918369845539",
  // Pass types. The public /pass form gives out "general"; VVIP and VIP are issued by the team at /pass/issue.
  passTypes: { general: "General", vip: "VIP", vvip: "VVIP" },
  academy: "Ravi Chary’s Swar Sanskruti Music Academy",
  artists: [
    { name: "Ravi Chary", role: "Sitar", image: "/images/crossing/ravi.webp", pos: "50% 22%" },
    { name: "Ojas Adhiya", role: "Tabla", image: "/images/crossing/ojas.webp", pos: "42% 30%" },
    { name: "Gino Banks", role: "Drums", image: "/images/crossing/gino.webp", pos: "57% 15%" },
    { name: "Sangeet Haldipur", role: "Keyboards · Composer", image: "/images/crossing/sangeet.webp", pos: "55% 20%" },
    { name: "Sheldon D’Silva", role: "Bass Guitar", image: "/images/crossing/sheldon.webp", pos: "46% 20%" },
  ],
} as const;
