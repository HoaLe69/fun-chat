/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {
      width: {
        menu: '295px',
      },
      maxWidth: {
        aside: '360px',
      },
      colors: {
        grey: {
          300: '#DBDDE1',
          200: '#E9EAED',
          400: '#B4B7BB',
          500: '#747881',
          950: '#080707',
        },
        blue: {
          500: '#005FFF',
        },
      },
      dropShadow: {
        'tablet-modal-shadow': '0 0 10px 0 rgba(0 , 0 , 0 , 0.6)',
      },
    },
  },
  plugins: [],
}
