'use client'

import { cn } from '../../lib/cn'

/**
 * Iconos de sonido, en línea (no como <img>) para poder animar cada barra por
 * separado y heredar el color.
 *
 * - `active`: las cinco ondas en degradado lima, latiendo.
 * - reposo: el altavoz apagado.
 *
 * Los trazados vienen de public/icons/icon-sound-actuve.svg y
 * public/icons/icon-audio-normal.svg.
 */

/** Barras de la onda: x, altura en reposo y desfase de la animación. */
const BARS = [
  { x: 2, y: 5, h: 6, delay: '0ms' },
  { x: 5, y: 3.33, h: 9.33, delay: '160ms' },
  { x: 8, y: 1.67, h: 12.67, delay: '320ms' },
  { x: 11, y: 3.33, h: 9.33, delay: '160ms' },
  { x: 14, y: 5, h: 6, delay: '0ms' },
]

export default function AudioIcon({ active, className, size = 15 }) {
  if (active) {
    return (
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill="none"
        className={className}
        aria-hidden
      >
        <defs>
          <linearGradient id="n500-wave" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F0FFC6" />
            <stop offset="1" stopColor="#D3F804" />
          </linearGradient>
        </defs>
        {BARS.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x - 0.5}
            y={bar.y}
            width="1"
            height={bar.h}
            rx="0.5"
            fill="url(#n500-wave)"
            className="origin-center animate-wave"
            style={{ animationDelay: bar.delay }}
          />
        ))}
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 15 15"
      width={size}
      height={size}
      fill="none"
      className={cn('text-white/45', className)}
      aria-hidden
    >
      <path
        d="M8.67506 12.8686C8.18131 12.8686 7.63756 12.6936 7.09381 12.3499L5.2688 11.2061C5.1438 11.1311 5.00005 11.0874 4.8563 11.0874H3.9563C2.4438 11.0874 1.61255 10.2561 1.61255 8.74362V6.24363C1.61255 4.73113 2.4438 3.89988 3.9563 3.89988H4.85005C4.9938 3.89988 5.13755 3.85613 5.26255 3.78113L7.08756 2.63738C8.00006 2.06863 8.88756 1.96238 9.58756 2.34988C10.2876 2.73738 10.6688 3.54363 10.6688 4.62488V10.3561C10.6688 11.4311 10.2813 12.2436 9.58756 12.6311C9.31256 12.7936 9.00631 12.8686 8.67506 12.8686ZM3.9563 4.84363C2.9688 4.84363 2.55005 5.26238 2.55005 6.24988V8.74987C2.55005 9.73737 2.9688 10.1561 3.9563 10.1561H4.85005C5.17505 10.1561 5.48755 10.2436 5.76255 10.4186L7.58756 11.5624C8.19381 11.9374 8.75631 12.0374 9.13756 11.8249C9.51881 11.6124 9.73756 11.0811 9.73756 10.3749V4.63113C9.73756 3.91863 9.51881 3.38738 9.13756 3.18113C8.75631 2.96863 8.19381 3.06238 7.58756 3.44363L5.76255 4.58113C5.48755 4.75613 5.17505 4.84363 4.85005 4.84363H3.9563Z"
        fill="currentColor"
      />
      <path
        d="M12.0813 10.4689C11.9813 10.4689 11.8876 10.4377 11.8001 10.3752C11.5938 10.2189 11.5501 9.92519 11.7063 9.71894C12.6876 8.41269 12.6876 6.58769 11.7063 5.28142C11.5501 5.07517 11.5938 4.78142 11.8001 4.62517C12.0063 4.46892 12.3001 4.51267 12.4563 4.71892C13.6876 6.35644 13.6876 8.64394 12.4563 10.2814C12.3688 10.4064 12.2251 10.4689 12.0813 10.4689Z"
        fill="currentColor"
      />
    </svg>
  )
}
