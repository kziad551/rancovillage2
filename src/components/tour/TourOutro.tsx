"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export function TourOutro() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ochre/10 via-transparent to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-3xl px-gutter text-center"
      >
        <div className="eyebrow mb-6">End of tour · Next steps</div>
        <h2 className="font-display text-display-lg text-balance text-ivory">
          Now come <em className="italic text-ochre">see it</em> in person.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-ivory/70">
          Book a private walkthrough of the compound. Bring your questions — leasing,
          fit-out, maintenance policy, community guidelines. We&apos;ll answer them all.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 rounded-full bg-ochre px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-ink transition hover:bg-ivory"
          >
            Schedule a visit →
          </Link>
          <Link
            href="/apartments"
            className="inline-flex items-center gap-3 rounded-full border border-ivory/20 px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-ivory/80 transition hover:border-ivory/60 hover:text-ivory"
          >
            Browse housing
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
