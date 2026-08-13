import { Host_Grotesk, Playfair_Display, Unbounded } from 'next/font/google'
import './globals.css'

/** Cuerpo: botones y párrafos. */
const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

/** Titulares. */
const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

/** Acentos en cursiva ("nos conecta"). */
const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata = {
  title: 'N500 Wrapped',
  description: 'El resumen anual de N500, al estilo Wrapped.',
}

export const viewport = {
  themeColor: '#101511',
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${hostGrotesk.variable} ${unbounded.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen bg-ink font-sans text-white">{children}</body>
    </html>
  )
}
