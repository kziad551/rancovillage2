"use client";
import { useEffect, useState } from "react";
import { tourStops } from "@/lib/data";
import { TourIntro } from "./TourIntro";
import { TourStop } from "./TourStop";
import { TourOutro } from "./TourOutro";
import { TourProgress } from "./TourProgress";

export function TourShell() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Hide the global navbar & footer only on this page
    document.documentElement.dataset.tour = "1";
    const style = document.createElement("style");
    style.innerHTML = `header, footer { display: none !important; }`;
    document.head.appendChild(style);
    return () => {
      document.documentElement.removeAttribute("data-tour");
      style.remove();
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-stop-index]");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const i = Number((e.target as HTMLElement).dataset.stopIndex ?? 0);
            setActive(i);
          }
        });
      },
      { threshold: [0.5, 0.75] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const jump = (i: number) => {
    const el = document.getElementById(`stop-${tourStops[i].id}`);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-ink">
      {/* floating mini-nav */}
      <div className="fixed left-gutter top-8 z-40 hidden items-center gap-3 md:flex">
        <a href="/" className="flex items-baseline gap-2 text-ivory">
          <span className="font-display text-xl">Ranco</span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ochre">Village</span>
        </a>
      </div>
      <a
        href="/"
        className="fixed right-gutter top-8 z-40 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-ivory/70 hover:text-ochre"
      >
        ← Exit tour
      </a>

      <TourIntro />
      {tourStops.map((s, i) => (
        <TourStop key={s.id} stop={s} index={i} total={tourStops.length} />
      ))}
      <TourOutro />

      <TourProgress active={active} onJump={jump} />
    </div>
  );
}
