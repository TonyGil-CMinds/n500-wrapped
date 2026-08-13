import { cn } from '../../lib/cn'

/** Avatar + nombre del usuario cuyo Wrapped se está viendo. */
export default function AvatarChip({ name, src = '/profile.png', className, ...props }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)} {...props}>
      <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full ring-1 ring-lime/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          width={28}
          height={28}
          className="h-full w-full rounded-full object-cover"
        />
      </span>
      <span className="text-sm font-medium text-white/90">{name}</span>
    </div>
  )
}
