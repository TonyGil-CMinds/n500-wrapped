import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

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
  themeColor: '#0a0b07',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-white">{children}</body>
    </html>
  )
}
