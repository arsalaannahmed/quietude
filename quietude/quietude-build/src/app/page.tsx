"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SmoothScroll from "@/components/smooth-scroll";
import NatureSection from "@/components/nature-section";
import EntryOverlay from "@/components/entry-overlay";
import ProgressRail from "@/components/progress-rail";
import CustomCursor from "@/components/custom-cursor";
import { useSectionAudio } from "@/hooks/use-section-audio";
import type { Scene } from "@/lib/ambient-audio";

const SECTIONS = [
  // ============ I — FOREST ============
  {
    scene: "forest" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781631809/lv_0_20260616230752_avgmil.mp4",
    videoAlt:
      "Soft morning light filtering through a misty old-growth forest canopy",
    particleVariant: "dust" as const,
    particleColor: "rgba(220,235,210,0.55)",
    numeral: "I  ·  Chapter One",
    sceneName: "Forest",
    poeticTitle: "Where Roots Remember",
    quote: (
      <>
        &ldquo;The clearest way into the Universe is through a forest
        wilderness.&rdquo;
      </>
    ),
    reflection:
      "Beneath the canopy, time slows. Each trunk holds centuries of patience, each fallen leaf returns what was borrowed. The forest does not hurry, yet everything arrives.",
    lesson: "Be patient. Growth happens in silence, one ring at a time.",
    natureFact:
      "Trees in a forest communicate through underground mycorrhizal networks — sometimes called the \u2018Wood Wide Web\u2019 — sharing nutrients and warning each other of threats.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why do forests calm us?",
        sub: "Phytoncides \u2014 airborne compounds released by trees \u2014 lower cortisol and boost natural killer cell activity.",
      },
      {
        label: "Ecosystem",
        value: "Temperate rainforest",
        sub: "Old-growth conifer belt",
      },
      {
        label: "Recorded",
        value: "Early morning",
        sub: "Post-rain, soft mist",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CStand still. The forest is already moving.\u201D",
        sub: "\u2014 A keeper's diary",
      },
      {
        label: "Ambient Layer",
        value: "Wind through cedar",
        sub: "Birdsong · moss drip",
      },
      {
        label: "Biodiversity",
        value: "1,500+ species / hectare",
        sub: "Fungi, lichen, invertebrates",
      },
    ],
  },

  // ============ II — WATERFALL ============
  {
    scene: "waterfall" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781631807/Video_by_unique_haruki_DYknxE7zSyC_toqq5b.mp4",
    videoAlt: "A long silver waterfall cascading down a steep moss-covered cliff",
    particleVariant: "mist" as const,
    particleColor: "rgba(200,225,235,0.55)",
    numeral: "II  ·  Chapter Two",
    sceneName: "Waterfall",
    poeticTitle: "The Patient Descent",
    quote: <>&ldquo;Water is the driving force of all nature.&rdquo;</>,
    reflection:
      "Nothing resists the falling water, and nothing survives without it. Stand close and the world dissolves into a single roaring hush — a sound so complete it becomes its own kind of silence.",
    lesson: "Persistence wears down stone. Keep falling, keep flowing.",
    natureFact:
      "Negative ions released by falling water are believed to elevate mood and reduce stress \u2014 a real, measurable effect behind the calm you feel near any cascade.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why is waterfall air so fresh?",
        sub: "Falling water fractures air molecules, releasing negative ions that bind to dust and pollen.",
      },
      {
        label: "Ecosystem",
        value: "Riparian cliffside",
        sub: "Moss + fern microhabitat",
      },
      {
        label: "Recorded",
        value: "Midday",
        sub: "Spring snowmelt peak",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CThe fall does not choose its path. The path chooses the fall.\u201D",
        sub: "\u2014 Field journal entry",
      },
      {
        label: "Ambient Layer",
        value: "Continuous cascade",
        sub: "Brown noise spectrum",
      },
      {
        label: "Geology",
        value: "Limestone + travertine",
        sub: "Recrystallised over millennia",
      },
    ],
  },

  // ============ III — RIVER ============
  {
    scene: "river" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781631805/Video_by_rockbadgeragency_DXWOM-lgqeI_lhhsrz.mp4",
    videoAlt: "A clear river flowing gently over smooth stones between green banks",
    particleVariant: "dust" as const,
    particleColor: "rgba(230,240,225,0.55)",
    numeral: "III  ·  Chapter Three",
    sceneName: "River",
    poeticTitle: "Always Becoming",
    quote: (
      <>
        &ldquo;No man ever steps in the same river twice, for it&rsquo;s not the
        same river and he&rsquo;s not the same man.&rdquo;
      </>
    ),
    reflection:
      "A river is never still, even when it looks calm. It teaches a simple lesson — to move forward without holding on, to shape the world by being shaped by it.",
    lesson: "Let go of the bank. The current already knows the way.",
    natureFact:
      "Rivers transport dissolved minerals from mountains to sea, feeding phytoplankton that produce roughly half the oxygen in every breath you take.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why are rivers never the same?",
        sub: "Water molecules cycle through in seconds; the river is a pattern, not a thing.",
      },
      {
        label: "Ecosystem",
        value: "Headwater to estuary",
        sub: "Cold-water trout zone",
      },
      {
        label: "Recorded",
        value: "Late afternoon",
        sub: "Glacial-fed, 8 \u00B0C",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CA river is the memory of every rain that ever fell uphill.\u201D",
        sub: "\u2014 Watershed study",
      },
      {
        label: "Ambient Layer",
        value: "Babbling current",
        sub: "Mid-frequency murmur",
      },
      {
        label: "Hydrology",
        value: "16 m clarity",
        sub: "Class I purity index",
      },
    ],
  },

  // ============ IV — OCEAN ============
  {
    scene: "ocean" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781631796/Video_by_unique_haruki_DX7WWdFTOcT_vygegh.mp4",
    videoAlt: "Slow rolling ocean waves under a wide grey-blue sky at dusk",
    particleVariant: "mist" as const,
    particleColor: "rgba(210,225,235,0.5)",
    numeral: "IV  ·  Chapter Four",
    sceneName: "Ocean",
    poeticTitle: "Edge of the Vastness",
    quote: (
      <>
        &ldquo;The sea, once it casts its spell, holds one in its net of wonder
        forever.&rdquo;
      </>
    ),
    reflection:
      "Standing at the edge of the ocean is standing at the edge of everything we cannot contain. Each wave arrives like a breath, each retreat a small forgetting. The vastness makes room.",
    lesson: "You are small. That is not a wound — it is a relief.",
    natureFact:
      "The ocean produces over 50% of Earth\u2019s oxygen, mostly through phytoplankton \u2014 microscopic plants invisible to the naked eye.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why does the sea calm the mind?",
        sub: "The 0.1\u20130.2 Hz rhythm of waves matches the frequency of deep meditation and slow breathing.",
      },
      {
        label: "Ecosystem",
        value: "Pelagic + littoral",
        sub: "Open-ocean surface",
      },
      {
        label: "Recorded",
        value: "Golden hour",
        sub: "Tidal range 1.8 m",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CThe horizon is not a line. It is an invitation.\u201D",
        sub: "\u2014 Coastal keeper",
      },
      {
        label: "Ambient Layer",
        value: "Rolling surf",
        sub: "0.16 Hz swell cycle",
      },
      {
        label: "Chemistry",
        value: "3.5% salinity",
        sub: "pH 8.1 \u2014 alkaline",
      },
    ],
  },

  // ============ V — NIGHT SKY ============
  {
    scene: "night" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781631791/Video_by_filmwshiv_DXWxxejEpq__x8oiwr.mp4",
    videoAlt: "A vast starry night sky over a quiet dark landscape",
    particleVariant: "stars" as const,
    particleColor: "rgba(230,235,255,0.9)",
    numeral: "V  ·  Chapter Five",
    sceneName: "Night Sky",
    poeticTitle: "The Long Light",
    quote: (
      <>
        &ldquo;We are made of star-stuff. We are a way for the universe to know
        itself.&rdquo;
      </>
    ),
    reflection:
      "Beneath a sky thick with stars, the small concerns of the day lose their weight. Light left those stars long before our names existed. We are seen by something that does not need us to be anything at all.",
    lesson: "Look up. Your worries are not the size of the sky.",
    natureFact:
      "Every atom of calcium in your bones and iron in your blood was forged inside a dying star billions of years before Earth existed.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why does stargazing ease anxiety?",
        sub: "Awe induced by vast scenes shifts attention outward, reducing self-referential thinking in the brain.",
      },
      {
        label: "Ecosystem",
        value: "Dark-sky reserve",
        sub: "Bortle Class 1 site",
      },
      {
        label: "Recorded",
        value: "Astronomical night",
        sub: "New moon, clear sky",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CStars do not compete. They only shine.\u201D",
        sub: "\u2014 Desert observatory log",
      },
      {
        label: "Ambient Layer",
        value: "Crickets + stillness",
        sub: "Low drone bed",
      },
      {
        label: "Cosmology",
        value: "\u2248 6,500 visible stars",
        sub: "Naked-eye mag 6.5",
      },
    ],
  },

  // ============ VI — THE PATH (new video 1: misty forest road) ============
  {
    scene: "path" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781635395/Video_by_adnan_khandaker__DWlI4rZjrh8_cx22pm.mp4",
    videoAlt:
      "A misty paved road winding through dense wet forest under overcast light",
    particleVariant: "mist" as const,
    particleColor: "rgba(220,230,220,0.55)",
    numeral: "VI  ·  Chapter Six",
    sceneName: "The Path",
    poeticTitle: "Where Walking Becomes Prayer",
    quote: (
      <>
        &ldquo;All truly great thoughts are conceived while walking.&rdquo;
      </>
    ),
    reflection:
      "A road through the woods asks nothing of you but your feet. Mist softens the distance; the next bend is hidden, and that is the point. Walking here is not travel \u2014 it is remembering that you have a body, and that body knows the way.",
    lesson: "You do not need to see the destination to keep moving.",
    natureFact:
      "Walking in a forest for just 20 minutes measurably lowers salivary cortisol and blood pressure \u2014 a phenomenon Japanese researchers call shinrin-yoku, or \u2018forest bathing\u2019.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why do forest paths feel mysterious?",
        sub: "Curves hide what's ahead, triggering curiosity circuits evolved to scan for both opportunity and danger.",
      },
      {
        label: "Ecosystem",
        value: "Temperate broadleaf",
        sub: "Mixed deciduous canopy",
      },
      {
        label: "Recorded",
        value: "Late morning",
        sub: "Post-rain, low cloud",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CA path is not a place. It is a decision, repeated.\u201D",
        sub: "\u2014 Trail journal",
      },
      {
        label: "Ambient Layer",
        value: "Open wind + drip",
        sub: "Cooler, more spacious than deep forest",
      },
      {
        label: "Botany",
        value: "Moss + fern understory",
        sub: "Leaf litter decomposition zone",
      },
    ],
  },

  // ============ VII — THE MIRROR (new video 2: misty lake with dock) ============
  {
    scene: "lake" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781635400/Video_by_loxxtuz_DZWZ5v9zmlg_upwpev.mp4",
    videoAlt:
      "A misty still lake with a wooden dock extending into calm water at dawn",
    particleVariant: "mist" as const,
    particleColor: "rgba(200,220,235,0.55)",
    numeral: "VII  ·  Chapter Seven",
    sceneName: "The Mirror",
    poeticTitle: "Stillness That Holds the Sky",
    quote: (
      <>
        &ldquo;The highest good is like water. Water benefits the ten thousand
        things and does not contend. It dwells in places that all disdain.\u201D
      </>
    ),
    reflection:
      "A still lake does not chase its reflection \u2014 it simply holds it. There is nothing to add, nothing to fix. The mist will lift when the sun is ready, and the water will go on being water either way. Most of what we call peace is just learning to stop disturbing what is already still.",
    lesson: "Be the lake. The reflection will come on its own.",
    natureFact:
      "Lakes cover only about 3% of Earth\u2019s surface but hold nearly 90% of the planet\u2019s liquid surface freshwater \u2014 making them, per square metre, the most precious freshwater habitat we have.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why does still water calm us?",
        sub: "Slow, rhythmic micro-sounds of gentle water activate the parasympathetic nervous system, lowering heart rate.",
      },
      {
        label: "Ecosystem",
        value: "Oligotrophic lake",
        sub: "Low-nutrient, high-clarity",
      },
      {
        label: "Recorded",
        value: "Early morning",
        sub: "Mist over cold water",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CStillness is not the absence of motion. It is the presence of depth.\u201D",
        sub: "\u2014 Lakeside journal",
      },
      {
        label: "Ambient Layer",
        value: "Lapping water + soft wind",
        sub: "Occasional distant bird",
      },
      {
        label: "Hydrology",
        value: "Thermal stratification",
        sub: "Cold layer below thermocline",
      },
    ],
  },

  // ============ VIII — THE LIGHT (new video 3: sunlit canopy from below) ============
  {
    scene: "canopy" as Scene,
    videoUrl:
      "https://res.cloudinary.com/ddvamgev1/video/upload/v1781635403/Video_by_aesthetic.rii_DYr6-8lP1DY_db4yio.mp4",
    videoAlt:
      "Looking up at a forest canopy with sunlight bursting through vibrant green leaves",
    particleVariant: "dust" as const,
    particleColor: "rgba(255,240,200,0.7)",
    numeral: "VIII  ·  Chapter Eight",
    sceneName: "The Light",
    poeticTitle: "The Sky Through a Thousand Leaves",
    quote: (
      <>
        &ldquo;Keep your face always toward the sunshine and the shadows will
        fall behind you.&rdquo;
      </>
    ),
    reflection:
      "Look up. The same leaves that block the sun also frame it \u2014 a thousand green stained-glass windows holding the sky. Light here is never direct; it is filtered, softened, shared. That is the lesson of every canopy: what shelters you also shows you the world differently.",
    lesson: "What shades you also colours the light. Look up anyway.",
    natureFact:
      "Sunlight filtering through leaves is mostly green because chlorophyll absorbs red and blue wavelengths for photosynthesis and reflects the green back to our eyes \u2014 the very reason a forest looks alive.",
    leftPanels: [
      {
        label: "Q & A",
        value: "Why is forest light green?",
        sub: "Chlorophyll absorbs red + blue for photosynthesis and reflects green wavelengths back to our eyes.",
      },
      {
        label: "Ecosystem",
        value: "Canopy + understory",
        sub: "Sun-flecked leaf zone",
      },
      {
        label: "Recorded",
        value: "Mid-morning",
        sub: "Clear sky, sun high",
      },
    ],
    rightPanels: [
      {
        label: "Naturalist's Note",
        value: "\u201CEvery leaf is a small green prayer aimed at the sun.\u201D",
        sub: "\u2014 Forest canopy notes",
      },
      {
        label: "Ambient Layer",
        value: "Bright bird chorus",
        sub: "Leaf rustle + warm wind",
      },
      {
        label: "Botany",
        value: "Photosynthesis peak",
        sub: "10\u201320 \u00B5mol CO\u2082 / m\u00B2 / s",
      },
    ],
  },
];

const LABELS = SECTIONS.map((s) => s.sceneName);

export default function Home() {
  const [entered, setEntered] = useState(false);
  const scenes = SECTIONS.map((s) => s.scene);
  const activeIndex = useSectionAudio(scenes);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 20,
    mass: 0.3,
  });

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  return (
    <SmoothScroll>
      <CustomCursor />
      <main className="relative bg-black">
        {/* Top progress bar */}
        <motion.div
          className="fixed left-0 right-0 top-0 z-[60] h-[1.5px] origin-left bg-white/60"
          style={{ scaleX: progress }}
        />

        {entered && (
          <ProgressRail
            total={SECTIONS.length}
            active={activeIndex}
            labels={LABELS}
          />
        )}

        {/* Fixed brand mark */}
        {entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="fixed left-6 top-6 z-50 font-display text-xl tracking-[0.08em] text-white/75 text-shadow-soft sm:left-10"
            data-cursor="hover"
          >
            Quiet<span className="italic">ude</span>
          </motion.div>
        )}

        {/* Fixed chapter counter bottom-left */}
        {entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="fixed bottom-6 left-6 z-50 font-sans text-[10px] uppercase tracking-[0.4em] text-white/45 sm:left-10"
          >
            <span className="text-white/85">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(SECTIONS.length).padStart(2, "0")} — {LABELS[activeIndex]}
          </motion.div>
        )}

        {/* Fixed hint bottom-right */}
        {entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="fixed bottom-6 right-6 z-50 hidden font-sans text-[9px] uppercase tracking-[0.45em] text-white/35 sm:block sm:right-10"
          >
            Scroll · Listen · Breathe
          </motion.div>
        )}

        {SECTIONS.map((s, i) => (
          <NatureSection
            key={i}
            index={i}
            videoUrl={s.videoUrl}
            videoAlt={s.videoAlt}
            particleVariant={s.particleVariant}
            particleColor={s.particleColor}
            numeral={s.numeral}
            sceneName={s.sceneName}
            poeticTitle={s.poeticTitle}
            quote={s.quote}
            reflection={s.reflection}
            lesson={s.lesson}
            natureFact={s.natureFact}
            scene={s.scene}
            leftPanels={s.leftPanels}
            rightPanels={s.rightPanels}
          />
        ))}

        {/* Closing footer */}
        <footer className="relative flex h-auto w-full flex-col items-center justify-center bg-black px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="max-w-[560px]"
          >
            <p className="font-display text-2xl italic leading-[1.4] text-white/85 sm:text-3xl md:text-4xl">
              &ldquo;In every walk with nature, one receives far more than they
              seek.&rdquo;
            </p>
            <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.45em] text-white/35">
              Quietude · A Nature Experience · Eight Chapters
            </p>
            <div className="mx-auto mt-5 h-px w-10 bg-white/20" />
            <p className="mt-5 font-sans text-[10px] tracking-[0.3em] text-white/30">
              Sound synthesised live in your browser · No audio files loaded
            </p>

            {/* Divider before credits */}
            <div className="mx-auto mt-12 h-px w-20 bg-white/15" />

            {/* Creator credits — same as entry overlay */}
            <div className="mt-10 flex flex-col items-center gap-3">
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
                <img
                  src="/instagram-logo.svg"
                  alt=""
                  aria-hidden
                  className="h-3.5 w-3.5"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <span className="font-sans text-[11px] tracking-[0.15em] text-white/80 transition-colors group-hover:text-white">
                  @tijaratcreates
                </span>
              </a>

              <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.4em] text-white/35">
                Creator — Arsalaan Ahmed
              </p>
            </div>
          </motion.div>
        </footer>

        {!entered && <EntryOverlay onEnter={() => setEntered(true)} />}
      </main>
    </SmoothScroll>
  );
}
