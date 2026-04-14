"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { TourStop as Stop } from "@/lib/data";

export function TourStop({
  stop,
  index,
  total,
}: {
  stop: Stop;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.02, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const overlay = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0.85, 0.2, 0.2, 0.9]);
  const textY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], ["40%", "0%", "-30%"]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.65, 0.85], [0, 1, 1, 0]);
  const letterSpread = useTransform(scrollYProgress, [0, 0.5, 1], ["0.25em", "0em", "0.3em"]);

  const evenSide = index % 2 === 0;

  return (
    <section
      ref={ref}
      id={`stop-${stop.id}`}
      data-stop-index={index}
      className="relative flex h-screen w-full items-end overflow-hidden"
    >
      <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0 will-change-transform">
        <img src={stop.image} alt={stop.name} className="h-full w-full object-cover" />
      </motion.div>

      <motion.div style={{ opacity: overlay }} className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/20" />

      {/* Hotspots */}
      {stop.hotspots?.map((h, i) => (
        <motion.div
          key={i}
          style={{ opacity: textOpacity }}
          className="absolute z-10"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="relative"
            style={{ transform: `translate(${h.pos[0]}vw, ${h.pos[1]}vh) translate(-50%, -50%)` }}
          >
            <div className="absolute inset-0 -z-10 h-8 w-8 animate-ping rounded-full bg-ochre/40" />
            <div className="h-3 w-3 rounded-full border border-ochre bg-ochre/30" />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-ochre/40 bg-ink/80 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ochre backdrop-blur">
              {h.label}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Stop number - huge display type */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        aria-hidden
        className={`pointer-events-none absolute ${
          evenSide ? "left-gutter" : "right-gutter"
        } top-[18%] font-display text-[30vw] font-semibold leading-none tracking-tightest text-ivory/[0.07]`}
      >
        {String(index + 1).padStart(2, "0")}
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className={`relative z-20 mx-auto flex w-full max-w-[110rem] ${
          evenSide ? "justify-start" : "justify-end"
        } px-gutter pb-28`}
      >
        <div className="max-w-xl">
          <motion.div
            style={{ letterSpacing: letterSpread }}
            className="mb-6 font-mono text-xs uppercase text-ochre"
          >
            {stop.caption}
          </motion.div>
          <h2 className="font-display text-display-lg text-balance text-ivory">
            {stop.name}
          </h2>
          <p className="mt-6 max-w-md text-ivory/80">{stop.copy}</p>

          <div className="mt-10 flex items-center gap-4 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-ivory/50">
            <span>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="h-px w-10 bg-ivory/20" />
            <span>{stop.id}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
