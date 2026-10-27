# Quietude — A Cinematic Nature Experience

A peaceful, scroll-driven 8-chapter journey through forests, water, oceans, and the night sky.

> The full project lives in [`quietude/quietude-build/`](quietude/quietude-build/) — this root README is just the front door, so the repo reads professionally at first glance. The detailed README inside that folder is the source of truth.

## What it is

- **8 cinematic 100vh sections**, each with a full-screen looping video background: Forest, Waterfall, River, Ocean, Night Sky, The Path, The Mirror, The Light
- **Procedural ambient audio** — synthesised entirely with the Web Audio API (no audio files). Only the active section plays, with a 1s fade in/out on section change
- **Custom animated cursor** — solid dot + spring-following outline ring
- **Slow parallax + zoom** on every video, driven by Framer Motion `useScroll`
- **Lenis smooth scroll** for a cinematic feel
- Fonts: Italiana (display serif) + Outfit (body), loaded via `next/font`

## Tech Stack

Next.js 16 (App Router, Turbopack) · TypeScript 5 · Tailwind CSS 4 + shadcn/ui · Framer Motion 12 · Lenis 1.3 · Web Audio API · React 19

## Run it locally

```bash
cd quietude/quietude-build

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

## Build

```bash
bun run build
bun run start
```

## Deploy

Vercel-ready — no database, no env vars, no extra config. Import the repo on Vercel and it auto-detects Next.js.

## Credits

- **Created by** Arsalaan Ahmed
- **Instagram** — [@tijaratcreates](https://www.instagram.com/tijaratcreates)

## Notes

- Videos are hosted on Cloudinary and streamed via `<video>` tags
- `prefers-reduced-motion` is respected (zoom animations disabled)
- Custom cursor auto-disables on touch devices
- No database required
