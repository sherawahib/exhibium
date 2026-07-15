export type RegionId = "usa" | "latam" | "mena";

export type MapPin = {
  id: string;
  label: string;
  place: string;
  region: RegionId;
  lat: number;
  lon: number;
};

export type Project = {
  id: string;
  name: string;
  country: string;
  region: RegionId;
  pinId: string;
  description: string;
};

export const mapPins: MapPin[] = [
  { id: "usa-west", label: "West Coast market", place: "West Coast, USA", region: "usa", lat: 34.05, lon: -118.25 },
  { id: "usa-midwest", label: "Midwest market", place: "Midwest, USA", region: "usa", lat: 41.88, lon: -87.63 },
  { id: "usa-nyc", label: "New York market", place: "New York, USA", region: "usa", lat: 40.71, lon: -74.0 },
  { id: "usa-fl", label: "Florida market", place: "Florida, USA", region: "usa", lat: 25.76, lon: -80.19 },
  { id: "mexico", label: "Mexico market", place: "Mexico", region: "latam", lat: 19.43, lon: -99.13 },
  { id: "central", label: "Central America market", place: "Central America", region: "latam", lat: 9.93, lon: -84.08 },
  { id: "caribbean", label: "Caribbean market", place: "Caribbean", region: "latam", lat: 18.47, lon: -69.9 },
  { id: "colombia", label: "Colombia market", place: "Colombia", region: "latam", lat: 4.71, lon: -74.07 },
  { id: "venezuela", label: "Venezuela market", place: "Venezuela", region: "latam", lat: 10.48, lon: -66.9 },
  { id: "ecuador", label: "Ecuador market", place: "Ecuador", region: "latam", lat: -0.18, lon: -78.47 },
  { id: "peru", label: "Peru market", place: "Peru", region: "latam", lat: -12.05, lon: -77.04 },
  { id: "bolivia", label: "Bolivia market", place: "Bolivia", region: "latam", lat: -16.29, lon: -68.15 },
  { id: "chile", label: "Chile market", place: "Chile", region: "latam", lat: -33.45, lon: -70.67 },
  { id: "ksa", label: "Saudi Arabia market", place: "Saudi Arabia", region: "mena", lat: 24.71, lon: 46.68 },
  { id: "doha", label: "Qatar market", place: "Doha, Qatar", region: "mena", lat: 25.29, lon: 51.53 },
  { id: "uae", label: "UAE market", place: "United Arab Emirates", region: "mena", lat: 25.2, lon: 55.27 },
  { id: "russia", label: "Russia market", place: "Russia", region: "mena", lat: 55.76, lon: 37.62 },
];

function p(
  name: string,
  country: string,
  region: RegionId,
  pinId: string,
  description: string
): Project {
  return {
    id: `${region}-${country}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    country,
    region,
    pinId,
    description,
  };
}

export const allProjects: Project[] = [
  // USA
  p("Sedanos", "United States", "usa", "usa-fl", "Regional supermarket chain consultancy focused on store experience and category presentation in Florida markets."),
  p("Navarro", "United States", "usa", "usa-fl", "Pharmacy retail advisory covering visual merchandising systems and customer journey planning."),
  p("ABC Liquor", "United States", "usa", "usa-fl", "Specialty retail program for store layout, branding cues, and impulse-driven merchandise zones."),
  p("Perry Ellis", "United States", "usa", "usa-nyc", "Brand-led store design and wholesale presentation support for an international apparel label."),
  p("Cubavera", "United States", "usa", "usa-fl", "Lifestyle apparel retail concept development with emphasis on cultural storytelling in-store."),
  p("Macy’s", "United States", "usa", "usa-nyc", "Department store consulting across visual standards, floor planning, and Emotional Commerce drivers."),
  p("Saks Fifth Avenue", "United States", "usa", "usa-nyc", "Luxury retail advisory for elevated merchandising, brand adjacency, and customer dwell strategies."),
  p("Nevia Salon", "United States", "usa", "usa-nyc", "Boutique service-retail environment design covering brand identity and client experience flow."),
  p("Charles Lauren Jewelers", "United States", "usa", "usa-nyc", "Fine jewelry boutique consulting for showcase planning, lighting hierarchy, and luxury presentation."),
  p("Hunting World", "United States", "usa", "usa-nyc", "Specialty lifestyle retail concept and visual merchandising for a heritage outdoor brand."),
  p("Casswell Massey", "United States", "usa", "usa-nyc", "Heritage fragrance retailer support including brand presentation and specialty fixture strategy."),
  p("Brothers Camera", "United States", "usa", "usa-nyc", "Specialty retail advisory for product storytelling, demo zones, and high-touch selling floors."),
  p("Murrays", "United States", "usa", "usa-nyc", "Independent specialty store consulting on layout clarity and brand-led visual systems."),
  p("Men’s World Stores", "United States", "usa", "usa-nyc", "Menswear retail prototype and merchandising guidance for coherent brand storytelling."),
  p("Deschemaker Showroom", "United States", "usa", "usa-nyc", "Showroom environment planning for trade presentation, sampling, and buyer circulation."),
  p("A. Dunhill Store", "United States", "usa", "usa-nyc", "Luxury menswear store consulting for refined materials, display cadence, and VIP presentation."),
  p("Rave Stores", "United States", "usa", "usa-midwest", "Specialty retail roll-out support covering prototype consistency and in-store communications."),
  p("Pierre Balmain Showroom", "United States", "usa", "usa-nyc", "Designer showroom experience design focused on brand atmosphere and product hierarchy."),
  p("Merns", "United States", "usa", "usa-nyc", "Specialty menswear consultancy spanning store planning and visual merchandising standards."),
  p("23 Realty Associates", "United States", "usa", "usa-nyc", "Commercial realty presentation and space-planning advisory for high-visibility properties."),
  p("Seaver Residence 5th Ave", "United States", "usa", "usa-nyc", "Private residence interior/architecture consultancy on Fifth Avenue with tailored spatial strategy."),
  p("Camera World Stores", "United States", "usa", "usa-west", "Multi-door specialty retail program balancing service counters, demo, and accessory adjacency."),
  p("California Sunshine", "United States", "usa", "usa-west", "West Coast retail concept development with lifestyle merchandising and sunbelt brand cues."),
  p("Evers & Fenworth", "United States", "usa", "usa-nyc", "Specialty retail brand consultation covering store identity and presentation systems."),
  p("Bambergers", "United States", "usa", "usa-nyc", "Department store advisory rooted in legacy retail formats and modernized customer flow."),
  p("Blimpies", "United States", "usa", "usa-nyc", "Quick-service brand environment guidance for counter presentation and unit identity."),
  p("Batus Retail Group", "United States", "usa", "usa-midwest", "Corporate retail group consulting across multi-banner planning and store development standards."),
  p("Walmart", "United States", "usa", "usa-midwest", "Big-box retail advisory collaboration covering planning and merchandising systems at scale."),
  p("Burdines", "United States", "usa", "usa-fl", "Florida department store consulting for regional identity, floors, and seasonal presentation."),
  p("Gem Galleries", "United States", "usa", "usa-nyc", "Jewelry gallery consulting focused on showcase drama, security presentation, and brand light."),
  p("Locatel", "United States", "usa", "usa-fl", "Specialty pharmacy/retail experience advisory for service-led store formats."),
  p("Donna Karan", "United States", "usa", "usa-nyc", "Designer brand retail consulting for elevated store presence and collection storytelling."),
  p("Camper", "United States", "usa", "usa-west", "Global footwear retail concept support with distinctive store identity and product stages."),
  p("Zara", "United States", "usa", "usa-nyc", "Fast-fashion retail advisory on store efficiency, visual cadence, and high-volume selling floors."),

  // Mexico
  p("SeTu", "Mexico", "latam", "mexico", "Mexican retail consultancy covering brand presentation and store experience development."),
  p("HEB", "Mexico", "latam", "mexico", "Grocery retail advisory for large-format store planning and shopper experience strategy."),
  p("Xcaret", "Mexico", "latam", "mexico", "Destination retail and experiential environment consulting tied to tourism brand immersion."),

  // Central America
  p("Siman — El Salvador", "Central America", "latam", "central", "Department store consulting for Siman’s El Salvador expansion and store experience standards."),
  p("Ben Betsh — Panama", "Central America", "latam", "central", "Panama retail advisory for specialty store planning and brand presentation."),
  p("La Gloria — Costa Rica", "Central America", "latam", "central", "Costa Rican retail consultancy focused on store roll-out clarity and merchandising systems."),
  p("AutoMercados — Costa Rica", "Central America", "latam", "central", "Supermarket format advisory covering aisle logic, brand zones, and shopper convenience."),
  p("Farmaplace — Costa Rica", "Central America", "latam", "central", "Pharmacy retail concept support for service flow, category clarity, and trust cues."),

  // Caribbean
  p("Corte Fiel — Dominican Republic", "Caribbean", "latam", "caribbean", "Dominican fashion retail consulting for store identity and selling-floor presentation."),
  p("Plaza Lama — Dominican Republic", "Caribbean", "latam", "caribbean", "Department store strategic planning and visual merchandising for Plaza Lama."),
  p("Farmaconal — Dominican Republic", "Caribbean", "latam", "caribbean", "Pharmacy chain advisory spanning store prototypes and customer service environments."),

  // Colombia
  p("La Polar", "Colombia", "latam", "colombia", "Market-entry and retail design support for La Polar’s Colombia expansion program."),
  p("Permoda", "Colombia", "latam", "colombia", "Fashion retail consultancy covering store concepts and brand experience across doors."),

  // Venezuela
  p("Kromi Market", "Venezuela", "latam", "venezuela", "Market retail environment consulting for category clarity and shopper circulation."),
  p("Rattan Market", "Venezuela", "latam", "venezuela", "Specialty/home retail advisory for product storytelling and store atmosphere."),
  p("Tbg Group", "Venezuela", "latam", "venezuela", "Multi-format retail group consulting on store development and brand standards."),
  p("Prenatal", "Venezuela", "latam", "venezuela", "Specialty family retail experience design focused on trust, clarity, and discovery."),

  // Ecuador
  p("Comandato", "Ecuador", "latam", "ecuador", "Electronics and appliance retail advisory for large-format presentation and service zones."),
  p("EcuaColor", "Ecuador", "latam", "ecuador", "Specialty retail brand consulting covering store identity and merchandise focus."),
  p("Plaza Lagos Restaurants", "Ecuador", "latam", "ecuador", "Hospitality/retail destination consulting for restaurant precinct experience planning."),
  p("Juan Marcet", "Ecuador", "latam", "ecuador", "Specialty store consulting for legacy retail presence and contemporary presentation."),

  // Peru
  p("E Wong", "Peru", "latam", "peru", "Long-term supermarket/retail design consultancy for Corporación Wong banners."),
  p("Metro", "Peru", "latam", "peru", "Grocery retail prototype and operational merchandising guidance for Metro formats."),
  p("Plaza Norte CC", "Peru", "latam", "peru", "Shopping-center strategic planning advisory for Plaza Norte commercial positioning."),

  // Bolivia
  p("Shopping Fidalga", "Bolivia", "latam", "bolivia", "Shopping center retail strategy and tenant environment consulting in Bolivia."),

  // Chile
  p("La Polar", "Chile", "latam", "chile", "Primary retail design consultant for a multi-year, 15-store roll-out program."),
  p("Mega Johnsons", "Chile", "latam", "chile", "Department/specialty retail consulting for brand presentation and store systems."),
  p("Dijon", "Chile", "latam", "chile", "Fashion retail advisory covering store concept consistency and visual merchandising."),
  p("Falabella", "Chile", "latam", "chile", "Major retail group engagement spanning store planning and commercial experience standards."),

  // MENA
  p("Giant Stores — KSA", "Saudi Arabia", "mena", "ksa", "Retail re-branding and visual merchandising for a ten-store Giant Stores roll-out with Al Muhaidib."),
  p("Qatar Market — Doha", "Qatar", "mena", "doha", "Doha retail market consultancy focused on store presentation and shopper experience."),
  p("Hyatt Plaza Mall — Doha", "Qatar", "mena", "doha", "Mall retail planning collaboration supporting tenant mix experience and presentation strategy."),
  p("Korath International — UAE", "United Arab Emirates", "mena", "uae", "UAE retail consulting for international brand presentation and market-ready store concepts."),
  p("KMZ Stores", "Russia", "mena", "russia", "Russian retail store program advisory covering store identity and merchandising systems."),
];

export const projectRegions: {
  id: RegionId;
  label: string;
  accent: string;
  blurb: string;
}[] = [
  {
    id: "usa",
    label: "United States",
    accent: "#e07828",
    blurb:
      "Department stores, specialty retail, residences, and national brand programs across the U.S.",
  },
  {
    id: "latam",
    label: "Latin America",
    accent: "#f0923d",
    blurb:
      "Store roll-outs, prototypes, and shopping-center strategy across Mexico, Central America, the Caribbean, and South America.",
  },
  {
    id: "mena",
    label: "Middle East & Europe",
    accent: "#ffb366",
    blurb: "Mall, retail rebrand, and market-entry work across the Gulf and Russia.",
  },
];

export function projectToPercent(lat: number, lon: number) {
  return {
    left: ((lon + 180) / 360) * 100,
    top: ((90 - lat) / 180) * 100,
  };
}

export function getProjectsByRegion(regionId: RegionId) {
  return allProjects.filter((project) => project.region === regionId);
}

export function groupProjectsByCountry(regionId: RegionId) {
  const projects = getProjectsByRegion(regionId);
  const map = new Map<string, Project[]>();
  for (const project of projects) {
    const list = map.get(project.country) ?? [];
    list.push(project);
    map.set(project.country, list);
  }
  return Array.from(map.entries()).map(([country, items]) => ({
    country,
    projects: items,
  }));
}

export function countProjects(regionId: RegionId) {
  return getProjectsByRegion(regionId).length;
}

export function getAllProjectCount() {
  return allProjects.length;
}

export function getPin(pinId: string) {
  return mapPins.find((pin) => pin.id === pinId);
}

export function getProject(projectId: string) {
  return allProjects.find((project) => project.id === projectId);
}
