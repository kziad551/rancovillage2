export type HousingCategory = "apartments" | "bungalows" | "townhouses";

export type Unit = {
  slug: string;
  category: HousingCategory;
  label: string;
  bedrooms: string;
  area: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
};

export const units: Unit[] = [
  {
    slug: "studio",
    category: "apartments",
    label: "1 Bedroom Apartment",
    bedrooms: "1 br",
    area: "51–74 sqm",
    tagline: "Compact, composed, west-light",
    description:
      "A thoughtful single-bedroom apartment for professionals who prefer stillness. Full kitchen, private balcony, and resident-only amenities downstairs.",
    features: ["Fully furnished", "Private balcony", "In-unit laundry", "Smart AC zoning"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "1bed",
    category: "apartments",
    label: "2 Bedroom Apartment",
    bedrooms: "2 br",
    area: "100–136 sqm",
    tagline: "Generous rooms, quiet floors",
    description:
      "Ideal for couples or small families. Two full bedrooms, open living with dining, and access to the compound's garden courtyards.",
    features: ["Two baths", "Open-plan living", "Shaded balcony", "Garden courtyard access"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "2bed",
    category: "apartments",
    label: "2.5 Bedroom Apartment",
    bedrooms: "2.5 br",
    area: "152 sqm",
    tagline: "A room to spare",
    description:
      "Two bedrooms plus a study or nursery. Designed for residents who work from home or host family often.",
    features: ["Home-office room", "Walk-in pantry", "Two balconies", "Concierge floor"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "3bed",
    category: "apartments",
    label: "3.5 Bedroom Apartment",
    bedrooms: "3.5 br",
    area: "165 sqm",
    tagline: "Our largest apartment plan",
    description:
      "Three bedrooms, a maid's room, and a full entertainment living space. The flagship apartment at Ranco.",
    features: ["Maid's quarters", "Formal + family living", "Three baths", "Private entry hall"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "3bed",
    category: "bungalows",
    label: "2 Bedroom Bungalow",
    bedrooms: "2 br",
    area: "115 sqm",
    tagline: "Ground-floor living, private patio",
    description:
      "A single-level bungalow with a walled patio opening onto the gardens. Zero stairs, total privacy.",
    features: ["Private walled patio", "Step-free entry", "Patio dining", "Direct garden access"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "4bed",
    category: "bungalows",
    label: "3 Bedroom Bungalow",
    bedrooms: "3 br",
    area: "173–196 sqm",
    tagline: "Family-scale, garden-level",
    description:
      "Three bedrooms arranged around a central living court. Every bedroom has a window to green.",
    features: ["Three bedrooms", "Central living court", "Two patios", "Pool view available"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "5bed",
    category: "bungalows",
    label: "4 Bedroom Bungalow",
    bedrooms: "4 br",
    area: "230 sqm",
    tagline: "Our largest single-level home",
    description:
      "Four bedrooms, double patios, a detached maid's room, and a private service entrance.",
    features: ["Four bedrooms", "Detached maid's room", "Double patios", "Service entrance"],
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "3bed",
    category: "townhouses",
    label: "3 Bedroom Townhouse",
    bedrooms: "3 br",
    area: "173–196 sqm",
    tagline: "Three floors, one family",
    description:
      "A three-story townhouse with a ground-floor majlis, first-floor family quarters, and a private roof terrace.",
    features: ["Three stories", "Roof terrace", "Private majlis", "Interior courtyard"],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "3-5bed",
    category: "townhouses",
    label: "3.5 Bedroom Townhouse",
    bedrooms: "3.5 br",
    area: "196 sqm",
    tagline: "A study added, a whole different life",
    description:
      "A three-bedroom townhouse plus a dedicated study/nursery and an expanded kitchen-dining room.",
    features: ["Dedicated study", "Expanded kitchen", "Roof terrace", "Dual living"],
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1600&q=80",
  },
  {
    slug: "4bed",
    category: "townhouses",
    label: "4 Bedroom Townhouse",
    bedrooms: "4 br",
    area: "230 sqm",
    tagline: "Our most spacious townhouse",
    description:
      "Four bedrooms across three floors with a roof majlis, generous storage, and a private garage bay.",
    features: ["Four bedrooms", "Rooftop majlis", "Garage bay", "Staff quarters"],
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
  },
];

export const amenities = [
  {
    id: "pool",
    name: "Swimming Pool",
    caption: "Open daily · Heated in winter",
    description:
      "A 25-meter pool shaded by date palms, with a shallow family section and sun terrace.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "gym",
    name: "Fitness Center",
    caption: "24/7 access · Technogym equipment",
    description:
      "A full fitness floor with cardio, free weights, and a mirrored stretching studio.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "gardens",
    name: "Landscaped Gardens",
    caption: "2.4 hectares · Native desert flora",
    description:
      "Quiet walking paths through shaded gardens of olive, lemon, and bougainvillea.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "security",
    name: "24/7 Security",
    caption: "Gated · CCTV · On-site concierge",
    description:
      "Manned gates, discreet CCTV, and a resident concierge on call through the night.",
    image: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "community",
    name: "Community Spaces",
    caption: "Playground · Majlis · Café",
    description:
      "Shared spaces built for neighbors: a children's play area, reading majlis and small café.",
    image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1600&q=80",
  },
];

export const tourStops = [
  {
    id: "entrance",
    name: "Compound Entrance",
    caption: "01 · Arrival",
    copy: "A quiet gate in Al Manar opens onto the main avenue — date palms, warm stone, the hush of the city behind you.",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1800&q=80",
    hotspots: [
      { label: "Concierge", pos: [35, 62] },
      { label: "Gate 01", pos: [70, 44] },
    ],
  },
  {
    id: "living",
    name: "Living Room",
    caption: "02 · Daylight rooms",
    copy: "Double-height ceilings, west-facing windows, and a deep sectional oriented toward the garden.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80",
    hotspots: [
      { label: "Reading corner", pos: [22, 56] },
      { label: "Balcony", pos: [78, 50] },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    caption: "03 · Chef's galley",
    copy: "A full galley kitchen in white oak and brushed brass. Induction cooktop. Quiet fan. Room to cook for ten.",
    image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?auto=format&fit=crop&w=1800&q=80",
    hotspots: [
      { label: "Pantry", pos: [30, 64] },
      { label: "Island", pos: [64, 58] },
    ],
  },
  {
    id: "bedroom",
    name: "Master Bedroom",
    caption: "04 · Sleep",
    copy: "A king bedroom with a walk-in closet and en-suite bath. Blackout drapes for noon-nap light.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=80",
    hotspots: [
      { label: "Walk-in", pos: [28, 58] },
      { label: "Vanity", pos: [72, 48] },
    ],
  },
  {
    id: "bath",
    name: "Bathroom",
    caption: "05 · Water",
    copy: "Rain shower, soaking tub, and honed travertine floors. A skylight above the mirror.",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1800&q=80",
    hotspots: [{ label: "Skylight", pos: [55, 24] }],
  },
  {
    id: "pool",
    name: "Swimming Pool",
    caption: "06 · Shared water",
    copy: "A 25-meter pool under date palms. Family hours morning and evening, adult-only midday.",
    image: "https://images.unsplash.com/photo-1533632359083-0185df1be85d?auto=format&fit=crop&w=1800&q=80",
    hotspots: [
      { label: "Cabanas", pos: [20, 60] },
      { label: "Shallow end", pos: [70, 66] },
    ],
  },
  {
    id: "gym",
    name: "Fitness Center",
    caption: "07 · Motion",
    copy: "A full Technogym fitness floor with a mirrored stretch studio. Open day and night.",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1800&q=80",
    hotspots: [
      { label: "Weights", pos: [25, 60] },
      { label: "Studio", pos: [72, 52] },
    ],
  },
  {
    id: "gardens",
    name: "Gardens & Walkways",
    caption: "08 · Outside",
    copy: "Olive, lemon, and bougainvillea along shaded walkways. Children on bikes, always.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=80",
    hotspots: [
      { label: "Majlis grove", pos: [30, 55] },
      { label: "Play area", pos: [75, 62] },
    ],
  },
];

export type TourStop = (typeof tourStops)[number];
