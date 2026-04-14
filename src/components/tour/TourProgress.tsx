"use client";
import { cn } from "@/lib/cn";
import { tourStops } from "@/lib/data";

export function TourProgress({
  active,
  onJump,
}: {
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <nav className="fixed right-6 top-1/2 z-40 -translate-y-1/2">
      <ul className="flex flex-col gap-4">
        {tourStops.map((s, i) => (
          <li key={s.id}>
            <button
              onClick={() => onJump(i)}
              className="group relative flex items-center gap-3"
              aria-label={s.name}
            >
              <span
                className={cn(
                  "block h-px origin-right bg-ivory/30 transition-all duration-500 ease-out-expo",
                  active === i ? "w-10 bg-ochre" : "w-4 group-hover:w-8"
                )}
              />
              <span
                className={cn(
                  "block h-1.5 w-1.5 rounded-full border transition-all duration-300",
                  active === i
                    ? "scale-125 border-ochre bg-ochre"
                    : "border-ivory/40 bg-transparent group-hover:border-ivory"
                )}
              />
              <span
                className={cn(
                  "absolute right-full mr-4 whitespace-nowrap font-mono text-[0.6rem] uppercase tracking-[0.22em] transition-opacity duration-300",
                  active === i ? "opacity-100 text-ochre" : "opacity-0 group-hover:opacity-100 text-ivory/60"
                )}
              >
                {s.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
