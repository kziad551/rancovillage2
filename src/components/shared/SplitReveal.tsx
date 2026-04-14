"use client";
import { motion } from "framer-motion";

export function SplitReveal({
  children,
  className,
  delay = 0,
  as = "span",
}: {
  children: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "p" | "div";
}) {
  const words = children.split(" ");
  const Tag = as as React.ElementType;
  return (
    <Tag className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="relative inline-block overflow-hidden align-bottom pr-[0.25em]"
        >
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
