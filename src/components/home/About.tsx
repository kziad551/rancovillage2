"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { SplitReveal } from "@/components/shared/SplitReveal";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={ref} className="relative bg-ink py-40">
      <div className="mx-auto grid max-w-[110rem] grid-cols-12 gap-6 px-gutter">
        <div className="col-span-12 md:col-span-5">
          <div className="eyebrow mb-6">About · 01</div>
          <SplitReveal
            as="h2"
            className="font-display text-display-lg text-balance text-ivory"
          >
            A compound built around the way residents actually live.
          </SplitReveal>
          <div className="mt-10 max-w-md space-y-5 text-ivory/70">
            <p>
              Ranco Village has been home to expatriates working across Riyadh&apos;s ministries,
              hospitals and firms for over a decade. What keeps them here is not the amenity
              list — it is the feeling that a compound, when done right, is a small city you
              can trust.
            </p>
            <p>
              Managed end-to-end by Ma&apos;ather Property Management. One point of contact for
              leasing, maintenance, and the hundred small things that make a house a home.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8">
            {[
              ["Established", "Managed by Ma'ather"],
              ["Neighborhood", "Al Manar, Riyadh"],
              ["Metro", "Al Salam · Purple Line"],
              ["Management", "End-to-end concierge"],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="eyebrow mb-1">{k}</div>
                <div className="text-sm text-ivory/80">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative col-span-12 md:col-span-7">
          <div className="grid grid-cols-6 gap-4">
            <motion.div
              style={{ y: y1 }}
              className="col-span-4 aspect-[4/5] overflow-hidden rounded-sm edge-hairline"
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
                alt=""
                className="h-full w-full object-cover grayscale-[15%]"
              />
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              className="col-span-2 mt-24 aspect-[3/4] overflow-hidden rounded-sm edge-hairline"
            >
              <img
                src="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=800&q=80"
                alt=""
                className="h-full w-full object-cover grayscale-[30%]"
              />
            </motion.div>
            <motion.div
              style={{ y: y1 }}
              className="col-span-3 aspect-[4/3] overflow-hidden rounded-sm edge-hairline"
            >
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1100&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              className="col-span-3 aspect-[4/3] overflow-hidden rounded-sm edge-hairline"
            >
              <img
                src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1100&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-16 select-none font-display text-[16rem] leading-none tracking-tightest text-ivory/[0.03]"
          >
            01
          </div>
        </div>
      </div>
    </section>
  );
}
