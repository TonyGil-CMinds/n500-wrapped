import { cn } from '../../lib/cn'

/**
 * Tarjeta de una empresa de la red: foto de fondo, bandera y país, nombre y
 * la ficha (año · rol · color), con contorno verde.
 *
 * `text-left` es necesario: la sección del relato lleva `text-center` y el
 * contenido de la tarjeta lo heredaba.
 *
 * El desenfoque de las tarjetas del fondo entra por la variable `--card-blur`
 * en vez de por la propiedad `filter` directamente: así GSAP anima un número y
 * no tiene que interpolar la cadena `blur(Npx)`.
 */
export default function NetworkCard({ card, name, className }) {
  return (
    <article
      data-card-frame
      className={cn(
        'relative overflow-hidden rounded-[1.6rem] border border-lime/70 text-left',
        'bg-surface shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]',
        className,
      )}
      style={{
        filter: 'blur(var(--card-blur, 0px))',
        // `--card-fade` va de 0 a 1 cuando la imagen se retira: difumina el
        // borde inferior para que no quede un corte recto en pantalla.
        maskImage:
          'linear-gradient(to bottom, #000 calc(100% - var(--card-fade, 0) * 55%), transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, #000 calc(100% - var(--card-fade, 0) * 55%), transparent 100%)',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={card.image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Degradado para que el texto se lea sobre cualquier foto */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/25"
      />

      <div className="relative flex h-full flex-col justify-between p-5">
        <span
          data-card-text
          className="inline-flex w-fit items-center gap-2 rounded-md bg-black/55 px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={card.flag} alt="" aria-hidden className="h-3 w-[18px] rounded-[2px]" />
          {card.country}
        </span>

        <div data-card-text>
          <span className="inline-flex w-fit rounded-full border border-white/70 px-3 py-1 text-[0.68rem] text-white">
            {card.category}
          </span>
          <h3 className="mt-3 font-display text-[1.45rem] font-extrabold uppercase leading-none tracking-tight text-white">
            {name ?? card.name}
          </h3>
          <p className="mt-2.5 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-white/80">
            {card.meta.join(' · ')}
          </p>
        </div>
      </div>
    </article>
  )
}
