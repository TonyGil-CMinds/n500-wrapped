'use client'

import Odometer from './Odometer'
import { cn } from '../../lib/cn'

/**
 * El logotipo N500 formándose: el contador va de 000 a 500 y, al llegar,
 * la N se despliega a la izquierda del 5 para cerrar la marca.
 */
export default function N500Lockup({ revealN, onCountDone, onTick, className }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center font-sans text-[clamp(3.5rem,19vw,7rem)]',
        'font-extrabold leading-none tracking-tight text-white',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'block origin-right overflow-hidden transition-all duration-700',
          '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
          revealN ? 'max-w-[1.2em] opacity-100 blur-0' : 'max-w-0 opacity-0 blur-sm',
        )}
      >
        N
      </span>
      <Odometer
        to={500}
        places={3}
        durationMs={3400}
        onTick={onTick}
        onDone={onCountDone}
        className="text-white"
      />
      <span className="sr-only">N500</span>
    </div>
  )
}
