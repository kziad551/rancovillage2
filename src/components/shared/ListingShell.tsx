import { PageHero } from "./PageHero";
import { UnitCard } from "./UnitCard";
import { units, HousingCategory } from "@/lib/data";

const COPY: Record<HousingCategory, { eyebrow: string; title: string; lead: string; image: string; meta: { label: string; value: string }[] }> = {
  apartments: {
    eyebrow: "Housing · Apartments",
    title: "Apartments at Ranco.",
    lead: "Tower and wing plans across four layouts. Quiet floors, elevator access, concierge on the ground floor.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2200&q=80",
    meta: [
      { label: "Plans", value: "4" },
      { label: "Size range", value: "51–165 sqm" },
      { label: "Bedrooms", value: "1 – 3.5" },
      { label: "Amenities", value: "Full" },
    ],
  },
  bungalows: {
    eyebrow: "Housing · Bungalows",
    title: "Bungalows at Ranco.",
    lead: "Single-level homes with walled patios opening onto the landscaped gardens.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2200&q=80",
    meta: [
      { label: "Plans", value: "3" },
      { label: "Size range", value: "115–230 sqm" },
      { label: "Bedrooms", value: "2 – 4" },
      { label: "Step-free", value: "Yes" },
    ],
  },
  townhouses: {
    eyebrow: "Housing · Townhouses",
    title: "Townhouses at Ranco.",
    lead: "Three-story homes with private roof terraces, interior courtyards, and dedicated majlis.",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=2200&q=80",
    meta: [
      { label: "Plans", value: "3" },
      { label: "Size range", value: "173–230 sqm" },
      { label: "Bedrooms", value: "3 – 4" },
      { label: "Stories", value: "3" },
    ],
  },
};

export function ListingShell({ category }: { category: HousingCategory }) {
  const list = units.filter((u) => u.category === category);
  const meta = COPY[category];
  return (
    <>
      <PageHero {...meta} />
      <section className="mx-auto max-w-[110rem] px-gutter py-24">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-3">Plans available</div>
            <h2 className="font-display text-display-md text-ivory">
              {list.length} {list.length === 1 ? "layout" : "layouts"}
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ivory/60">
            Each plan is fully furnished. Pricing varies with level, orientation, and
            lease terms — contact us for a tailored quote.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((u, i) => (
            <UnitCard key={`${u.category}-${u.slug}-${i}`} unit={u} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
