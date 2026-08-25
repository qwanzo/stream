/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '390px',  // iPhone SE / small phones
      },
      colors: {
        netflix: {
          red: '#E50914',
          darkRed: '#B81D24',
          black: '#141414',
          card: '#181818',
          gray: '#2F2F2F',
          lightGray: '#AAA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Segoe UI', 'sans-serif']
      }
    },
  },
  plugins: [],
}
