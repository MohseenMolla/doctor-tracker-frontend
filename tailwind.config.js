/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F7F6',
        ink: { 950: '#091D21', 900: '#0E2A2F', 800: '#16383E', 700: '#2B4A50', 600: '#44646A', 500: '#5E7A7F', 400: '#8AA0A3', 300: '#B7C6C8', 200: '#D9E3E2', 100: '#E9F0EF', 50: '#F3F7F6' },
        brand: { 50: '#E6F4F1', 100: '#C5E6E0', 200: '#92CFC6', 400: '#35A89D', 500: '#0E8F86', 600: '#0B7A75', 700: '#096560' },
        sun: { 100: '#FBEBCF', 500: '#E9A23B', 600: '#C98524' },
        rose: { 50: '#FCEBF0', 500: '#D0577A', 600: '#B93F63' },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: { panel: '0 1px 2px rgba(14,42,47,.05), 0 8px 24px -12px rgba(14,42,47,.12)' },
      keyframes: { draw: { to: { strokeDashoffset: '0' } } },
      animation: { draw: 'draw 2.8s ease-out forwards' },
    },
  },
  plugins: [],
};
