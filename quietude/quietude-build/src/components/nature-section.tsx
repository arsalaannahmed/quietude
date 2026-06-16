"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Particles from "./particles";
import type { Scene } from "@/lib/ambient-audio";

type SidePanel = {
  /** Eyebrow label, e.g. "Coordinates" */
  label: string;
  /** Main value, e.g. "47.4°N · 10.9°E" */
  value: string;
  /** Optional secondary line */
  sub?: string;
};

type Props = {
  videoUrl: string;
  videoAlt: string;
  particleVariant?: "dust" | "mist" | "stars";
  particleColor?: string;
  index: number;
  /** Roman numeral eyebrow */
  numeral: string;
  /** Scene name shown as the big display title */
  sceneName: string;
  /** Italicised poetic title */
  poeticTitle: string;
  quote: ReactNode;
  reflection: string;
  /** A single-line lesson nature teaches. */
  lesson: string;
  natureFact: string;
  scene: Scene;
  /** Left-side panels — appear stacked top-to-bottom on the left. */
  leftPanels: SidePanel[];
  /** Right-side panels — appear stacked top-to-bottom on the right. */
  rightPanels: SidePanel[];
};

export default function NatureSection({
  videoUrl,
  videoAlt,
  particleVariant = "dust",
  particleColor = "rgba(255,255,255,0.6)",
  index,
  numeral,
  sceneName,
  poeticTitle,
  quote,
  reflection,
  lesson,
  natureFact,
  leftPanels,
  rightPanels,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const videoScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.18, 1.06, 1.18],
  );
  const contentY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.82, 1],
    [0, 1, 1, 0],
  );

  return (
    <section
      ref={ref}
      data-section-index={index}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Video background */}
      <motion.div
        className="absolute inset-0"
        style={{ y: videoY, scale: videoScale }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={videoAlt}
          className="h-[118%] w-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </motion.div>

      {/* Lighter overlay — videos stay clearly visible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,10,0.35) 0%, rgba(8,8,10,0.12) 35%, rgba(8,8,10,0.18) 65%, rgba(8,8,10,0.55) 100%)",
        }}
      />

      {/* Subtle vignette — kept gentle so the video reads through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* Soft edge fade */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Floating particles */}
      <Particles
        count={particleVariant === "stars" ? 60 : 26}
        color={particleColor}
        variant={particleVariant}
      />

      {/* === LEFT-SIDE PANELS === */}
      <motion.aside
        style={{ opacity: contentOpacity, y: contentY }}
        className="absolute left-6 top-1/2 z-20 hidden max-w-[240px] -translate-y-1/2 flex-col gap-8 sm:left-10 md:flex lg:left-14 lg:max-w-[280px]"
      >
        {leftPanels.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, x: -22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              duration: 0.95,
              delay: 0.25 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-shadow-soft"
          >
            <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.42em] text-white/55">
              {p.label}
            </p>
            <p className="font-sans text-[16px] font-light leading-[1.45] text-white/95 lg:text-[17px]">
              {p.value}
            </p>
            {p.sub && (
              <p className="mt-1.5 font-sans text-[13px] font-light leading-[1.5] text-white/60 lg:text-[13.5px]">
                {p.sub}
              </p>
            )}
            {i < leftPanels.length - 1 && (
              <div className="mt-7 h-px w-10 bg-white/15" />
            )}
          </motion.div>
        ))}
      </motion.aside>

      {/* === RIGHT-SIDE PANELS === */}
      <motion.aside
        style={{ opacity: contentOpacity, y: contentY }}
        className="absolute right-6 top-1/2 z-20 hidden max-w-[240px] -translate-y-1/2 flex-col items-end gap-8 sm:right-10 md:flex lg:right-14 lg:max-w-[280px]"
      >
        {rightPanels.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, x: 22, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{
              duration: 0.95,
              delay: 0.25 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-right text-shadow-soft"
          >
            <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.42em] text-white/55">
              {p.label}
            </p>
            <p className="font-sans text-[16px] font-light leading-[1.45] text-white/95 lg:text-[17px]">
              {p.value}
            </p>
            {p.sub && (
              <p className="mt-1.5 font-sans text-[13px] font-light leading-[1.5] text-white/60 lg:text-[13.5px]">
                {p.sub}
              </p>
            )}
            {i < rightPanels.length - 1 && (
              <div className="ml-auto mt-7 h-px w-10 bg-white/15" />
            )}
          </motion.div>
        ))}
      </motion.aside>

      {/* === CENTER CONTENT — no glass card, just elegant type on video === */}
      <motion.div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 sm:px-20 md:px-40"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Numeral eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10, letterSpacing: "0.1em" }}
          whileInView={{ opacity: 1, y: 0, letterSpacing: "0.55em" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="mb-6 font-sans text-[11px] uppercase tracking-[0.55em] text-white/65 text-shadow-soft"
        >
          {numeral}
        </motion.p>

        {/* Scene name — big display serif */}
        <motion.h2
          initial={{ opacity: 0, y: 18, filter: "blur(14px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.15, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-display text-[15vw] leading-[0.92] tracking-[0.01em] text-white text-shadow-strong sm:text-[12vw] md:text-[10vw] lg:text-[9rem]"
        >
          {sceneName}
        </motion.h2>

        {/* Poetic italic title */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 font-sans text-[12px] uppercase tracking-[0.42em] text-white/70 text-shadow-soft sm:text-[13px]"
        >
          {poeticTitle}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.65 }}
          className="mx-auto my-8 h-px w-14 bg-gradient-to-r from-transparent via-white/55 to-transparent"
        />

        {/* Quote — pure type on the video */}
        <motion.blockquote
          initial={{ opacity: 0, y: 14, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.1, delay: 0.4 }}
          className="max-w-[640px] text-center font-display text-2xl italic leading-[1.4] text-white/95 text-shadow-strong sm:text-3xl md:text-[2rem]"
        >
          {quote}
        </motion.blockquote>

        {/* Reflection */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mx-auto mt-7 max-w-[500px] text-center font-sans text-[14px] font-light leading-[1.85] text-white/80 text-shadow-soft sm:text-[15px]"
        >
          {reflection}
        </motion.p>

        {/* Nature's Lesson — single-line philosophical takeaway */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="mx-auto mt-8 flex max-w-[560px] items-center justify-center gap-3 text-center"
        >
          <span className="h-px w-8 bg-white/30" />
          <p className="font-display text-lg italic leading-snug text-white/95 text-shadow-soft sm:text-xl md:text-[1.35rem]">
            {lesson}
          </p>
          <span className="h-px w-8 bg-white/30" />
        </motion.div>

        {/* Nature fact — small footnote at the bottom of the centered stack */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mx-auto mt-9 max-w-[480px] text-center"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.45em] text-white/60 text-shadow-soft">
            Nature Fact
          </span>
          <p className="mt-2.5 font-sans text-[13px] font-light leading-[1.7] text-white/75 text-shadow-soft sm:text-[13.5px]">
            {natureFact}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
