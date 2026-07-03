/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design-system tokens (mirror src/styles/design-system.css :root).
        // rgb + <alpha-value> so /10, /20... opacity modifiers work.
        'text-primary': 'rgb(244 245 247 / <alpha-value>)',
        'text-secondary': 'rgb(154 161 172 / <alpha-value>)',
        'accent-blue': 'rgb(59 130 246 / <alpha-value>)',
        'accent-bright': 'rgb(96 165 250 / <alpha-value>)',
        'bg-primary': 'rgb(10 11 13 / <alpha-value>)',
        'bg-secondary': 'rgb(21 23 27 / <alpha-value>)',
        'bg-tertiary': 'rgb(28 31 36 / <alpha-value>)',
        gold: {
          50: '#fffdf7',
          100: '#fffaeb',
          200: '#fff3c4',
          300: '#ffe999',
          400: '#ffd54e',
          500: '#ffbc02',
          600: '#d49c00',
          700: '#b07c00',
          800: '#8f5f00',
          900: '#754900',
          950: '#4a2e00',
        },
        black: {
          DEFAULT: '#000000',
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};