/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0', transform: 'translateY(-10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // indigo-600
          hover: '#4338CA'  // indigo-700
        },
        secondary: '#6c757d',
      }
    },
  },
  plugins: [],
}
