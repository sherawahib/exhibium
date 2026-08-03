export const contactEmail = "fwilliams@exhibium.com";
export const contactMailto = `mailto:${contactEmail}`;
export const contactAddress = "1200 Brickell Avenue, Suite 800, Miami, FL 33131";
export const contactPhone = "(786) 301-0677";
export const contactTel = "tel:+17863010677";

export const headerNavLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
] as const;

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
    slug: "bim",
    num: "01",
    label: "BIM / VDC Services",
    title: "BIM/VDC-Driven Project Management Services",
    subtitle:
      "Servicing PM Firms, Developers, Owner’s Representatives, and General Contractors",
    image: "/services-bim.png",
    imageAlt:
      "Exhibium BIM Management Division graphic with BIM word cloud and building systems model",
    summary:
      "BIM/VDC-driven project management for PM firms, developers, owner’s representatives, and general contractors.",
    paragraphs: [
      "Exhibium’s BIM team will provide the total BEP execution plan, BIM technical services, and advisory implementation process.",
      "Implementing a BIM/VDC-driven project management system where BIM serves as the core platform for project controls, coordination, scheduling, design, engineering, cost management, and owner reporting, not merely as a design visualization tool.",
    ],
    docs: [
      {
        id: "bim-management",
        label: "BIM Management Presentation",
        slides: Array.from(
          { length: 6 },
          (_, i) =>
            `/docs/slides/bim-management/slide-${String(i + 1).padStart(2, "0")}.png`,
        ),
      },
    ],
  },
  {
    slug: "modular",
    num: "02",
    label: "Modular Construction Group",
    title: "Modular Construction Group",
    subtitle:
      "Modular construction can deliver projects 20% to 50% faster than traditional methods.",
    image: "/services-modular.png",
    imageAlt:
      "Exhibium Modular Development Division graphic with modular building and structural model",
    summary:
      "Modular construction pathways that can deliver projects 20% to 50% faster than traditional methods.",
    paragraphs: [
      "Modular construction can deliver projects 20% to 50% faster than traditional methods. Exhibium has identified the following 2 fabrication and erection systems as viable alternatives for the projects being undertaken. A project’s specific requirements will determine the choice of modular system.",
    ],
    docs: [
      {
        id: "self-storage",
        label: "Self Storage Experience",
        slides: Array.from(
          { length: 9 },
          (_, i) =>
            `/docs/slides/self-storage/slide-${String(i + 1).padStart(2, "0")}.png`,
        ),
      },
      {
        id: "modular-master",
        label: "Generic Modular Master",
        slides: Array.from(
          { length: 17 },
          (_, i) =>
            `/docs/slides/modular-master/slide-${String(i + 1).padStart(2, "0")}.png`,
        ),
      },
    ],
  },
  {
    slug: "market-entry",
    num: "03",
    label: "Market Entry Group",
    title: "Market Entry Group",
    subtitle:
      "As a result of Exhibium’s many years of experience working internationally, Exhibium was asked to provide Market Entry services for international expansion plans.",
    image: "/services-market-entry.png",
    imageAlt:
      "Global Expansion Market Entry Strategies graphic with city skyline and business professionals",
    summary:
      "Market Entry advisory for clients expanding across the USA, Latin America, and the Middle East.",
    paragraphs: [
      "As a result of Exhibium’s many years of experience working internationally, Exhibium was asked to provide Market Entry services for international expansion plans. Our vast experience working with clients in the USA, Latin America, and the Middle East has provided Exhibium with vast in-country associate partners, which has allowed Exhibium to enter this phase of advisory services.",
    ],
    markets: [
      {
        title:
          "USA-based clients and others wishing to enter Latin America and the Middle East",
        items: [
          "Retailers, developers, strategic advisory partners, self-storage, specialty building materials manufacturers, non-profit foundations",
        ],
      },
      {
        title:
          "Latin America-based clients and others wishing to enter USA markets and/or expand within Latin America",
        items: ["Retailers"],
      },
      {
        title:
          "Middle East-based clients and others wishing to enter USA markets",
        items: ["Retailers"],
      },
    ],
    offerings: [
      "SWOT analysis reporting",
      "Marketing and business development services",
      "Brand positioning and promotional strategy",
      "Creation of an initial business plan strategy for implementation of roadmaps",
      "Introduction of potential business leads and partners",
      "A/E/C services",
    ],
    docs: [
      {
        id: "market-entry-presentation",
        label: "Market Entry Presentation",
        slides: Array.from(
          { length: 2 },
          (_, i) =>
            `/docs/slides/market-entry/slide-${String(i + 1).padStart(2, "0")}.png`,
        ),
      },
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
