'use client'

import { cn } from '../../lib/cn'

/**
 * Parte un texto en palabras para poder animarlas por separado.
 *
 * Cada palabra va en una máscara con `overflow-hidden`, de modo que al
 * desplazarla hacia arriba aparece cortada por la línea base en vez de
 * simplemente aparecer. GSAP anima los `[data-word]`.
 *
 * El texto completo queda en un `sr-only` porque, partido en trozos, un lector
 * de pantalla lo leería palabra a palabra.
 */
export default function SplitWords({ text, className, wordClassName }) {
  return (
    <span className={cn('inline-block', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-flex flex-wrap justify-center gap-x-[0.25em]">
        {text.split(' ').map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em]">
            <span data-word className={cn('inline-block', wordClassName)}>
              {word}
            </span>
          </span>
        ))}
      </span>
    </span>
  )
}
