import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // In Tailwind CSS v4 alpha, the `extend` key is removed.
    // We spread the default theme and add our custom configurations directly.
    colors: {
      ...defaultTheme.colors,
      // Grouped all brand colors into a single nested object for consistency
      // and to fix issues with the Tailwind v4 parser.
      brand: {
        blue: '#2563EB',
        'blue-light': '#EFF6FF',
        green: '#10B981',
        dark: '#111827',
        gray: '#6B7280',
      },
      primary: {
        DEFAULT: '#4F46E5', // indigo-600
        hover: '#4338CA'    // indigo-700
      },
      secondary: '#6c757d',
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ['Roboto', ...defaultTheme.fontFamily.sans], // Changed from Inter to Roboto
    },
    // New animations from user's request
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
  plugins: [],
}