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
        'main-bg-dark': '#313338',
        'main-bg-light': '#ffffff',
        'secondary-bg-dark': '#2b2d31',
        'secondary-bg-light': '#f2f3f5',
        grey: {
          50: '#FFFFFF',
          100: '#F4F4F5',
          200: '#E9EAED',
          300: '#DBDDE1',
          400: '#B4B7BB',
          500: '#747881',
          600: '#4c525c',
          700: '#272A30',
          800: '#1C1E22',
          900: '#17191C',
          950: '#080707',
        },
        red: {
          600: '#FF3742',
        },
        blue: {
          50: '#CCDFFF',
          100: '#E0F0FF',
          400: '#337EFF',
          300: '#669fff',
          500: '#005FFF',
          700: '#003999',
          900: '#00193D',
        },
      },
      dropShadow: {
        'tablet-modal-shadow': '0 0 10px  rgba(0 , 0 , 0 , 0.6)',
        'tablet-modal-shadow-dark': '0 0 10px  rgba(0 , 0 , 0 , 1)',
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('not-first', '&:not(:first-child)')
      addVariant('not-last', '&:not(:last-child)')
    },
  ],
}
