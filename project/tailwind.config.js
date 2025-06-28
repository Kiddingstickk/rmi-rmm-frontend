/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'animate-fade-up',
    'animate-typing',
    'animate-glow',
    'blob',
    'typing-container',
  ],
  theme: {
    extend: {
      colors: {
        creamWhite: '#fef6e4',
        softCyan: '#8bd3dd',
        pastelPink: '#f582ae',
        deepNavy: '#001858',
        coolBlueGray: '#172c66',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 130, 174, 0.4)' },
          '50%': { boxShadow: '0 0 10px 10px rgba(245, 130, 174, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        typing: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        blink: {
          '50%': { borderColor: 'transparent' },
          '100%': { borderColor: 'currentColor' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        glow: 'pulseGlow 2s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite',
        typing: 'typing 3s steps(30, end) forwards',
        blink: 'blink 0.8s step-end infinite',
      },
    },
  },
  plugins: [],
}
