/** Canonical copy sourced from the Exhibium Land Page Brief PDF */

export const briefTaglines = [
  "Branding · Process Management · Development Projects",
  "Strategy and Execution · Market Entry Services",
  "ROI Advisory Services",
] as const;

export const briefGroups = [
  "Retail Consulting Group",
  "BIM Management Group",
  "Modular Development Group",
] as const;

export const briefModularLine = "Modular Retail — The new way to build…….";

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
    "Exhibium Group is a multi-faceted consultancy providing Branding, BIM management services, and Modular Construction development solutions.",
  primary:
    "Providing enhanced ROI-based solutions is our primary service offering. The company is led by Fernando Williams, its founder and chief strategist for over 25 years.",
  board:
    "The Exhibium Group is under the management of an advisory board for each of its service divisions, composed of some of the most creative and experienced professionals. All project strategic solutions are reviewed by the advisory board and are assigned senior project managers for all implementation services.",
};

export const founderProfile = {
  intro:
    "Fernando Williams is the founder and a director with the Exhibium Group, a leading retail consulting organization with extensive work experience in the United States, Latin America, and the Middle East.",
  emotional:
    "Mr. Williams is widely known for his work in the area of “Emotional Commerce.” It is his belief that the customer in-store experience can be positively influenced via visual motivational factors to generate more time spent in the store and increased spending. This theory has been confirmed and put to the test in many of the most successful retail operations existing today. In the consultancies performed by Mr. Williams and his associates there are many case studies that prove this point.",
  background:
    "Mr. Williams received his education and training in architecture. Over the years he has expanded his base to include store design, visual merchandising, Branding/Marketing services, and in-store marketing and communications. In the last five years Mr. Williams has partnered with leading management advisory consultants in order to provide fully integrated consulting services. He is an accomplished retail consultant, speaker and trainer with international experience in many different retail formats.",
  expansion:
    "Mr. Williams has expanded his personal consulting services to include Business Development services within the A/E/C sectors with a major focus on market entry services for companies wishing to expand their services internationally.",
  quote:
    "The customer in-store experience can be positively influenced via visual motivational factors—to generate more time spent in the store and increased spending.",
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
    term: "2016 – 2020",
    name: "Alex Partners LLC",
    href: "https://www.alexpartners.com",
    linkLabel: "alexpartners.com",
    bullets: [
      "USA based international strategic consultant.",
      "Exhibium is an on-call contributing collaborative consultant for retail planning and design expertise.",
      "Past project collaboration: Hyatt Plaza Mall—Qatar, Panda Stores—Saudi Arabia.",
    ],
  },
  {
    section: "advisory",
    term: "2010 – 2020",
    name: "Diversified Retail Solutions LLC",
    href: "https://www.drsllc.com",
    linkLabel: "drsllc.com",
    bullets: [
      "USA retail consultant focused on big box retail advisory services.",
      "Past project collaborations: Walmart stores, Target stores, Deprati retail Ecuador.",
    ],
  },
  {
    section: "client",
    term: "2005 – Current",
    name: "La Polar S.A.",
    href: "https://www.lapolar.cl",
    linkLabel: "lapolar.cl",
    bullets: [
      "Chile based department store retailer.",
      "Exhibium was the primary retail design consultant for implementing a new store roll-out program which created 15 new stores over a 10 year period.",
      "Exhibium provided Market Entry consulting services for the chain’s expansion into Colombia.",
    ],
  },
  {
    section: "client",
    term: "2010 – Current",
    name: "Almuhadib Development Group",
    href: "https://www.muhaidib.com",
    linkLabel: "muhaidib.com",
    bullets: [
      "Al Muhaidib Group is a leading Saudi conglomerate.",
      "Past project collaborations: Giant Stores retail re-branding and Visual merchandising services—10 store roll-out.",
    ],
  },
  {
    section: "client",
    term: "2005 – Current",
    name: "Corporación Wong",
    href: "https://www.corporacionwong.pe",
    linkLabel: "corporacionwong.pe",
    bullets: [
      "Peru based shopping center / retail operator developer.",
      "Long-term consultancy relationship—Exhibium acted as the primary retail design consultant covering new store prototypes and shopping center strategic planning.",
    ],
  },
];
