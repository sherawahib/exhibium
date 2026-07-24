export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
] as const;

export const services = [
  {
    slug: "market-entry",
    num: "01",
    label: "Market Entry Strategy",
    title: "Market Entry Strategy",
    image: "/retail.jpg",
    imageAlt: "Premium retail boutique interior with suits and merchandise displays",
    summary:
      "Store design, visual merchandising, branding, and Emotional Commerce—shaping the in-store experience so customers stay longer and spend more.",
    body: "Exhibium’s Market Entry Strategy practice advises department stores, specialty retail, and international roll-outs. We connect Branding, Process Management, Development Projects, and visual systems—including Emotional Commerce—so the customer experience drives measurable commercial performance and enhanced ROI as brands enter and scale in new markets.",
    items: [
      "Branding",
      "Process Management",
      "Development Projects",
      "Visual merchandising systems",
      "In-store marketing & communications",
      "Emotional Commerce strategy",
      "Market Entry Services",
      "ROI Advisory Services",
    ],
  },
  {
    slug: "bim",
    num: "02",
    label: "BIM Management",
    title: "BIM Management Group",
    image: "/bim.jpg",
    imageAlt: "Modern glass corporate building facade with architectural grid lines",
    summary:
      "Building information modeling and process management for architecture, engineering, and construction teams—clarity before capital is committed.",
    body: "Our BIM Management Group aligns A/E/C stakeholders around accurate models, clear process ownership, and strategy that protects ROI. We support modeling, coordination, and development project oversight from concept through delivery.",
    items: [
      "BIM coordination & modeling",
      "A/E/C process management",
      "Development project oversight",
      "Strategy & execution alignment",
      "Cross-discipline collaboration",
      "Implementation with senior PMs",
    ],
  },
  {
    slug: "modular",
    num: "03",
    label: "Modular Development",
    title: "Modular Development Group",
    image: "/modular.jpg",
    imageAlt: "Row of modern modular development units with orange-framed storefronts",
    summary:
      "Construction pathways built for speed, cost control, and repeatable expansion into new markets.",
    body: "The Modular Development Group designs scalable build models for faster deployment and controlled capital cost. We help clients enter markets with modular concepts engineered for repeatability and ROI-led program design—alongside branding, process management, and development project advisory.",
    items: [
      "Modular development concepts",
      "Process management & development projects",
      "Scalable build models",
      "Market-ready deployment",
      "ROI advisory services",
      "Strategy and execution",
    ],
  },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];

export const capabilities = [
  "Branding",
  "Process Management",
  "Development Projects",
  "Strategy and Execution",
  "Market Entry Services",
  "ROI Advisory Services",
] as const;

export const pageImages = {
  about: {
    src: "/about.jpg",
    alt: "Modern corporate lobby with glass walls and city skyline views",
  },
  projects: {
    src: "/projects.jpg",
    alt: "Luxury multi-level shopping atrium with curved balconies and glass dome",
  },
  partners: {
    src: "/boardroom.png",
    alt: "Executive team in silhouette around a boardroom table",
  },
  contact: {
    src: "/bim.jpg",
    alt: "Contemporary glass office architecture",
  },
  services: {
    src: "/modular.jpg",
    alt: "Modular development units",
  },
} as const;

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
