"use client";
import { motion } from "framer-motion";
import { SplitReveal } from "./SplitReveal";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  meta,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  image?: string;
  meta?: { label: string; value: string }[];
}) {
  return (
    <section className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden bg-ink pb-16 pt-40">
      {image && (
        <>
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        </>
      )}
      <div className="relative mx-auto w-full max-w-[110rem] px-gutter">
        <div className="eyebrow mb-6">{eyebrow}</div>
        <SplitReveal as="h1" className="font-display text-display-xl text-balance text-ivory">
          {title}
        </SplitReveal>
        {lead && <p className="mt-8 max-w-xl text-ivory/75">{lead}</p>}
        {meta && (
          <div className="mt-14 grid max-w-3xl grid-cols-2 gap-8 border-t border-ivory/10 pt-8 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <div className="eyebrow mb-1">{m.label}</div>
                <div className="font-display text-xl text-ivory">{m.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
