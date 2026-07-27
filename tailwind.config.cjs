/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'Cambria', 'serif'],
        sans: ['var(--font-body)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0f4c5c',
          400: '#2b6e77',
        },
        accent: "#0aa95a",
        ata: {
          ink: '#101f2b',
          'ink-soft': '#5a6b78',
          'ink-muted': '#8b98a3',
          canvas: '#f7f3ec',
          shell: '#efe9de',
          brass: '#a2762d',
          'brass-light': '#c9a35a',
          hairline: '#e2dacb',
        },
      },
      letterSpacing: {
        eyebrow: '0.24em',
        display: '-0.035em',
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
