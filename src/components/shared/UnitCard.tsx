"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Unit } from "@/lib/data";

export function UnitCard({ unit, index }: { unit: Unit; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-sm border border-ivory/5 bg-ink2"
    >
      <Link href={`/${unit.category}/${unit.slug}`} className="block">
        <div className="relative aspect-[5/4] overflow-hidden">
          <img
            src={unit.image}
            alt={unit.label}
            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-smooth group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
          <div className="absolute right-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-ochre backdrop-blur">
            {unit.bedrooms}
          </div>
        </div>
        <div className="p-7">
          <div className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-ivory/50">
            {String(index + 1).padStart(2, "0")} · {unit.area}
          </div>
          <h3 className="mt-3 font-display text-2xl text-ivory">{unit.label}</h3>
          <p className="mt-2 text-sm italic text-ochre/90">{unit.tagline}</p>
          <p className="mt-4 line-clamp-2 text-sm text-ivory/60">{unit.description}</p>
          <div className="mt-6 flex items-center justify-between">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-ivory/70">
              View details
            </span>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 transition group-hover:border-ochre group-hover:bg-ochre group-hover:text-ink">
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
