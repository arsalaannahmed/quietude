"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ambientAudio } from "@/lib/ambient-audio";

export default function EntryOverlay({
  onEnter,
}: {
  onEnter: () => void;
}) {
  const [hidden, setHidden] = useState(false);

  const handleEnter = async () => {
    await ambientAudio.unlock();
    // Kick off the first scene (forest) once audio is unlocked.
    await ambientAudio.setScene("forest");
    setHidden(true);
    setTimeout(onEnter, 1100);
  };

  // Allow Enter / Space as keyboard alternative.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        void handleEnter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        >
          {/* Soft ambient gradient hint behind CTA */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(40,60,50,0.4) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center px-8 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="font-sans text-[11px] uppercase tracking-[0.5em] text-white/45"
            >
              A Cinematic Nature Experience
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16, filter: "blur(14px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display text-7xl leading-[0.95] tracking-[0.01em] text-white sm:text-8xl md:text-[9rem]"
            >
              Quiet<span className="italic font-sans text-5xl sm:text-6xl md:text-7xl">ude</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-7 max-w-[440px] font-sans text-sm font-light leading-relaxed text-white/55"
            >
              Five landscapes. Five breaths. Step slowly through forests,
              waterfalls, rivers, oceans, and the stillness of the night sky.
            </motion.p>

            <motion.button
              type="button"
              onClick={handleEnter}
              data-cursor="hover"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-12 cursor-pointer rounded-full border border-white/25 bg-white/[0.03] px-10 py-3.5 font-sans text-[11px] uppercase tracking-[0.45em] text-white/85 backdrop-blur-[6px] transition-colors hover:border-white/50 hover:bg-white/[0.07]"
            >
              Begin
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.8 }}
              className="mt-6 font-sans text-[10px] uppercase tracking-[0.35em] text-white/30"
            >
              Headphones recommended · Sound on
            </motion.p>

            {/* Creator credits */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.1 }}
              className="mt-14 flex flex-col items-center gap-3"
            >
              <p className="font-sans text-[10px] uppercase tracking-[0.5em] text-white/45">
                Created by TijaratCreates
              </p>

              <a
                href="https://www.instagram.com/tijaratcreates"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 transition-colors hover:border-white/40 hover:bg-white/[0.08]"
              >
                {/* Instagram logo */}
                <img
                  src="/instagram-logo.svg"
                  alt=""
                  aria-hidden
                  className="h-3.5 w-3.5 text-white"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <span className="font-sans text-[11px] tracking-[0.15em] text-white/80 transition-colors group-hover:text-white">
                  @tijaratcreates
                </span>
              </a>

              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.4em] text-white/35">
                Creator — Arsalaan Ahmed
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
