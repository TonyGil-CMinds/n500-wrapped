'use client'

import CountUp from '../ui/CountUp'
import StoryHero from './StoryHero'
import { cn } from '../../lib/cn'

const stagger = (i, base = 120) => ({ animationDelay: `${base + i * 220}ms` })

/** Pinta una slide del guion según su `kind`. */
export default function StorySlide({ slide, companyName, userName }) {
  if (slide.kind === 'hero') {
    return <StoryHero slide={slide} userName={userName} />
  }

  if (slide.kind === 'stat') {
    return (
      <div className="flex flex-col items-center">
        <span
          className="animate-slide-in font-display text-[clamp(4.5rem,26vw,10rem)] font-extrabold leading-none tracking-tight text-lime"
          style={stagger(0, 0)}
        >
          <CountUp to={slide.value} />
        </span>
        <span
          className="mt-4 animate-slide-in text-lg uppercase tracking-[0.28em] text-white/70"
          style={stagger(1)}
        >
          {slide.label}
        </span>
        <span
          className="mt-3 animate-slide-in font-serif text-2xl italic text-lime-pale"
          style={stagger(2)}
        >
          {slide.caption}
        </span>
      </div>
    )
  }

  if (slide.kind === 'list') {
    return (
      <div className="flex flex-col items-center">
        {slide.intro ? (
          <span
            className="mb-6 animate-slide-in text-sm uppercase tracking-[0.3em] text-white/50"
            style={stagger(0, 0)}
          >
            {slide.intro}
          </span>
        ) : null}
        <ul className="flex flex-col items-center gap-3">
          {slide.items.map((item, i) => (
            <li
              key={item}
              className="animate-slide-in font-serif text-[clamp(1.6rem,7vw,2.6rem)] italic leading-tight text-white"
              style={stagger(i)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (slide.kind === 'reveal') {
    return (
      <div className="flex flex-col items-center">
        <span
          className="animate-slide-in rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 text-xs uppercase tracking-[0.24em] text-lime-pale"
          style={stagger(0, 0)}
        >
          {companyName}
        </span>
        <p
          className="mt-8 max-w-md animate-slide-in text-balance text-base text-white/70"
          style={stagger(1)}
        >
          {slide.kicker}
        </p>
        <p
          className="mt-3 animate-glow-in font-serif text-[clamp(2.8rem,15vw,5.5rem)] italic leading-[1.05] text-lime"
          style={stagger(2)}
        >
          {slide.headline}
        </p>
        <p
          className="mt-4 animate-slide-in text-sm uppercase tracking-[0.3em] text-white/60"
          style={stagger(3)}
        >
          {slide.sub}
        </p>
      </div>
    )
  }

  // kind === 'text'
  return (
    <div className="flex max-w-2xl flex-col items-center gap-3">
      {slide.lines.map((line, i) => {
        const isLast = i === slide.lines.length - 1
        const highlight =
          slide.emphasis === 'serif' || (slide.emphasis === 'last' && isLast)
        return (
          <p
            key={line}
            className={cn(
              'animate-slide-in text-balance',
              highlight
                ? 'font-serif text-[clamp(2rem,9vw,3.4rem)] italic leading-tight text-lime-pale'
                : 'text-[clamp(1.05rem,4.6vw,1.6rem)] leading-snug text-white/80',
            )}
            style={stagger(i, 60)}
          >
            {line}
          </p>
        )
      })}
    </div>
  )
}
