export type ChatAction = "email" | "appointment" | "whatsapp" | "link";

export type ChatOption = {
  label: string;
  /** Next question/answer node id */
  next?: string;
  /** Immediate bot reply before navigating */
  reply?: string;
  action?: ChatAction;
  href?: string;
};

export type ChatNode = {
  id: string;
  prompt: string;
  options: ChatOption[];
};

/**
 * Guided MCQ assistant for Exhibium visitors.
 * Each node is a multiple-choice question; answers route to more detail or contact.
 */
export const chatbotNodes: Record<string, ChatNode> = {
  start: {
    id: "start",
    prompt:
      "Hi — I’m the Exhibium guide. What do you want help with? Pick one:",
    options: [
      { label: "A. Services overview", next: "q-services" },
      { label: "B. BIM / VDC", next: "q-bim-1" },
      { label: "C. Modular construction", next: "q-mod-1" },
      { label: "D. Market entry / expansion", next: "q-me-1" },
      { label: "E. Book a meeting / contact", next: "q-contact-1" },
      { label: "F. About Exhibium", next: "q-about-1" },
      {
        label: "G. Still stuck — email the team",
        action: "email",
        reply: "No problem. Share a short note and we’ll reply by email.",
      },
    ],
  },

  // —— Services (5) ——
  "q-services": {
    id: "q-services",
    prompt: "Which service area are you exploring?",
    options: [
      { label: "A. BIM / VDC project management", next: "a-svc-bim" },
      { label: "B. Modular Construction Group", next: "a-svc-mod" },
      { label: "C. Market Entry Group", next: "a-svc-me" },
      { label: "D. Branding / strategy / ROI advisory", next: "a-svc-brand" },
      { label: "E. Not sure — help me choose", next: "q-services-fit" },
    ],
  },
  "a-svc-bim": {
    id: "a-svc-bim",
    prompt:
      "BIM/VDC is our core delivery platform for PM firms, developers, owner’s reps, and GCs — BEP execution, coordination, controls, and owner reporting. What next?",
    options: [
      { label: "A. Dig into BIM questions", next: "q-bim-1" },
      { label: "B. Open Services page", action: "link", href: "/services" },
      { label: "C. Book a BIM consult", action: "appointment" },
      { label: "D. Back to main menu", next: "start" },
    ],
  },
  "a-svc-mod": {
    id: "a-svc-mod",
    prompt:
      "Modular Construction Group identifies fabrication and erection systems that can deliver faster than traditional builds, matched to project requirements. What next?",
    options: [
      { label: "A. More modular questions", next: "q-mod-1" },
      { label: "B. Open Services page", action: "link", href: "/services" },
      { label: "C. Book a modular consult", action: "appointment" },
      { label: "D. Back to main menu", next: "start" },
    ],
  },
  "a-svc-me": {
    id: "a-svc-me",
    prompt:
      "Market Entry supports expansion across the USA, Latin America, and the Middle East — SWOT, brand positioning, roadmaps, partners, and A/E/C intros. What next?",
    options: [
      { label: "A. More market-entry questions", next: "q-me-1" },
      { label: "B. Open Services page", action: "link", href: "/services" },
      { label: "C. Book a market-entry call", action: "appointment" },
      { label: "D. Back to main menu", next: "start" },
    ],
  },
  "a-svc-brand": {
    id: "a-svc-brand",
    prompt:
      "Exhibium also advises on branding, process management, development projects, strategy & execution, and ROI — often alongside market entry or project delivery. What next?",
    options: [
      { label: "A. See capabilities on Home", action: "link", href: "/" },
      { label: "B. Book a strategy consult", action: "appointment" },
      { label: "C. Email the team", action: "email" },
      { label: "D. Back to main menu", next: "start" },
    ],
  },
  "q-services-fit": {
    id: "q-services-fit",
    prompt: "What best describes your situation right now?",
    options: [
      {
        label: "A. Running or building a project and need BIM/VDC controls",
        next: "a-svc-bim",
      },
      {
        label: "B. Want faster / modular delivery vs traditional build",
        next: "a-svc-mod",
      },
      {
        label: "C. Expanding into a new country or region",
        next: "a-svc-me",
      },
      {
        label: "D. Need commercial / brand / ROI guidance",
        next: "a-svc-brand",
      },
      { label: "E. Still unclear — email us", action: "email" },
    ],
  },

  // —— BIM (7) ——
  "q-bim-1": {
    id: "q-bim-1",
    prompt: "BIM / VDC — what do you want to know?",
    options: [
      { label: "A. Who is BIM for?", next: "q-bim-who" },
      { label: "B. What does Exhibium deliver?", next: "q-bim-deliver" },
      { label: "C. Is BIM only for visualization?", next: "q-bim-viz" },
      { label: "D. BEP / execution planning", next: "q-bim-bep" },
      { label: "E. Something else about BIM", next: "q-bim-more" },
    ],
  },
  "q-bim-who": {
    id: "q-bim-who",
    prompt:
      "We primarily serve PM firms, developers, owner’s representatives, and general contractors who want BIM as the operating system for the job — not a side CAD task. Useful?",
    options: [
      { label: "A. Yes — what do you deliver?", next: "q-bim-deliver" },
      { label: "B. Book a BIM meeting", action: "appointment" },
      { label: "C. More BIM questions", next: "q-bim-1" },
      { label: "D. Email a specific question", action: "email" },
    ],
  },
  "q-bim-deliver": {
    id: "q-bim-deliver",
    prompt:
      "Typical scope includes total BEP execution planning, BIM technical services, and advisory implementation so BIM drives coordination, schedule, cost, engineering, and owner reporting. Next step?",
    options: [
      { label: "A. How is this different from 3D models?", next: "q-bim-viz" },
      { label: "B. View Services / BIM", action: "link", href: "/services" },
      { label: "C. Book a consult", action: "appointment" },
      { label: "D. Main menu", next: "start" },
    ],
  },
  "q-bim-viz": {
    id: "q-bim-viz",
    prompt:
      "No — Exhibium positions BIM/VDC as the core platform for project controls and delivery, not merely design visualization. Want to go deeper?",
    options: [
      { label: "A. Tell me about BEP", next: "q-bim-bep" },
      { label: "B. See related docs on site", action: "link", href: "/services" },
      { label: "C. Talk to the team", action: "appointment" },
      { label: "D. Email us", action: "email" },
    ],
  },
  "q-bim-bep": {
    id: "q-bim-bep",
    prompt:
      "We help define and execute the BIM Execution Plan (BEP) so standards, roles, exchanges, and controls are clear before coordination breaks down. Need a working session?",
    options: [
      { label: "A. Yes — book appointment", action: "appointment" },
      { label: "B. Chat on WhatsApp", action: "whatsapp" },
      { label: "C. More BIM questions", next: "q-bim-1" },
      { label: "D. Email details", action: "email" },
    ],
  },
  "q-bim-more": {
    id: "q-bim-more",
    prompt: "Pick the closest BIM topic:",
    options: [
      {
        label: "A. Clash / coordination workflows",
        next: "q-bim-coord",
      },
      {
        label: "B. Owner reporting & dashboards",
        next: "q-bim-owner",
      },
      {
        label: "C. Cost / schedule linkage",
        next: "q-bim-cost",
      },
      { label: "D. None of these — email", action: "email" },
    ],
  },
  "q-bim-coord": {
    id: "q-bim-coord",
    prompt:
      "Coordination is handled as part of a BIM/VDC-driven PM system — models support clash resolution and field readiness, tied to the overall controls process. Ready to discuss your stack?",
    options: [
      { label: "A. Book a call", action: "appointment" },
      { label: "B. WhatsApp", action: "whatsapp" },
      { label: "C. Back to BIM menu", next: "q-bim-1" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-bim-owner": {
    id: "q-bim-owner",
    prompt:
      "Owner reporting is a first-class outcome: BIM feeds clear status, risk, and progress communication — not just pretty screenshots. Want a walkthrough?",
    options: [
      { label: "A. Book appointment", action: "appointment" },
      { label: "B. More BIM questions", next: "q-bim-1" },
      { label: "C. Main menu", next: "start" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-bim-cost": {
    id: "q-bim-cost",
    prompt:
      "We connect BIM/VDC into cost and schedule controls so the model supports commercial decision-making, not only design. Shall we scope your project?",
    options: [
      { label: "A. Book consult", action: "appointment" },
      { label: "B. Services page", action: "link", href: "/services" },
      { label: "C. Email scope", action: "email" },
      { label: "D. Main menu", next: "start" },
    ],
  },

  // —— Modular (6) ——
  "q-mod-1": {
    id: "q-mod-1",
    prompt: "Modular construction — choose a question:",
    options: [
      { label: "A. Why modular vs traditional?", next: "q-mod-why" },
      { label: "B. How do you pick a system?", next: "q-mod-pick" },
      { label: "C. Self-storage experience?", next: "q-mod-storage" },
      { label: "D. Typical project types", next: "q-mod-types" },
      { label: "E. Something else", next: "q-mod-else" },
    ],
  },
  "q-mod-why": {
    id: "q-mod-why",
    prompt:
      "Modular pathways can compress schedule versus traditional site-built methods when fabrication and erection systems fit the program. Exact gains depend on the project. Next?",
    options: [
      { label: "A. How do you choose systems?", next: "q-mod-pick" },
      { label: "B. Book a modular consult", action: "appointment" },
      { label: "C. Modular menu", next: "q-mod-1" },
      { label: "D. Email my constraints", action: "email" },
    ],
  },
  "q-mod-pick": {
    id: "q-mod-pick",
    prompt:
      "Exhibium evaluates viable fabrication and erection systems against your project’s specific requirements — there isn’t a one-size answer. Want a review?",
    options: [
      { label: "A. Yes — book meeting", action: "appointment" },
      { label: "B. See Services", action: "link", href: "/services" },
      { label: "C. Self-storage angle", next: "q-mod-storage" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-mod-storage": {
    id: "q-mod-storage",
    prompt:
      "Self-storage is a documented experience area, with presentation material available on the Services section. Looking for that, or a live discussion?",
    options: [
      { label: "A. Open Services", action: "link", href: "/services" },
      { label: "B. Book appointment", action: "appointment" },
      { label: "C. Modular menu", next: "q-mod-1" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-mod-types": {
    id: "q-mod-types",
    prompt:
      "Fit depends on program, logistics, and market — we assess whether modular systems are viable for the projects under consideration rather than forcing a product. Next?",
    options: [
      { label: "A. Discuss my program", action: "appointment" },
      { label: "B. Market entry too?", next: "q-me-1" },
      { label: "C. Main menu", next: "start" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-mod-else": {
    id: "q-mod-else",
    prompt: "Closest match?",
    options: [
      { label: "A. Factory / logistics questions", next: "q-mod-logistics" },
      { label: "B. Cost vs schedule tradeoffs", next: "q-mod-why" },
      { label: "C. Pair modular with BIM", next: "q-mod-bim" },
      { label: "D. None — email the team", action: "email" },
    ],
  },
  "q-mod-logistics": {
    id: "q-mod-logistics",
    prompt:
      "Logistics and erection sequencing are part of choosing the right modular pathway — we align system choice with site and delivery realities. Ready to brief us?",
    options: [
      { label: "A. Book call", action: "appointment" },
      { label: "B. WhatsApp", action: "whatsapp" },
      { label: "C. Modular menu", next: "q-mod-1" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-mod-bim": {
    id: "q-mod-bim",
    prompt:
      "Yes — modular delivery pairs well with BIM/VDC controls for coordination and reporting. Many clients engage both. Want a combined agenda?",
    options: [
      { label: "A. Book combined consult", action: "appointment" },
      { label: "B. BIM questions", next: "q-bim-1" },
      { label: "C. Modular menu", next: "q-mod-1" },
      { label: "D. Email", action: "email" },
    ],
  },

  // —— Market entry (6) ——
  "q-me-1": {
    id: "q-me-1",
    prompt: "Market entry — what’s your focus?",
    options: [
      { label: "A. Regions you cover", next: "q-me-regions" },
      { label: "B. What’s included", next: "q-me-include" },
      { label: "C. Who typically hires you", next: "q-me-who" },
      { label: "D. Partners / local associates", next: "q-me-partners" },
      { label: "E. Other expansion question", next: "q-me-else" },
    ],
  },
  "q-me-regions": {
    id: "q-me-regions",
    prompt:
      "Experience and associate networks span USA, Latin America, and the Middle East — both inbound and outbound expansion paths. Which direction are you exploring?",
    options: [
      { label: "A. Into Latin America / Middle East", next: "q-me-out" },
      { label: "B. Into the USA", next: "q-me-usa" },
      { label: "C. Book a call", action: "appointment" },
      { label: "D. Email my market", action: "email" },
    ],
  },
  "q-me-out": {
    id: "q-me-out",
    prompt:
      "USA-based and other clients use Exhibium for entry into Latin America and the Middle East — retailers, developers, advisory partners, self-storage, specialty materials, non-profits, and more. Next?",
    options: [
      { label: "A. What’s in the package?", next: "q-me-include" },
      { label: "B. Book market-entry call", action: "appointment" },
      { label: "C. Market entry menu", next: "q-me-1" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-me-usa": {
    id: "q-me-usa",
    prompt:
      "Latin America– and Middle East–based clients (including retailers) engage us for USA entry or regional expansion support. Want to outline your plan?",
    options: [
      { label: "A. Book appointment", action: "appointment" },
      { label: "B. See offerings", next: "q-me-include" },
      { label: "C. Main menu", next: "start" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-me-include": {
    id: "q-me-include",
    prompt:
      "Offerings commonly include SWOT reporting, marketing & BD support, brand positioning, initial business-plan roadmaps, partner/lead introductions, and A/E/C services. Need a tailored agenda?",
    options: [
      { label: "A. Book consult", action: "appointment" },
      { label: "B. Services page", action: "link", href: "/services" },
      { label: "C. Who is this for?", next: "q-me-who" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-me-who": {
    id: "q-me-who",
    prompt:
      "Typical clients include retailers, developers, strategic advisory partners, self-storage operators, specialty building-materials manufacturers, and non-profit foundations — plus teams expanding across LATAM / ME / USA. Fit?",
    options: [
      { label: "A. Yes — book a call", action: "appointment" },
      { label: "B. Partners / associates", next: "q-me-partners" },
      { label: "C. Not sure — email", action: "email" },
      { label: "D. Main menu", next: "start" },
    ],
  },
  "q-me-partners": {
    id: "q-me-partners",
    prompt:
      "In-country associate partners help Exhibium support market entry with local context and introductions. You can also browse the Partners page on the site.",
    options: [
      { label: "A. Open Partners", action: "link", href: "/partners" },
      { label: "B. Book intro call", action: "appointment" },
      { label: "C. Market entry menu", next: "q-me-1" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-me-else": {
    id: "q-me-else",
    prompt: "Closest topic?",
    options: [
      { label: "A. Brand positioning abroad", next: "q-me-include" },
      { label: "B. Finding local partners", next: "q-me-partners" },
      { label: "C. Retail expansion", next: "q-me-who" },
      { label: "D. None of these — email", action: "email" },
    ],
  },

  // —— Contact / appointments (5) ——
  "q-contact-1": {
    id: "q-contact-1",
    prompt: "How would you like to reach Exhibium?",
    options: [
      { label: "A. Book an appointment online", next: "q-contact-book" },
      { label: "B. Email / phone details", next: "q-contact-info" },
      { label: "C. WhatsApp chat", action: "whatsapp" },
      { label: "D. Office location", next: "q-contact-office" },
      { label: "E. Meeting formats & timing", next: "q-contact-format" },
    ],
  },
  "q-contact-book": {
    id: "q-contact-book",
    prompt:
      "Use the Book Appointment page to send a structured request (focus, date, format). You can also jump there now.",
    options: [
      { label: "A. Open appointment form", action: "appointment" },
      { label: "B. Prefer email instead", action: "email" },
      { label: "C. Contact details", next: "q-contact-info" },
      { label: "D. Main menu", next: "start" },
    ],
  },
  "q-contact-info": {
    id: "q-contact-info",
    prompt:
      "Email: fwilliams@exhibium.com · Phone: (786) 301-0677. Prefer to draft a message here?",
    options: [
      { label: "A. Yes — email form", action: "email" },
      { label: "B. Call / WhatsApp", action: "whatsapp" },
      { label: "C. Book appointment", action: "appointment" },
      { label: "D. Main menu", next: "start" },
    ],
  },
  "q-contact-office": {
    id: "q-contact-office",
    prompt:
      "Exhibium: 1200 Brickell Avenue, Suite 800, Miami, FL 33131. In-person meetings can be requested on the appointment form.",
    options: [
      { label: "A. Request in-person meeting", action: "appointment" },
      { label: "B. Contact page", action: "link", href: "/contact" },
      { label: "C. Email", action: "email" },
      { label: "D. Main menu", next: "start" },
    ],
  },
  "q-contact-format": {
    id: "q-contact-format",
    prompt:
      "Appointments can be video, phone, or in person — typically 30–60 minutes. Pick a focus (BIM, modular, market entry, ROI, or general) on the form.",
    options: [
      { label: "A. Book now", action: "appointment" },
      { label: "B. Email to coordinate", action: "email" },
      { label: "C. Contact menu", next: "q-contact-1" },
      { label: "D. Main menu", next: "start" },
    ],
  },

  // —— About (4) ——
  "q-about-1": {
    id: "q-about-1",
    prompt: "About Exhibium — choose one:",
    options: [
      { label: "A. What is Exhibium Group?", next: "q-about-what" },
      { label: "B. Leadership / Fernando Williams", next: "q-about-leader" },
      { label: "C. Capabilities list", next: "q-about-caps" },
      { label: "D. Projects & proof", next: "q-about-projects" },
    ],
  },
  "q-about-what": {
    id: "q-about-what",
    prompt:
      "Exhibium Group advises on market entry, strategy, BIM/VDC-driven project management, modular pathways, branding, and ROI — for international and domestic clients. Learn more?",
    options: [
      { label: "A. About page", action: "link", href: "/about" },
      { label: "B. Services", action: "link", href: "/services" },
      { label: "C. Book intro call", action: "appointment" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-about-leader": {
    id: "q-about-leader",
    prompt:
      "The practice is led by Fernando Williams. For a personal introduction or briefing, booking a short appointment is the fastest path.",
    options: [
      { label: "A. Book appointment", action: "appointment" },
      { label: "B. About page", action: "link", href: "/about" },
      { label: "C. Email Fernando’s team", action: "email" },
      { label: "D. Main menu", next: "start" },
    ],
  },
  "q-about-caps": {
    id: "q-about-caps",
    prompt:
      "Core capabilities: Branding · Process Management · Development Projects · Strategy & Execution · Market Entry · ROI Advisory — alongside BIM and modular groups.",
    options: [
      { label: "A. Pick a service", next: "q-services" },
      { label: "B. Home overview", action: "link", href: "/" },
      { label: "C. Book consult", action: "appointment" },
      { label: "D. Email", action: "email" },
    ],
  },
  "q-about-projects": {
    id: "q-about-projects",
    prompt:
      "Browse Projects for selected work context, or ask us directly about a sector (e.g. self-storage, retail expansion). What works?",
    options: [
      { label: "A. Open Projects", action: "link", href: "/projects" },
      { label: "B. Book a briefing", action: "appointment" },
      { label: "C. Email my sector", action: "email" },
      { label: "D. Main menu", next: "start" },
    ],
  },
};

export const chatbotStartId = "start";

/** Count of distinct question/answer nodes (for sanity checks). */
export const chatbotQuestionCount = Object.keys(chatbotNodes).length;
