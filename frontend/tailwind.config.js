/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core dark backgrounds
        'dp-bg': {
          DEFAULT: '#0A0A0F',
          50: '#0E0E15',
          100: '#12121C',
          200: '#1A1A28',
          300: '#222234',
        },
        // Neon accent colors
        'dp-green': {
          DEFAULT: '#00FF88',
          50: '#E0FFF0',
          100: '#B3FFD9',
          200: '#66FFB3',
          300: '#33FF99',
          400: '#00FF88',
          500: '#00CC6A',
          600: '#009950',
          700: '#006636',
        },
        'dp-amber': {
          DEFAULT: '#FFB800',
          50: '#FFF8E0',
          100: '#FFECB3',
          200: '#FFD966',
          300: '#FFC933',
          400: '#FFB800',
          500: '#CC9300',
          600: '#996E00',
        },
        'dp-red': {
          DEFAULT: '#FF3366',
          50: '#FFE0E9',
          100: '#FFB3C7',
          200: '#FF668F',
          300: '#FF3366',
          400: '#FF0044',
          500: '#CC0036',
          600: '#990029',
        },
        'dp-cyan': {
          DEFAULT: '#00D4FF',
          50: '#E0F9FF',
          100: '#B3F0FF',
          200: '#66E2FF',
          300: '#33DBFF',
          400: '#00D4FF',
          500: '#00A9CC',
          600: '#007F99',
        },
        'dp-purple': {
          DEFAULT: '#8B5CF6',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'glow-green': 'radial-gradient(ellipse at center, rgba(0, 255, 136, 0.15) 0%, transparent 70%)',
        'glow-red': 'radial-gradient(ellipse at center, rgba(255, 51, 102, 0.15) 0%, transparent 70%)',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #12121C 50%, #1A1A28 100%)',
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.3), 0 0 60px rgba(0, 255, 136, 0.1)',
        'glow-red': '0 0 20px rgba(255, 51, 102, 0.3), 0 0 60px rgba(255, 51, 102, 0.1)',
        'glow-amber': '0 0 20px rgba(255, 184, 0, 0.3), 0 0 60px rgba(255, 184, 0, 0.1)',
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'counter-up': 'counter-up 2s ease-out',
        'fade-up': 'fade-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
