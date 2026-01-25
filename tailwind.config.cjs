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
          600: '#0f4c5c',
        },
        accent: "#0aa95a",
      },
      // Consistent border radius scale
      borderRadius: {
        'card': '1rem',      // 16px - standard cards
        'button': '0.5rem',  // 8px - buttons
        'input': '0.5rem',   // 8px - form inputs
        'modal': '1.5rem',   // 24px - modals/dialogs
      },
      // Controlled shadow scale
      boxShadow: {
        'soft': '0 2px 8px rgba(15, 23, 42, 0.06)',
        'card': '0 4px 12px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 8px 24px rgba(15, 23, 42, 0.12)',
        'elevated': '0 12px 32px rgba(15, 23, 42, 0.14)',
      },
      // Minimal, purposeful animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 300ms ease-out',
        'fade-up': 'fade-up 360ms ease-out both',
        'slide-up': 'slide-up 400ms ease-out'
      },
      // Typography scale for consistency
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'heading': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'subheading': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
      }
    }
  },
  plugins: [],
}
