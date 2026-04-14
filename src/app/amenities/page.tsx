import { PageHero } from "@/components/shared/PageHero";
import { amenities } from "@/lib/data";

export const metadata = { title: "Amenities · Ranco Village" };

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Community · Amenities"
        title="Everything a compound should be."
        lead="Resident-only amenities, curated and maintained by Ma'ather. Quiet spaces and shared spaces, arranged so neither gets in the other's way."
        image="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=2200&q=80"
        meta={[
          { label: "Pool", value: "25m" },
          { label: "Gym", value: "24/7" },
          { label: "Gardens", value: "2.4 ha" },
          { label: "Security", value: "Gated" },
        ]}
      />
      <section className="mx-auto max-w-[110rem] px-gutter py-24">
        <div className="space-y-28">
          {amenities.map((a, i) => (
            <article key={a.id} className={`grid grid-cols-12 gap-8 ${i % 2 === 1 ? "[&>figure]:md:order-2" : ""}`}>
              <figure className="col-span-12 overflow-hidden rounded-sm edge-hairline md:col-span-7">
                <img src={a.image} alt={a.name} className="h-full w-full object-cover" />
              </figure>
              <div className="col-span-12 flex flex-col justify-center md:col-span-5">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ochre">
                  {String(i + 1).padStart(2, "0")} · {a.caption}
                </div>
                <h2 className="mt-4 font-display text-display-md text-ivory">{a.name}</h2>
                <p className="mt-6 max-w-md text-ivory/75">{a.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
