/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101511',
        surface: '#171d17',
        lime: {
          DEFAULT: '#b8e01a',
          bright: '#c9f227',
          pale: '#e4f5b0',
          deep: '#6b7d10',
        },
        azul: {
          DEFAULT: '#2b3fd4',
          deep: '#1b2aa8',
          pale: '#8ab6f0',
        },
        accent: {
          DEFAULT: '#b8e01a',
          soft: '#e4f5b0',
        },
      },
      fontFamily: {
        // Cuerpo, botones y párrafos
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        // Titulares
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.25' },
          '50%': { transform: 'translateY(-22px) translateX(6px)', opacity: '0.9' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.75' },
          '50%': { opacity: '1' },
        },
        slice: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(28px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'glow-in': {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '60%': { opacity: '1' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.45)' },
          '50%': { transform: 'scaleY(1)' },
        },
        // Deriva de las manchas de color del degradado superior.
        drift1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(60px, 40px) scale(1.15)' },
        },
        drift2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.1)' },
          '50%': { transform: 'translate(-50px, 30px) scale(0.95)' },
        },
        // Sentido antihorario, al revés que el `spin` de Tailwind.
        'spin-back': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'rise-up': {
          '0%': { opacity: '0', transform: 'translateY(45%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-ring': 'pulseRing 1.6s ease-out infinite',
        drift: 'drift 7s ease-in-out infinite',
        breathe: 'breathe 5s ease-in-out infinite',
        slice: 'slice 1.1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in': 'slide-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'glow-in': 'glow-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        wave: 'wave 1s ease-in-out infinite',
        'spin-slow': 'spin-back 6s linear infinite',
        'drift-slow': 'drift1 14s ease-in-out infinite',
        'drift-slower': 'drift2 18s ease-in-out infinite',
        'rise-up': 'rise-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
