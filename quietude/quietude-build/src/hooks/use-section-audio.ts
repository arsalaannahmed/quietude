"use client";

import { useEffect, useState } from "react";
import { ambientAudio, type Scene } from "@/lib/ambient-audio";

/**
 * Watches each [data-section] element and fades the ambient audio
 * to match whichever section currently holds the viewport's center.
 */
export function useSectionAudio(scenes: Scene[]) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-index]"),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio that's intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length === 0) return;
        const topEntry = visible[0];
        const idx = Number(
          topEntry.target.getAttribute("data-section-index") || 0,
        );
        if (idx !== activeIndex) {
          setActiveIndex(idx);
          const scene = scenes[idx] ?? scenes[0];
          void ambientAudio.setScene(scene);
        }
      },
      { threshold: [0.4, 0.55, 0.7] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [activeIndex, scenes]);

  return activeIndex;
}
