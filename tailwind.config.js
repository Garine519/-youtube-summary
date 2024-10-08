/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e7f2f9',
          200: '#a1d2e8',
          300: '#75ABC2',
          400: '#598496',
          500: '#3f5f6d',
          600: '#273d46',
          700: '#111d23',
          DEFAULT: '#3f5f6d'
        },
        secondary: {
          100: '#eff0f8',
          200: '#cfd3e9',
          300: '#a2abd6',
          400: '#7584C2',
          500: '#50609c',
          600: '#343f6a',
          700: '#1a213b'
        },
        tertiary: {
          100: '#90ecda',
          200: '#75C2B3',
          300: '#5b998d',
          400: '#437269',
          500: '#2c4e47',
          600: '#172c28',
          700: '#071311'
        },
        neutral: {
          100: '#f0f1f1',
          200: '#c7cbcd',
          300: '#a0a4a6',
          400: '#7b7f80',
          500: '#595b5c',
          600: '#383a3b',
          700: '#1b1c1c'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: [],
}