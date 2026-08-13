import { cn } from '../../lib/cn'

/**
 * Avatar + nombre del usuario cuyo Wrapped se está viendo.
 * `src` apunta por defecto al SVG de marcador de posición en `public/`.
 */
export default function AvatarChip({
  name,
  src = '/avatar-placeholder.svg',
  className,
  ...props
}) {
  return (
    <div className={cn('flex items-center gap-3', className)} {...props}>
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 ring-lime/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={36}
          height={36}
          className="h-full w-full rounded-full object-cover"
        />
      </span>
      <span className="font-serif text-lg tracking-wide text-white/90">{name}</span>
    </div>
  )
}
