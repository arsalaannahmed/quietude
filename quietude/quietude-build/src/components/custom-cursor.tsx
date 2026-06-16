"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic custom cursor:
 *   - A small solid dot that tracks the pointer 1:1
 *   - A larger outline ring that follows with spring physics (lerp)
 *   - Ring expands on hover over interactive elements ([data-cursor="hover"], a, button)
 *   - Ring shrinks on press
 * Pure DOM writes via refs — no React re-renders per frame.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot follows instantly.
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onDown = () => ring.classList.add("is-pressed");
    const onUp = () => ring.classList.remove("is-pressed");

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, [data-cursor="hover"], input, textarea, select, [role="button"]',
      );
      if (interactive) ring.classList.add("is-hovering");
      else ring.classList.remove("is-hovering");
    };

    // Spring-follow loop for the ring.
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver, { passive: true });

    // Fade in on first move
    let firstMove = true;
    const onFirstMove = () => {
      if (firstMove) {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        firstMove = false;
      }
    };
    dot.style.opacity = "0";
    ring.style.opacity = "0";
    window.addEventListener("mousemove", onFirstMove, { passive: true });

    // Hide when leaving the window
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
      firstMove = true;
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousemove", onFirstMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
