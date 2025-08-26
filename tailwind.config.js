/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2563EB',
        'brand-blue-light': '#EFF6FF',
        'brand-green': '#10B981',
        'brand-dark': '#111827',
        'brand-gray': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}