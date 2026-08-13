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

Early-stage build of "N500 Wrapped", a Spotify-Wrapped-style animated experience. Next.js 16 with the **App Router**, React 19, plain JavaScript (no TypeScript), Tailwind v3.

```
app/
  layout.js              root layout — fonts, metadata, globals.css
  page.js                resolves recipient from searchParams, mounts ExperienceRoot
  globals.css            Tailwind directives + .wrapped-slide/.glow-floor/.guide-line
  demo/page.js           /demo — component + audio smoke test
  components/experience/ ExperienceRoot (state machine), WelcomeScreen,
                         StoryPlayer, StorySlide, BadgeScreen
  components/ui/         Button, StatCard, AudioPlayer, LogoMark, AvatarChip,
                         GuideLines, Particles, Odometer, N500Lockup,
                         CountUp, StoryProgress
  hooks/                 useUiSound (SFX), useSoundtrack (music + crossfade)
  lib/                   audio.js (manifest), story.js (script), company.js,
                         cn.js
public/audio/            music .wav + ui/*.wav sound effects
public/logo-n500.svg     brand mark
scripts/generate-sfx.js  regenerates public/audio/ui/*.wav
Inspiration/             empty; reserved for design references
```

## The experience

`ExperienceRoot` is a three-phase state machine: **welcome → story → badge**. It owns
the audio so music survives phase changes and can crossfade.

- **Welcome** doubles as the loading screen. An odometer counts 000→500 in the exact
  spot the headline will occupy, so when it lands the "N" unfolds to its left and the
  rest of the composition materialises *around it* — nothing moves. Guide lines mount
  only at reveal, which is what produces the slice-in.
- **Story** plays `lib/story.js` with stories mechanics: auto-advance, a progress bar
  per slide, tap left/right, hold to pause, arrows/space on keyboard.
- **Badge** is the shareable medal.

`/?empresa=X&usuario=Y` overrides the recipient and `&fase=story|badge` jumps straight
to a phase — the practical way to review one screen without replaying the intro.

## Visual language

Dark green-black canvas (`ink` = `#101511`), a lime glow rising from the bottom edge
(`.glow-floor`), dashed vertical guides at 25%/75% (`GuideLines`), drifting particles,
and `intro-plants.png` rising from the bottom on the welcome screen.

Three fonts, all via `next/font/google` in the root layout:

| Role | Family | CSS var | Tailwind |
| --- | --- | --- | --- |
| Headlines | Unbounded | `--font-display` | `font-display` |
| Body, buttons | Host Grotesk | `--font-sans` | `font-sans` (default) |
| Italic accents | Playfair Display | `--font-serif` | `font-serif` |

The welcome intro runs **count → letter → logo → ready**: the odometer lands on 500,
the "N" unfolds, and then the characters give way to `logo-full.svg`. That last step is
a relay between two layers stacked in the same grid cell — the text scales down and
blurs out while the SVG scales up in — not a true outline morph, which would mean
interpolating glyph paths.

Gotchas worth knowing before touching the hero:

- Dashed guides need `repeating-linear-gradient`; a plain `linear-gradient` paints one dash.
- The reduced-motion block resets `animation-delay` too — with `fill-mode: both`, a
  surviving delay pins staggered elements at `opacity: 0` forever.
- Headline sizes use `clamp()` rather than breakpoints so long words never overflow narrow screens.
- `Particles` positions are hardcoded constants; `Math.random()` would desync server and client.
- Playfair defaults to old-style figures, so `.font-serif` forces `lining-nums` —
  without it "Natura500" and "2026" render with descending digits.
- `Odometer` blur comes from *instantaneous* velocity (the easing's derivative). Average
  speed leaves fast-spinning wheels sharp and doubled instead of blurred.

## Audio

`use-sound` (howler) throughout. `useSoundtrack` crossfades music between phases;
`useUiSound` handles click/hover/whoosh/tick/reveal. The SFX are synthesised WAVs —
run `node scripts/generate-sfx.js public/audio/ui` to retune them.

**Never call `play()` while the AudioContext is suspended.** howler queues those calls
and flushes them all at once on unlock — which meant the first click fired every
odometer tick at once and left both songs playing over each other. `useAudioReady`
gates everything: until the context is `running`, `soundEnabled` stays false so
use-sound never even reaches `play()`. It resumes the context on `pointerdown` in the
**capture** phase, early enough that a normal click's own SFX still sounds.

`useSoundtrack` stops non-current tracks by intent rather than by `playing()`, since a
track can be queued-but-not-yet-playing. It exposes `needsGesture` for the prompt that
`ExperienceRoot` renders next to the mute toggle.

## Verifying visually

Chrome headless pins a 500px minimum window width and its `--virtual-time-budget` does
not advance `requestAnimationFrame`, so `--screenshot` alone will misreport both layout
and any rAF animation. Drive it over CDP instead (`Emulation.setDeviceMetricsOverride`
for a true 402px viewport, real waits, `Input.dispatchMouseEvent` for clicks).

Everything is a Server Component by default; only `AudioPlayer` carries `'use client'`. Keep interactivity pushed down into small client leaves rather than marking sections or pages as client.

`app/lib/tracks.js` is the single source of truth for audio. Reference tracks through it instead of hardcoding `/audio/...` paths, and add new files to `public/audio/` with kebab-case names (spaces in filenames make fragile URLs).

Theme colors (`ink`, `surface`, `accent`, `lime`) and the `fade-up` / `pulse-ring` animations live in [tailwind.config.cjs](tailwind.config.cjs) — extend there rather than reaching for arbitrary values.

`/demo` is a live smoke test: it renders every UI primitive, plays both tracks, and lists what each check proves. When you add a primitive or change the structure, extend that page so the check stays meaningful.

## Config

Tailwind and PostCSS use `.cjs` configs only. Do not add `.js` twins — Node resolves `.js` first, which silently shadows the real config.

## Dependency notes

[CLAUDE_CONTEXT.md](CLAUDE_CONTEXT.md) (Spanish) records the intended stack. Several packages named there are **not yet installed**: `gsap`, `framer-motion`, `use-sound`. Install them when animation or audio work begins.

`react-bits` and `liquid-glass` are in `package.json` but the package names were guesses and were never confirmed against the libraries actually wanted (React Bits is normally consumed via its CLI/copy-paste, not this npm name). Verify before importing from either.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
