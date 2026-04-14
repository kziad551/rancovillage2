"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import CompoundLazy from "@/components/3d/CompoundLazy";
import { Magnetic } from "@/components/shared/Magnetic";

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[760px] w-full overflow-hidden bg-ink">
      {/* 3D scene as background */}
      <div className="absolute inset-0">
        <CompoundLazy />
      </div>

      {/* gradient scrims to protect legibility without hiding the 3D */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,11,8,0.85)_0%,rgba(14,11,8,0.35)_35%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink via-ink/70 to-transparent"
      />

      {/* top meta rail */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-gutter pt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="eyebrow"
        >
          Ranco Village · Al Manar · Riyadh
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45 }}
          className="hidden text-right font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ivory/50 md:block"
        >
          24.7° N · 46.7° E
          <br />
          interactive · drag &amp; click
        </motion.div>
      </div>

      {/* headline — asymmetric, upper-left */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-start px-gutter pb-40 md:items-center md:pb-0">
        <div className="pointer-events-auto max-w-[40rem] md:max-w-[44rem]">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-lg font-semibold leading-[0.95] text-ivory"
          >
            A home in <em className="italic text-ochre">Riyadh,</em>
            <br />
            away from <span className="text-outline">home.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-8 max-w-md text-pretty text-sm text-ivory/75 md:text-base"
          >
            A premium Western residential compound — ten unit plans across apartments,
            bungalows and townhouses. Gardens, pool, fitness center, 24/7 security.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
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
                className="inline-flex items-center gap-2 rounded-full border border-ivory/20 bg-ink/40 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.22em] text-ivory/85 backdrop-blur transition hover:border-ivory/60 hover:text-ivory"
              >
                Browse housing
              </Link>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="pointer-events-none absolute inset-x-0 bottom-28 flex justify-center"
      >
        <div className="flex flex-col items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-ivory/40">
          <span>scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-px bg-ochre/70"
          />
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
