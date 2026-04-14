"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

const NAV = [
  {
    label: "Housing",
    children: [
      { label: "Apartments", href: "/apartments" },
      { label: "Bungalows", href: "/bungalows" },
      { label: "Townhouses", href: "/townhouses" },
    ],
  },
  {
    label: "Community",
    children: [
      { label: "Amenities", href: "/amenities" },
      { label: "Location", href: "/location" },
    ],
  },
  { label: "Virtual Tour", href: "/virtual-tour" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth",
        scrolled ? "backdrop-blur-xl bg-ink/75 border-b border-ivory/5" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-[110rem] items-center justify-between px-gutter py-4">
        <Link href="/" className="group flex items-baseline gap-2 select-none">
          <span className="font-display text-xl tracking-display text-ivory">Ranco</span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.32em] text-ochre">Village</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) =>
            "children" in item ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="px-4 py-2 text-sm text-ivory/80 transition hover:text-ochre">
                  {item.label}
                </button>
                <AnimatePresence>
                  {openMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                    >
                      <div className="min-w-[13rem] rounded-xl border border-ivory/10 bg-ink2/95 p-2 shadow-2xl backdrop-blur-xl">
                        {item.children!.map((c) => (
                          <Link
                            key={c.href}
                            href={c.href}
                            className="block rounded-lg px-3 py-2 text-sm text-ivory/80 transition hover:bg-ivory/5 hover:text-ochre"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-ivory/80 transition hover:text-ochre"
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="/contact"
            className="group ml-4 inline-flex items-center gap-2 rounded-full border border-ochre/40 bg-ochre/10 px-5 py-2 text-sm text-ochre transition hover:bg-ochre hover:text-ink"
          >
            Schedule a visit
            <span className="font-mono">↗</span>
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden relative h-8 w-8 text-ivory"
          aria-label="Menu"
        >
          <span
            className={cn(
              "absolute left-1 right-1 top-2.5 h-px bg-ivory transition-transform",
              open && "translate-y-[5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "absolute left-1 right-1 top-4 h-px bg-ivory transition-transform",
              open && "-translate-y-[3px] -rotate-45"
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-ivory/5 bg-ink/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV.flatMap((item) =>
                "children" in item
                  ? [
                      <div key={item.label} className="eyebrow mt-3 px-3">
                        {item.label}
                      </div>,
                      ...item.children!.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="px-3 py-2 text-ivory/80 hover:text-ochre"
                        >
                          {c.label}
                        </Link>
                      )),
                    ]
                  : [
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="px-3 py-2 text-ivory/80 hover:text-ochre"
                      >
                        {item.label}
                      </Link>,
                    ]
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
