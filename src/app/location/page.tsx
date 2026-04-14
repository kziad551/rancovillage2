import { PageHero } from "@/components/shared/PageHero";

export const metadata = { title: "Location · Ranco Village" };

const places = [
  { name: "Al Salam Metro (Purple Line)", time: "3 min walk" },
  { name: "King Khalid International Airport", time: "25 min drive" },
  { name: "Kingdom Centre & Olaya", time: "15 min drive" },
  { name: "Diplomatic Quarter (DQ)", time: "20 min drive" },
  { name: "King Saud University Hospital", time: "12 min drive" },
  { name: "Al Nakheel Mall", time: "10 min drive" },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Community · Location"
        title="Al Manar, central Riyadh."
        lead="A quiet pocket of the city with everything within a short drive or metro ride. Three minutes on foot to the Al Salam stop on the Purple Line."
        image="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=2200&q=80"
        meta={[
          { label: "District", value: "Al Manar" },
          { label: "City", value: "Riyadh" },
          { label: "Metro", value: "3 min walk" },
          { label: "Airport", value: "25 min" },
        ]}
      />

      <section className="mx-auto grid max-w-[110rem] grid-cols-12 gap-8 px-gutter py-24">
        <div className="col-span-12 md:col-span-5">
          <div className="eyebrow mb-4">Nearby</div>
          <h2 className="font-display text-display-md text-ivory">
            Everything you might need, within 25 minutes.
          </h2>
          <ul className="mt-10 flex flex-col divide-y divide-ivory/10 border-y border-ivory/10">
            {places.map((p) => (
              <li key={p.name} className="flex items-baseline justify-between py-4">
                <span className="text-ivory/80">{p.name}</span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ochre">{p.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 md:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm edge-hairline">
            <iframe
              title="Ranco Village map"
              className="h-full w-full grayscale-[20%]"
              src="https://www.google.com/maps?q=Al+Manar,+Riyadh&output=embed"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ivory/10" />
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-[0.24em] text-ivory/50">
            <span>24.7° N · 46.7° E</span>
            <a
              href="https://maps.google.com/?q=Al+Manar,+Riyadh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ochre"
            >
              Open in Maps ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
