/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f4c5c',
          400: '#2b6e77',
        },
        accent: "#0aa95a",
      },
      borderRadius: {
        soft: '0.75rem',
        card: '1rem',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
        'soft-sm': '0 6px 18px rgba(15, 23, 42, 0.08)',
      },
      spacing: {
        section: '4.5rem',
        'section-lg': '6rem',
      },
      fontSize: {
        hero: ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 360ms ease-out both'
      }
    }
  },
  plugins: [],
}
