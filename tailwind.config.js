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
      // UNIFIED BRAND THEME:
      // Grouped all custom colors into a single, consistently nested 'brand'
      // object. This resolves the silent parsing error in the Tailwind v4
      // alpha build process, ensuring all color utilities are generated correctly.
      brand: {
        blue: '#2563EB',
        'blue-light': '#EFF6FF',
        green: '#10B981',
        dark: '#111827',
        gray: '#6B7280',
        primary: {
          DEFAULT: '#4F46E5', // Formerly primary.DEFAULT
          hover: '#4338CA'    // Formerly primary.hover
        },
        secondary: '#6c757d', // Formerly secondary
      },
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
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
  plugins: [],
}