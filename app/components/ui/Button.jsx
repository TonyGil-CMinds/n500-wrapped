import { cn } from '../../lib/cn'

const variants = {
  primary: 'bg-lime text-ink hover:bg-lime-bright',
  ghost: 'border border-white/20 text-white hover:border-white/50 hover:bg-white/5',
  // Píldora translúcida con borde iluminado, como el CTA del hero.
  glass:
    'border border-lime-pale/25 bg-white/[0.04] text-white backdrop-blur-sm ' +
    'shadow-[0_0_28px_-6px_rgba(184,224,26,0.45),inset_0_1px_0_rgba(228,245,176,0.25)] ' +
    'hover:border-lime-pale/50 hover:bg-white/[0.08]',
}

export default function Button({ variant = 'primary', className, as: Tag = 'button', ...props }) {
  return (
    <Tag
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium',
        'transition-all duration-300 focus-visible:outline focus-visible:outline-2',
        'focus-visible:outline-offset-2 focus-visible:outline-lime-pale disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
