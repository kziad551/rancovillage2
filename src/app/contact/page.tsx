"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { SplitReveal } from "@/components/shared/SplitReveal";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="relative flex min-h-[60vh] items-end overflow-hidden pb-16 pt-40">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=2200&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/30" />
        </div>
        <div className="relative mx-auto w-full max-w-[110rem] px-gutter">
          <div className="eyebrow mb-4">Contact · Schedule a visit</div>
          <SplitReveal as="h1" className="font-display text-display-xl text-balance text-ivory">
            Come see it for yourself.
          </SplitReveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-[110rem] grid-cols-12 gap-10 px-gutter py-24">
        <div className="col-span-12 md:col-span-5">
          <p className="max-w-sm text-ivory/75">
            We work very hard to make our residents happy. Leave us your details and we&apos;ll
            be in touch within one business day to arrange a walkthrough.
          </p>

          <div className="mt-14 space-y-5 border-t border-ivory/10 pt-8 text-sm">
            <Row k="Email" v={<a href="mailto:Info@rancovillage.net" className="hover:text-ochre">Info@rancovillage.net</a>} />
            <Row k="Address" v="Al Manar, Riyadh, Saudi Arabia" />
            <Row k="Metro" v="Al Salam · Purple Line · 3 min walk" />
            <Row k="Hours" v="Sun–Thu · 9:00 – 18:00" />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="col-span-12 space-y-5 md:col-span-7"
        >
          <div className="grid grid-cols-2 gap-5">
            <Field label="Name" name="name" required />
            <Field label="Phone" name="phone" type="tel" />
          </div>
          <Field label="Email" name="email" type="email" required />
          <Field label="Housing interest" name="interest" placeholder="Apartment, bungalow, townhouse…" />
          <div>
            <label className="eyebrow mb-2 block">Comments</label>
            <textarea
              rows={5}
              className="w-full resize-none border-b border-ivory/20 bg-transparent py-3 text-ivory outline-none transition focus:border-ochre"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 rounded-full bg-ochre px-8 py-4 font-mono text-xs uppercase tracking-[0.22em] text-ink transition hover:bg-ivory"
          >
            {sent ? "Thank you · we'll be in touch" : "Submit"}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </motion.button>
        </form>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow mb-2 block">
        {label}
        {required && <span className="ml-1 text-terracotta">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full border-b border-ivory/20 bg-transparent py-3 text-ivory outline-none transition placeholder:text-ivory/30 focus:border-ochre"
      />
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ivory/5 pb-4 last:border-none last:pb-0">
      <span className="eyebrow">{k}</span>
      <span className="text-right text-ivory/80">{v}</span>
    </div>
  );
}
