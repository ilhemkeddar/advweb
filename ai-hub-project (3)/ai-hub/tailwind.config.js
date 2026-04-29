/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFBFC',
        foreground: '#0F1419',
        primary: {
          DEFAULT: '#0A5F7F',
          foreground: '#ffffff',
        },
        sidebar: {
          DEFAULT: '#0A2540',
          foreground: '#F0F4F8',
          accent: '#134E6B',
          border: 'rgba(240,244,248,0.1)',
        },
        accent: {
          DEFAULT: '#F59E0B',
          foreground: '#ffffff',
        },
        cyan: '#06B6D4',
        success: '#10B981',
        muted: {
          DEFAULT: '#E5E9ED',
          foreground: '#64748B',
        },
        border: 'rgba(15,20,25,0.1)',
        card: '#ffffff',
      },
      fontFamily: {
        display: ['"Crimson Pro"', 'serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
