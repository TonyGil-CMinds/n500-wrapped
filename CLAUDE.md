# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev     # next dev — http://localhost:3000
npm run build
npm start       # serve the production build
```

No test runner, linter, or type checking is configured.

## Architecture

Early-stage scaffold for "N500 Wrapped", a Spotify-Wrapped-style animated experience. Next.js 16 with the **Pages Router** (`pages/`, not `app/`), React 19, plain JavaScript (no TypeScript), Tailwind v3.

- [pages/_app.js](pages/_app.js) — imports global CSS; the only wrapper.
- [pages/index.js](pages/index.js) — placeholder landing page.
- [styles/globals.css](styles/globals.css) — Tailwind directives plus a full-height `html/body/#__next` chain, which the intended fullscreen scroll/slide layout depends on.
- `Audios/` — WAV soundtracks (`Glorious Imperfection.wav`, `The Start of a Startup.wav`) intended for playback in the experience; not yet wired up. They are not under `public/`, so they are **not** served statically — move or copy them into `public/` before referencing them from the client.
- `Inspiration/` — empty; reserved for design references.

## Duplicate config files (fix before styling work)

Both `.cjs` and `.js` variants of the Tailwind and PostCSS configs exist. Node/Tailwind resolve `.js` first, and `tailwind.config.js` has an **empty `content: []`**, so no utility classes are generated — Tailwind silently produces nothing. `tailwind.config.cjs` is the correct one (globs `./pages` and `./components`). Delete `tailwind.config.js` and `postcss.config.js`, or merge the `.cjs` content into them; do not leave both.

## Dependency notes

[CLAUDE_CONTEXT.md](CLAUDE_CONTEXT.md) (Spanish) records the intended stack. Several packages named there are **not yet installed**: `gsap`, `framer-motion`, `use-sound`. Install them when animation or audio work begins.

`react-bits` and `liquid-glass` are in `package.json` but the package names were guesses and were never confirmed against the libraries actually wanted (React Bits is normally consumed via its CLI/copy-paste, not this npm name). Verify before importing from either.
