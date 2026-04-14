"use client";
import { motion } from "framer-motion";
import CompoundLazy from "@/components/3d/CompoundLazy";

export function TourIntro() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <CompoundLazy autoOrbit />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />

      <div className="pointer-events-none absolute inset-x-0 top-28 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="eyebrow"
        >
          The Virtual Tour · eight stops · four minutes
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-gutter">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display text-display-xl font-semibold text-ivory"
        >
          Scroll to <em className="italic text-ochre">enter</em><br />
          the compound.
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
      >
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.28em] text-ivory/50">
          begin
        </div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-ochre"
        />
      </motion.div>
    </section>
  );
}
