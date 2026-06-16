"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type Props = {
  count?: number;
  color?: string;
  /** 'dust' = soft warm motes, 'mist' = large translucent fog, 'stars' = tiny pinpricks */
  variant?: "dust" | "mist" | "stars";
};

export default function Particles({
  count = 22,
  color = "rgba(255,255,255,0.6)",
  variant = "dust",
}: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size:
          variant === "stars"
            ? 1 + Math.random() * 1.5
            : variant === "mist"
              ? 80 + Math.random() * 140
              : 1.5 + Math.random() * 3,
        duration: 12 + Math.random() * 18,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 30,
      })),
    [count, variant],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              variant === "mist"
                ? `radial-gradient(circle, ${color} 0%, transparent 70%)`
                : color,
            opacity: variant === "mist" ? 0.12 : 0.7,
            filter: variant === "stars" ? "blur(0.3px)" : "blur(0.6px)",
            boxShadow:
              variant === "stars"
                ? `0 0 ${p.size * 2}px ${color}`
                : undefined,
          }}
          animate={{
            y: [`0%`, `-${30 + p.drift}%`],
            x: [`0%`, `${p.drift}%`],
            opacity:
              variant === "mist"
                ? [0.05, 0.18, 0.05]
                : [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
