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
          50: '#FFFFFF',
          300: '#DBDDE1',
          200: '#E9EAED',
          400: '#B4B7BB',
          500: '#747881',
          700: '#272A30',
          800: '#1C1E22',
          900: '#1C191C',
          950: '#080707',
        },
        blue: {
          400: '#337EFF',
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
