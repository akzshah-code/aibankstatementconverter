import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#10B981',         // Green for primary user actions (Login/Register)
        'brand-primary-hover': '#059669',  // Darker green for hover
        'brand-blue': '#2563EB',           // Blue for commercial/secondary actions (Buy/Contact)
        'brand-blue-hover': '#1D4ED8',     // Darker blue for hover
        'brand-blue-light': '#EFF6FF',
        'brand-green': '#10B981',          // Keep for accents like checkmarks
        'brand-dark': '#111827',
        'brand-gray': '#6B7280',
        'brand-secondary': '#6c757d',
      },
      fontFamily: {
        sans: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
