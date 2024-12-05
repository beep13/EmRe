const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark, tactical theme
        background: {
          DEFAULT: '#0A0C10', // Deeper dark
          lighter: '#141820',  // Slightly lighter for cards
          darker: '#050608',   // For shadows and depth
        },
        primary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          blue: '#0EA5E9',    // For highlights
          green: '#10B981',   // Success states
          red: '#EF4444',     // Critical/Emergency
          yellow: '#F59E0B',  // Warnings
          purple: '#8B5CF6',  // Secondary accent
        },
        surface: {
          DEFAULT: '#1A1F2E',
          light: '#252B3B',
          dark: '#131722',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'tactical': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 2px 4px rgba(0, 0, 0, 0.2)',
        'tactical-lg': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 4px 8px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}; 