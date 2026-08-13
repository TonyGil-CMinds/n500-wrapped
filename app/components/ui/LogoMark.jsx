import { cn } from '../../lib/cn'

/**
 * Insignia circular con el logo de N500.
 *
 * El SVG vive en `public/logo-n500.svg` y se usa tal cual (con su degradado y
 * su glow propios) en lugar de redibujarlo aquí.
 */
export default function LogoMark({ className, size = 64, style, ...props }) {
  return (
    <div
      className={cn('relative grid place-items-center rounded-full', className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {/* Halo exterior difuso */}
      <span className="absolute inset-0 rounded-full bg-lime/20 blur-xl" />

      {/* Aro con luz que cae hacia abajo a la izquierda */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'conic-gradient(from 210deg, rgba(228,245,176,0.55), rgba(184,224,26,0.08) 35%, transparent 60%, rgba(228,245,176,0.3) 100%)',
          mask: 'radial-gradient(circle, transparent 63%, #000 64%)',
          WebkitMask: 'radial-gradient(circle, transparent 63%, #000 64%)',
        }}
      />

      {/* Disco interior */}
      <span className="absolute inset-[3px] rounded-full bg-ink" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-n500.svg"
        alt="N500"
        className="relative"
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
    </div>
  )
}
