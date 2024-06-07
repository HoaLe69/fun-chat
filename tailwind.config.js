/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      maxWidth: {
        aside: '360px',
      },
      colors: {
        grey: {
          300: '#DBDDE1',
          500: '#747881',
          950: '#080707',
        },
        blue: {
          500: '#005FFF',
        },
      },
    },
  },
  plugins: [],
}
