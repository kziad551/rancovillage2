"use client";
import { amenities } from "@/lib/data";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SplitReveal } from "@/components/shared/SplitReveal";

export function Amenities() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-65%"]);

  return (
    <section ref={ref} className="relative h-[400vh] bg-ink">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-[110rem] items-end justify-between gap-10 px-gutter">
          <div>
            <div className="eyebrow mb-4">Amenities · 04</div>
            <SplitReveal
              as="h2"
              className="max-w-3xl font-display text-display-lg text-balance text-ivory"
            >
              Everything you need, ten steps from your door.
            </SplitReveal>
          </div>
          <div className="hidden font-mono text-[0.65rem] uppercase tracking-[0.24em] text-ivory/40 md:block">
            Drag · Scroll · Horizontal
          </div>
        </div>

        <motion.div style={{ x }} className="mt-16 flex gap-6 px-gutter will-change-transform">
          {amenities.map((a, i) => (
            <div
              key={a.id}
              className="relative aspect-[3/4] w-[72vw] shrink-0 overflow-hidden rounded-sm edge-hairline md:w-[42vw] lg:w-[34vw]"
            >
              <img
                src={a.image}
                alt={a.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ochre">
                  {String(i + 1).padStart(2, "0")} · {a.caption}
                </div>
                <h3 className="mt-3 font-display text-4xl text-ivory">{a.name}</h3>
                <p className="mt-4 max-w-xs text-sm text-ivory/70">{a.description}</p>
              </div>
            </div>
          ))}
          <div className="w-[30vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
