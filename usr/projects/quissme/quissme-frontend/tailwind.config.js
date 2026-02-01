/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cosmos': {
          '0': '#05060A',
          '1': '#0a0b12',
          '2': '#0f1019',
        },
        'gold': {
          'primary': '#D6B25E',
          'light': '#e8c76f',
          'dark': '#b8944a',
        },
      },
      backdropBlur: {
        'std': '12px',
      },
      borderRadius: {
        'card': '24px',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(214, 178, 94, 0.3)',
        'gold-lg': '0 0 40px rgba(214, 178, 94, 0.5)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
    },
  },
  plugins: [],
};
