import { cn } from '../../lib/cn'

/**
 * Guías verticales punteadas que enmarcan el contenido.
 *
 * Con `animate`, cada línea entra como un "slice": la primera crece desde
 * abajo y la segunda desde arriba, alternando. Decorativas: fuera del flujo
 * y ocultas para lectores de pantalla.
 */
export default function GuideLines({ positions = ['25%', '75%'], animate = false }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {positions.map((left, i) => (
        <span
          key={left}
          style={{
            left,
            transformOrigin: i % 2 === 0 ? 'bottom' : 'top',
            animationDelay: `${i * 140}ms`,
          }}
          className={cn(
            'guide-line absolute top-0 h-full w-px -translate-x-1/2',
            animate ? 'animate-slice' : 'scale-y-100',
          )}
        />
      ))}
    </div>
  )
}
