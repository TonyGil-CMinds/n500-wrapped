'use client'

import Odometer from './Odometer'
import { DIGIT_WIDTHS, LOGO_CHARS, LOGO_EM_HEIGHT, LOGO_VIEWBOX } from './logoChars'
import { cn } from '../../lib/cn'

/** Cada carácter se transforma un poco después que el anterior. */
const STAGGER_MS = 170
/**
 * El texto sale rápido y el glifo entra después. Si ambos se cruzaran a media
 * opacidad, dos siluetas pesadas y desenfocadas se sumarían hasta parecer un
 * bloque sólido: es lo que pasaba con la N.
 */
const TEXT_OUT_MS = 300
const GLYPH_IN_MS = 460
const GLYPH_DELAY_MS = 200
const EASE_OUT = '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]'

/**
 * Una celda del logotipo: el carácter tipográfico y su glifo, superpuestos.
 * Al pasar a `logo` el texto encoge y se desenfoca mientras el glifo entra
 * creciendo y girando, así que la deformación ocurre en el mismo hueco.
 */
function CharCell({ char, index, isLogo, collapsed }) {
  const delay = `${index * STAGGER_MS}ms`

  return (
    <span
      aria-hidden
      className={cn(
        'relative block h-[1em] origin-right transition-all duration-700',
        EASE_OUT,
        collapsed && 'opacity-0 blur-sm',
      )}
      style={{ width: collapsed ? 0 : char.width }}
    >
      <span
        className={cn(
          'absolute inset-0 grid place-items-center transition-all',
          isLogo ? 'scale-[0.72] opacity-0 blur-[3px]' : 'scale-100 opacity-100 blur-0',
        )}
        style={{ transitionDuration: `${TEXT_OUT_MS}ms`, transitionDelay: delay }}
      >
        {char.text}
      </span>

      <svg
        viewBox={LOGO_VIEWBOX(char)}
        fill="currentColor"
        className={cn(
          'absolute left-0 top-1/2 w-full -translate-y-1/2 transition-all',
          EASE_OUT,
          isLogo
            ? 'rotate-0 scale-100 opacity-100 blur-0'
            : 'rotate-[5deg] scale-[1.18] opacity-0 blur-[3px]',
        )}
        style={{
          height: `${LOGO_EM_HEIGHT}em`,
          transitionDuration: `${GLYPH_IN_MS}ms`,
          transitionDelay: `${index * STAGGER_MS + GLYPH_DELAY_MS}ms`,
        }}
      >
        {char.paths.map((d) => (
          <path key={d.slice(0, 24)} d={d} />
        ))}
      </svg>
    </span>
  )
}

/**
 * El logotipo N500 formándose en tres etapas:
 *
 *  count  → el odómetro corre de 000 a 500
 *  letter → la N se despliega a la izquierda del 5
 *  logo   → cada carácter se deforma, de izquierda a derecha, hasta el logo
 *
 * Las celdas miden lo que ocupa cada glifo en el logotipo real, y el odómetro
 * recibe esos mismos anchos. Así, cuando las ruedas se detienen y el texto
 * estático las releva, nada se mueve.
 *
 * No es una interpolación de contornos —eso exigiría interpolar los trazados
 * glifo a glifo—, pero al ocurrir por turnos y en el sitio exacto donde acabará
 * cada glifo, la deformación se percibe carácter a carácter.
 */
export default function N500Lockup({ stage = 'count', onCountDone, onTick, className }) {
  const isLogo = stage === 'logo'
  const counting = stage === 'count'
  const [nChar, ...digitChars] = LOGO_CHARS

  return (
    <div
      className={cn(
        'flex items-center justify-center font-display text-[clamp(3.5rem,19vw,7rem)]',
        'font-extrabold leading-none tracking-tight text-lime-pale',
        className,
      )}
      role="img"
      aria-label="N500"
    >
      <CharCell char={nChar} index={0} isLogo={isLogo} collapsed={counting} />

      {counting ? (
        <Odometer
          to={500}
          places={3}
          durationMs={3400}
          widths={DIGIT_WIDTHS}
          onTick={onTick}
          onDone={onCountDone}
        />
      ) : (
        digitChars.map((char, i) => (
          <CharCell key={char.key} char={char} index={i + 1} isLogo={isLogo} />
        ))
      )}
    </div>
  )
}
