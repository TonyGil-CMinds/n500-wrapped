'use client'

/**
 * Barras de progreso tipo "stories": una por slide, la activa se llena.
 * El ancho lo escribe StoryPlayer por ref para no re-renderizar en cada frame.
 */
export default function StoryProgress({ count, index, barsRef }) {
  return (
    <div className="flex w-full gap-1.5" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/15">
          <div
            ref={(el) => {
              barsRef.current[i] = el
            }}
            className="h-full rounded-full bg-lime-pale"
            style={{ width: i < index ? '100%' : '0%' }}
          />
        </div>
      ))}
    </div>
  )
}
