/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf6e3',
          100: '#fbe8c0',
          200: '#f9da9d',
          300: '#f7cc7a',
          400: '#f5be57',
          500: '#D4AF37', // Gold
          600: '#b8942e',
          700: '#9c7a25',
          800: '#80601c',
          900: '#644613',
        },
        secondary: {
          50: '#eef2f7',
          100: '#d5dde8',
          200: '#bcc8d9',
          300: '#a3b3ca',
          400: '#8a9ebb',
          500: '#1A2A3A', // Navy
          600: '#15222e',
          700: '#101a22',
          800: '#0a1116',
          900: '#05080b',
        },
        accent: {
          gradient: 'linear-gradient(135deg, #D4AF37 0%, #1A2A3A 100%)',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'heart-beat': 'heartBeat 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.3)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};