"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Unit } from "@/lib/data";
import { units } from "@/lib/data";
import { SplitReveal } from "./SplitReveal";

export function UnitDetail({ unit }: { unit: Unit }) {
  const related = units.filter((u) => u.category === unit.category && u.slug !== unit.slug).slice(0, 3);

  return (
    <>
      <section className="relative flex min-h-[90vh] items-end overflow-hidden pb-16 pt-40">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img src={unit.image} alt={unit.label} className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />

        <div className="relative mx-auto w-full max-w-[110rem] px-gutter">
          <Link href={`/${unit.category}`} className="eyebrow inline-flex items-center gap-2 hover:text-ivory">
            ← {unit.category}
          </Link>
          <SplitReveal as="h1" className="mt-6 max-w-4xl font-display text-display-xl text-balance text-ivory">
            {unit.label}
          </SplitReveal>
          <p className="mt-6 max-w-lg text-lg italic text-ochre">{unit.tagline}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[110rem] grid-cols-12 gap-8 px-gutter py-24">
        <div className="col-span-12 md:col-span-7">
          <div className="eyebrow mb-3">Overview</div>
          <p className="max-w-xl text-lg text-ivory/80">{unit.description}</p>

          <div className="mt-14 grid grid-cols-2 gap-6">
            {unit.features.map((f) => (
              <div key={f} className="flex items-start gap-4 border-t border-ivory/10 pt-5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ochre" />
                <span className="text-sm text-ivory/85">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="col-span-12 md:col-span-5">
          <div className="sticky top-28 rounded-sm border border-ivory/10 bg-ink2 p-8">
            <div className="eyebrow mb-6">Specifications</div>
            <dl className="flex flex-col gap-4 text-sm">
              <Row k="Category" v={unit.category} />
              <Row k="Bedrooms" v={unit.bedrooms} />
              <Row k="Area" v={unit.area} />
              <Row k="Furnishing" v="Fully furnished" />
              <Row k="Lease" v="Monthly / Yearly" />
              <Row k="Utilities" v="On request" />
            </dl>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-ink transition hover:bg-ivory"
              >
                Schedule a visit →
              </Link>
              <Link
                href="/virtual-tour"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ivory/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-ivory/80 transition hover:border-ivory/60 hover:text-ivory"
              >
                Take the virtual tour
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[110rem] px-gutter pb-32">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-display-md text-ivory">Other {unit.category}</h2>
            <Link
              href={`/${unit.category}`}
              className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-ivory/60 hover:text-ochre"
            >
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {related.map((u) => (
              <Link
                key={u.slug + u.label}
                href={`/${u.category}/${u.slug}`}
                className="group relative block overflow-hidden rounded-sm border border-ivory/5 bg-ink2"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={u.image}
                    alt={u.label}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-ochre">{u.area}</div>
                  <h3 className="mt-2 font-display text-xl text-ivory">{u.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ivory/5 pb-3 last:border-none last:pb-0">
      <dt className="eyebrow">{k}</dt>
      <dd className="capitalize text-ivory/85">{v}</dd>
    </div>
  );
}
