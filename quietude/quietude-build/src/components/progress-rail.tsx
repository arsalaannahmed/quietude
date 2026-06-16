"use client";

import { motion } from "framer-motion";

type Props = {
  total: number;
  active: number;
  labels: string[];
};

/**
 * Top navbar section indicator.
 * Each chapter is a clickable pill; the active one is filled, others are
 * outlined. Compact and centred so it never overlaps section content.
 */
export default function ProgressRail({ total, active, labels }: Props) {
  return (
    <nav
      aria-label="Chapter navigation"
      data-cursor="hover"
      className="fixed left-1/2 top-5 z-50 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 backdrop-blur-md md:flex"
      style={{ boxShadow: "0 8px 32px -8px rgba(0,0,0,0.5)" }}
    >
      {Array.from({ length: total }, (_, i) => {
        const isActive = i === active;
        return (
          <a
            key={i}
            href={`#chapter-${i + 1}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelectorAll<HTMLElement>("[data-section-index]")
                [i]?.scrollIntoView({ behavior: "smooth" });
            }}
            data-cursor="hover"
            className="group relative flex items-center rounded-full px-3 py-1.5 transition-colors"
            aria-label={`Go to chapter ${i + 1}: ${labels[i]}`}
            aria-current={isActive ? "true" : undefined}
          >
            <motion.span
              animate={{
                opacity: isActive ? 1 : 0.5,
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-sans text-[10.5px] uppercase tracking-[0.25em]"
            >
              {String(i + 1).padStart(2, "0")}
            </motion.span>

            {/* Active label appears on hover or when active */}
            <motion.span
              animate={{
                maxWidth: isActive ? 140 : 0,
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? 8 : 0,
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="overflow-hidden whitespace-nowrap font-sans text-[10.5px] uppercase tracking-[0.2em] text-white"
            >
              {labels[i]}
            </motion.span>

            {/* Active background pill */}
            {isActive && (
              <motion.span
                layoutId="active-chapter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-white/10"
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}
