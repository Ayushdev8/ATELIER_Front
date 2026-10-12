/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F6',
          100: '#F2E8E5',
          200: '#EADDD7',
          300: '#E0CEC7',
          400: '#D2BAB0',
          500: '#C2785C',
          600: '#A95C40',
          700: '#8E462E',
          800: '#6C3320',
          900: '#4A2013',
          dark: '#1C1917',
          light: '#FAF8F5',
        },
        surface: {
          light: '#FBF9F5',
          DEFAULT: '#FFFFFF',
          muted: '#F5F2EB',
          subtle: '#EAE6DC',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(28, 25, 23, 0.05)',
        'soft': '0 8px 24px -4px rgba(28, 25, 23, 0.07)',
        'soft-lg': '0 16px 36px -6px rgba(28, 25, 23, 0.1)',
      }
    },
  },
  plugins: [],
};
