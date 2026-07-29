/** Canonical copy sourced from the Exhibium Land Page Brief PDF */

export const briefTaglines = [
  "Branding · Process Management · Development Projects",
  "Strategy and Execution · Market Entry Services",
  "ROI Advisory Services",
] as const;

export const briefGroups = [
  "Market Entry Group",
  "BIM Advisory Group",
  "Modular Construction Group",
] as const;

export const briefCapabilities = [
  "Branding",
  "Process Management",
  "Development Projects",
  "Strategy and Execution",
  "Market Entry Services",
  "ROI Advisory Services",
] as const;

export const executiveSummary = {
  kicker: "Executive summary",
  headline:
    "Exhibium Group is a multi-faceted consultancy providing branding, BIM management services, and modular construction development solutions.",
  primary:
    "Enhanced ROI-based solutions are our primary service offering. The company is led by Fernando Williams, its founder and chief strategist for over 25 years.",
  board:
    "Each Exhibium service division is guided by an advisory board of experienced professionals. Strategic solutions are reviewed by the board, and senior project managers are assigned to lead implementation.",
};

export const founderProfile = {
  intro:
    "Fernando Williams is the founder and a director of Exhibium Group, a leading retail consulting organization with extensive experience in the United States, Latin America, and the Middle East.",
  emotional:
    "Mr. Williams is widely known for his work in Emotional Commerce. He believes the in-store customer experience can be positively influenced by visual motivational factors that increase time spent in store and drive higher spending. This approach has been confirmed across many of today’s most successful retail operations, and the consultancies led by Mr. Williams and his associates include numerous case studies that prove the point.",
  background:
    "Mr. Williams received his education and training in architecture. Over the years he has expanded his practice to include store design, visual merchandising, branding and marketing services, and in-store marketing and communications. In the last five years, Mr. Williams has partnered with leading management advisory consultants to deliver fully integrated consulting services. He is an accomplished retail consultant, speaker, and trainer with international experience across many retail formats.",
  expansion:
    "Mr. Williams has also expanded his consulting work to include business development within the A/E/C sectors, with a major focus on market entry services for companies seeking to expand internationally.",
};

export type PartnerRecord = {
  section: "advisory" | "client";
  term: string;
  name: string;
  href: string;
  linkLabel: string;
  bullets: string[];
};

export const partnersFromBrief: PartnerRecord[] = [
  {
    section: "advisory",
    term: "2016-2020",
    name: "Alex Partners LLC",
    href: "https://www.alexpartners.com",
    linkLabel: "alexpartners.com",
    bullets: [
      "U.S.-based international strategic consultancy.",
      "Exhibium serves as an on-call collaborative consultant for retail planning and design expertise.",
      "Past project collaborations include Hyatt Plaza Mall in Qatar and Panda Stores in Saudi Arabia.",
    ],
  },
  {
    section: "advisory",
    term: "2010-2020",
    name: "Diversified Retail Solutions LLC",
    href: "https://www.drsllc.com",
    linkLabel: "drsllc.com",
    bullets: [
      "U.S. retail consultancy focused on big-box retail advisory services.",
      "Past project collaborations include Walmart stores, Target stores, and Deprati retail in Ecuador.",
    ],
  },
  {
    section: "client",
    term: "2005-Current",
    name: "La Polar S.A.",
    href: "https://www.lapolar.cl",
    linkLabel: "lapolar.cl",
    bullets: [
      "Chile-based department store retailer.",
      "Exhibium was the primary retail design consultant for a new-store roll-out program that created 15 stores over a 10-year period.",
      "Exhibium provided market entry consulting for the chain’s expansion into Colombia.",
    ],
  },
  {
    section: "client",
    term: "2010-Current",
    name: "Almuhadib Development Group",
    href: "https://www.muhaidib.com",
    linkLabel: "muhaidib.com",
    bullets: [
      "Al Muhaidib Group is a leading Saudi conglomerate.",
      "Past project collaborations include Giant Stores retail rebranding and visual merchandising services for a 10-store roll-out.",
    ],
  },
  {
    section: "client",
    term: "2005-Current",
    name: "Corporación Wong",
    href: "https://www.corporacionwong.pe",
    linkLabel: "corporacionwong.pe",
    bullets: [
      "Peru-based shopping center and retail operator-developer.",
      "Long-term consultancy relationship. Exhibium acted as the primary retail design consultant for new store prototypes and shopping center strategic planning.",
    ],
  },
];
