/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#ebeef5',
          200: '#d8dfe9',
          300: '#b7c2d7',
          400: '#8f9fbf',
          500: '#1a237e', // Primary navy blue
          600: '#151b64',
          700: '#10144a',
          800: '#0c0e35',
          900: '#080924',
          950: '#04051a',
        },
        accent: {
          50: '#fef2f7',
          100: '#fde6ef',
          200: '#fccde2',
          300: '#faa4c9',
          400: '#f670a7',
          500: '#e91e63', // Primary pink
          600: '#d41256',
          700: '#b10e47',
          800: '#930c3c',
          900: '#7a0b35',
          950: '#4b031e',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [forms],
};