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
  kicker: "Our approach",
  headline: "Senior thinking. Direct advice. Executable deliverables.",
  primary:
    "We work closely with leadership teams to frame the real issue, identify the strongest path forward, and translate strategy into focused action. Every engagement is tailored, discreet, and grounded in measurable commercial value.",
  focus: "Focused expertise for growth and transformation.",
  board:
    "From market strategy to project delivery, Exhibium brings together complementary disciplines under our direction to deliver senior advisory services to our clients.",
};

export const founderProfile = {
  kicker: "Leadership & experience",
  headline: "International perspective. Entrepreneurial execution.",
  paragraphs: [
    "The Exhibium Group is under the management of an advisory board composed of some of the most creative and experienced A/E/C independent professionals. All project strategic advisories are reviewed by the advisory board and are assigned to senior project managers for all implementation services.",
    "Fernando Williams is the founder and a director of Exhibium Group, a leading consulting organization with over 30 years’ work experience in the United States, Latin America, and the Middle East.",
    "Exhibium Group was originally founded as a retail design firm offering comprehensive retail planning and design services. Mr. Williams is widely known for his work in Emotional Commerce. The retail design practice is no longer at the forefront of Exhibium’s services, but has been incorporated into our Market Entry services for retailers wishing to expand their operations internationally.",
    "Mr. Williams received his education and training in architecture. He is an accomplished consultant, speaker, and strategic advisor trainer with international experience across many A/E/C formats. In the last ten years, Mr. Williams has partnered with leading management, construction, and BIM development consultants to deliver mainline strategic advisory services in the areas of BIM Management, Modular Construction, and Market Entry services.",
    "Over the years, Exhibium has provided advisory services to multiple companies in the United States, Latin America, and the Middle East.",
  ],
  closing: "Decades of executive leadership across international markets.",
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
