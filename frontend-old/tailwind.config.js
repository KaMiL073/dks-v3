module.exports = {
//  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'dks-font': '#686868',
        'dks-red': '#cf2626',
        'dks-light-gray': '#f6f7fa',
        'dks-light-gray/25': '#f6f7fa40',
        'dks-gray': '#535457',
        'dks-medium-gray': '#e5e8ef',
        'dks-dark-gray': '#20292f',
        'dks-darker-gray': '#1c2429',
        'dks-font-gray': '#686767',
        'dks-link-hover': '#3f9cc8',
        'dks-orange-link-hover': '#f17b02',
        'dks-orange': '#FF8331',
        'dks-sea-blue': '#3f9cc8',
        'dks-footer': '#415566',
        'dks-slider-products': '#0062c2',
        'dks-form-bg': '#dededd',
        'dks-form-border': '#c4c4c3',
      },
      fontFamily: {
        sans: [
          'din-condensed',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      screens: {
        sm: { max: '768px' },
        md: { min: '769px' },
      },
      fontSize: {
        tiny: '.6rem',
      },
      width: {
        15: '15%',
        29: '29%',
        45: '45%',
        49: '49%',
      },
      height: {
        '75-screen': '75vh',
        '65-screen': '65vh',
      },
      zIndex: {
        n1: -1,
      },
    },
  },
  variants: {
    extend: {},
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};
