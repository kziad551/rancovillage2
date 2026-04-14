import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-ivory/5 bg-ink">
      <div className="mx-auto max-w-[110rem] px-gutter py-20">
        <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="eyebrow mb-4">Ranco Village</div>
            <h3 className="font-display text-display-md text-balance text-ivory">
              A home in Riyadh, <em className="text-ochre not-italic">away from home.</em>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-10 md:grid-cols-3 md:gap-14">
            <FooterCol
              title="Housing"
              links={[
                { label: "Apartments", href: "/apartments" },
                { label: "Bungalows", href: "/bungalows" },
                { label: "Townhouses", href: "/townhouses" },
              ]}
            />
            <FooterCol
              title="Community"
              links={[
                { label: "Amenities", href: "/amenities" },
                { label: "Virtual Tour", href: "/virtual-tour" },
                { label: "Location", href: "/location" },
              ]}
            />
            <FooterCol
              title="Contact"
              links={[
                { label: "Schedule a visit", href: "/contact" },
                { label: "Info@rancovillage.net", href: "mailto:Info@rancovillage.net" },
                { label: "Al Manar, Riyadh", href: "/location" },
              ]}
            />
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-ivory/5 pt-8 text-xs text-ivory/40 md:flex-row md:items-center">
          <div className="font-mono uppercase tracking-[0.28em]">
            © {new Date().getFullYear()} Ma&apos;ather Property Management LLC
          </div>
          <div className="font-mono uppercase tracking-[0.28em]">
            Al Salam Metro · Purple Line · 3 min walk
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden">
        <div
          className="select-none whitespace-nowrap bg-gradient-to-b from-ivory/10 to-transparent bg-clip-text font-display text-[22vw] font-semibold leading-none tracking-tightest text-transparent"
          aria-hidden
        >
          Ranco Village.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="eyebrow mb-4">{title}</div>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="text-sm text-ivory/70 hover:text-ochre">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
