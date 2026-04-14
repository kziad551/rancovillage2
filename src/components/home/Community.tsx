"use client";
import Link from "next/link";
import { SplitReveal } from "@/components/shared/SplitReveal";

export function Community() {
  return (
    <section className="relative overflow-hidden bg-ink py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 animate-marquee whitespace-nowrap"
      >
        <span className="font-display text-[24vw] leading-none text-ochre/[0.04]">
          ranco · al manar · riyadh · ranco · al manar · riyadh ·
        </span>
      </div>

      <div className="relative mx-auto grid max-w-[110rem] grid-cols-12 gap-6 px-gutter">
        <div className="col-span-12 md:col-span-7">
          <div className="eyebrow mb-6">Community · 05</div>
          <SplitReveal
            as="h2"
            className="font-display text-display-lg text-balance text-ivory"
          >
            A neighborhood that remembers your name.
          </SplitReveal>
          <p className="mt-8 max-w-lg text-ivory/70">
            From Saturday morning pool hours to Ramadan majlis nights, Ranco has grown into
            something more than an address. Current residents — ask about the community
            portal and upcoming events.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-ochre px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-ink transition hover:bg-ivory"
            >
              Schedule a visit →
            </Link>
            <Link
              href="/amenities"
              className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-ivory/80 transition hover:border-ivory/60 hover:text-ivory"
            >
              Explore amenities
            </Link>
          </div>
        </div>

        <aside className="col-span-12 rounded-sm border border-ivory/10 bg-ink2 p-10 md:col-span-5">
          <div className="eyebrow mb-4">Residents</div>
          <h4 className="font-display text-2xl text-ivory">
            A digital home for the community.
          </h4>
          <p className="mt-4 text-sm text-ivory/70">
            Submit maintenance requests, manage documents, and stay in touch with
            management — all from the resident portal.
          </p>
          <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 text-sm">
            <Row k="Email" v="Info@rancovillage.net" />
            <Row k="Location" v="Al Manar, Riyadh" />
            <Row k="Metro" v="Al Salam · Purple Line · 3 min" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="eyebrow">{k}</span>
      <span className="text-right text-ivory/80">{v}</span>
    </div>
  );
}
