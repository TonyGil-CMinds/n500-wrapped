'use client'

import { useState } from 'react'
import Button from '../ui/Button'
import GuideLines from '../ui/GuideLines'
import LogoMark from '../ui/LogoMark'
import Particles from '../ui/Particles'
import { badge } from '../../lib/story'

/** Pantalla final: la medalla, el copy de uso y el cierre. */
export default function BadgeScreen({ companyName, onRestart, sound }) {
  const [shared, setShared] = useState(null)

  async function handleShare() {
    sound?.click()
    const text = `${companyName} es una de las ${badge.award} de Natura500. ${badge.closing}`
    try {
      if (navigator.share) {
        await navigator.share({ title: badge.title, text, url: window.location.href })
        setShared('shared')
        return
      }
      await navigator.clipboard.writeText(`${text} ${window.location.href}`)
      setShared('copied')
    } catch {
      // El usuario canceló el diálogo, o no hay permiso de portapapeles.
      setShared(null)
    }
  }

  return (
    <section className="wrapped-slide justify-start gap-10 overflow-y-auto py-16">
      <div aria-hidden className="glow-floor pointer-events-none absolute inset-0" />
      <GuideLines />
      <Particles />

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <p className="animate-slide-in text-xs uppercase tracking-[0.35em] text-lime-pale">
          {badge.eyebrow}
        </p>

        {/* La medalla */}
        <article
          className="mt-8 w-full animate-glow-in rounded-[2rem] border border-lime/25 bg-gradient-to-b from-lime/[0.14] via-surface to-ink p-8 text-center shadow-[0_0_60px_-20px_rgba(184,224,26,0.6)]"
          style={{ animationDelay: '160ms' }}
        >
          <LogoMark size={56} className="mx-auto" />

          <h2 className="mt-6 font-display text-3xl font-extrabold uppercase tracking-[0.12em] text-white">
            {badge.title}
          </h2>

          <div className="mx-auto my-6 h-px w-16 bg-lime/40" />

          <p className="font-serif text-[clamp(1.9rem,9vw,2.8rem)] italic leading-tight text-lime">
            {badge.award}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/60">
            {badge.generation}
          </p>

          <p className="mt-8 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80">
            {companyName}
          </p>
        </article>

        <div
          className="mt-8 flex animate-slide-in flex-wrap justify-center gap-3"
          style={{ animationDelay: '420ms' }}
        >
          <Button variant="primary" onClick={handleShare} onMouseEnter={() => sound?.hover()}>
            {shared === 'copied' ? 'Copiado ✓' : shared === 'shared' ? 'Compartido ✓' : 'Compartir'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              sound?.click()
              onRestart()
            }}
            onMouseEnter={() => sound?.hover()}
          >
            Volver a verlo
          </Button>
        </div>

        <div
          className="mt-10 animate-slide-in space-y-1 text-sm text-white/55"
          style={{ animationDelay: '540ms' }}
        >
          {badge.usage.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div
          className="mt-8 max-w-md animate-slide-in space-y-2 text-balance text-sm text-white/70"
          style={{ animationDelay: '640ms' }}
        >
          {badge.meaning.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <p
          className="mt-10 animate-glow-in font-serif text-[clamp(1.8rem,8vw,2.6rem)] italic text-lime-pale"
          style={{ animationDelay: '760ms' }}
        >
          {badge.closing}
        </p>
        <p
          className="mt-4 animate-slide-in text-sm text-white/50"
          style={{ animationDelay: '860ms' }}
        >
          {badge.welcome}
        </p>
      </div>
    </section>
  )
}
