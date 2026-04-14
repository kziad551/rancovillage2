"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function TourTeaser() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={ref} className="relative h-[120vh] bg-ink">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
        </motion.div>

        <motion.div style={{ y }} className="relative z-10 mx-auto flex h-full max-w-[110rem] flex-col justify-between px-gutter py-32">
          <div className="eyebrow text-ochre">Virtual Tour · 03</div>

          <div>
            <h2 className="font-display text-display-xl text-balance text-ivory">
              Walk the <em className="italic text-ochre">compound</em><br />
              from wherever you are.
            </h2>
            <p className="mt-8 max-w-xl text-ivory/75">
              A scroll-driven walkthrough of eight rooms and common spaces. No headset,
              no download — just the browser, and a little patience. Best with sound on.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <Link
              href="/virtual-tour"
              className="group inline-flex items-center gap-4 rounded-full bg-ivory px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-ink transition hover:bg-ochre"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-terracotta" />
              Enter the tour
              <span className="transition-transform group-hover:translate-x-1.5">→</span>
            </Link>
            <div className="flex gap-8 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-ivory/50">
              <span>8 stops</span>
              <span>4 minutes</span>
              <span>scroll-driven</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
