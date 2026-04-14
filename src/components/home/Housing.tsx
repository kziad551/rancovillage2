"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { SplitReveal } from "@/components/shared/SplitReveal";

const TYPES = [
  {
    label: "Apartments",
    href: "/apartments",
    range: "1–3.5 br · 51–165 sqm",
    lead: "Tower and wing plans — light, elevated, quiet.",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    n: "04",
  },
  {
    label: "Bungalows",
    href: "/bungalows",
    range: "2–4 br · 115–230 sqm",
    lead: "Single-level homes with walled patios onto the gardens.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
    n: "03",
  },
  {
    label: "Townhouses",
    href: "/townhouses",
    range: "3–4 br · 173–230 sqm",
    lead: "Three-story plans with private roof terraces.",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=80",
    n: "03",
  },
];

export function Housing() {
  return (
    <section className="relative bg-ink2 py-32">
      <div className="mx-auto max-w-[110rem] px-gutter">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-10">
          <div>
            <div className="eyebrow mb-4">Housing · 02</div>
            <SplitReveal
              as="h2"
              className="max-w-3xl font-display text-display-lg text-balance text-ivory"
            >
              Ten unit plans, one compound.
            </SplitReveal>
          </div>
          <p className="max-w-sm text-ivory/60">
            Every unit is fully furnished with kitchen, laundry, and climate control.
            No two layouts are identical — pick the one that fits your life, not the
            other way around.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {TYPES.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={t.href}
                className="group relative block overflow-hidden rounded-sm bg-ink edge-hairline"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.label}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <div className="absolute right-5 top-5 font-mono text-xs text-ivory/50">{t.n} plans</div>
                </div>
                <div className="flex items-end justify-between gap-4 p-7">
                  <div>
                    <h3 className="font-display text-3xl text-ivory">{t.label}</h3>
                    <div className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-ochre">
                      {t.range}
                    </div>
                    <p className="mt-4 max-w-xs text-sm text-ivory/60">{t.lead}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-ivory/20 p-3 transition group-hover:border-ochre group-hover:bg-ochre group-hover:text-ink">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M7 17L17 7M17 7H8M17 7V16" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
