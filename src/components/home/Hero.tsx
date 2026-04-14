"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import CompoundLazy from "@/components/3d/CompoundLazy";
import { Magnetic } from "@/components/shared/Magnetic";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <CompoundLazy />
      </div>

      {/* top-left meta */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-gutter pt-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="eyebrow"
        >
          Ranco Village · Al Manar · Riyadh
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="hidden text-right font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ivory/50 md:block"
        >
          24.7° N · 46.7° E<br />
          interactive · click a building
        </motion.div>
      </div>

      {/* center title */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-gutter">
        <div className="max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-xl font-semibold text-ivory"
          >
            A home in <em className="italic text-ochre">Riyadh,</em><br />
            away from <span className="text-outline">home.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mx-auto mt-8 max-w-xl text-pretty text-sm text-ivory/70 md:text-base"
          >
            A premium Western residential compound — apartments, bungalows, townhouses,
            gardens, pool, fitness center, and 24/7 security. Designed for residents who
            expect more than a lease.
          </motion.p>
        </div>
      </div>

      {/* CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-6 px-gutter"
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Link
              href="/virtual-tour"
              className="group inline-flex items-center gap-3 rounded-full bg-ochre px-7 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-ink transition hover:bg-ivory"
            >
              Begin virtual tour
              <span className="text-base leading-none transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/apartments"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-ivory/80 transition hover:border-ivory/60 hover:text-ivory"
            >
              Browse housing
            </Link>
          </Magnetic>
        </div>

        <div className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ivory/40">
          <span className="h-px w-8 bg-ivory/20" />
          scroll
          <span className="h-px w-8 bg-ivory/20" />
        </div>
      </motion.div>

      {/* bottom stats rail */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden border-t border-ivory/5 bg-ink/60 backdrop-blur-md md:block">
        <div className="mx-auto grid max-w-[110rem] grid-cols-4 divide-x divide-ivory/5 px-gutter">
          {[
            ["Site area", "2.4 ha"],
            ["Unit types", "10+"],
            ["To metro", "3 min"],
            ["Security", "24/7"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-3 py-4">
              <span className="eyebrow">{k}</span>
              <span className="font-display text-lg text-ivory">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
