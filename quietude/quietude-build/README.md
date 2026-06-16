# Quietude — A Cinematic Nature Experience

A peaceful, scroll-driven 8-chapter journey through forests, water, oceans, and the night sky.
Built with Next.js 16 + TypeScript + Tailwind CSS 4 + Framer Motion + Lenis smooth scroll.

## Deploy to Vercel

This project is configured for one-click Vercel deployment.

1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Click **Deploy** — no environment variables needed for the basic experience

That's it. No additional configuration required.

## Features

- **8 cinematic 100vh sections**, each with a full-screen looping video background
  1. Forest — dense old-growth canopy
  2. Waterfall — silver cascade down moss cliff
  3. River — gentle flow over smooth stones
  4. Ocean — slow rolling waves at dusk
  5. Night Sky — vast starry sky over quiet land
  6. The Path — misty forest road
  7. The Mirror — misty lake with wooden dock
  8. The Light — sunlit canopy from below

- **Procedural ambient audio** — synthesised entirely with the Web Audio API
  (no audio files). Each scene has a unique sonic signature: wind + birds,
  waterfall rush, river current, ocean swell, night crickets, and more.
  Only the active section plays; 1s fade in/out on section change.

- **Custom animated cursor** — solid dot + spring-following outline ring that
  expands on hover over interactive elements.

- **Glass-free layout** — typography directly on the video. Split info panels
  on left and right (Q&A, Naturalist's Note, ecosystem data, etc.) with
  text-shadow for legibility.

- **Top navbar** — chapter pills (01–08) with sliding active indicator.
  Click any chapter to jump.

- **Slow parallax + zoom** on every video, driven by Framer Motion `useScroll`.

- **Lenis smooth scroll** for buttery cinematic feel.

- **Fonts** — Italiana (display serif headings, similar vibe to Beronoru
  Expanded) + Outfit (geometric sans body, similar to Agrandir Grand),
  loaded via `next/font`.

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Framer Motion 12
- Lenis 1.3 (smooth scroll)
- Web Audio API (procedural ambient sound)
- React 19

## Local Development

```bash
# Install dependencies
bun install
# or
npm install

# Run dev server
bun run dev
# or
npm run dev

# Open http://localhost:3000
```

Click **Begin** (with headphones on) to unlock audio and start the experience.

## File Structure

```
src/
├── app/
│   ├── globals.css          # Cinematic base styles, custom cursor, vignette
│   ├── layout.tsx           # Italiana + Outfit fonts, root layout
│   └── page.tsx             # 8-section composition + entry overlay + footer
├── components/
│   ├── custom-cursor.tsx    # Spring-following cursor (dot + ring)
│   ├── entry-overlay.tsx    # Begin screen + creator credits
│   ├── nature-section.tsx   # Single section: video bg + panels + content
│   ├── particles.tsx        # Floating dust/mist/stars variants
│   ├── progress-rail.tsx    # Top navbar with chapter pills
│   └── smooth-scroll.tsx    # Lenis provider
├── hooks/
│   ├── use-section-audio.ts # IntersectionObserver → scene audio switching
│   ├── use-mobile.ts
│   └── use-toast.ts
└── lib/
    ├── ambient-audio.ts     # Web Audio synth engine (8 scenes)
    ├── db.ts
    └── utils.ts

public/
└── instagram-logo.svg       # Inline IG logo for creator credits
```

## Credits

- **Created by** TijaratCreates
- **Instagram** — [@tijaratcreates](https://www.instagram.com/tijaratcreates)
- **Creator** — Arsalaan Ahmed

## Notes

- All nature facts are real and scientifically cited.
- All quotes are real and properly attributed.
- Sound is fully synthesised in-browser — no audio files are loaded.
- Videos are hosted on Cloudinary and streamed via `<video>` tags.
- `prefers-reduced-motion` is respected (zoom animations disabled).
- Custom cursor auto-disables on touch devices.
- Build is configured for Vercel (`next build` + `next start`, no `output: standalone`).
- `postinstall: prisma generate` runs automatically on Vercel install.
