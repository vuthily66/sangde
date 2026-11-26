/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tangerine: { DEFAULT: '#F97316', light: '#FFEDD5', dark: '#C2410C' },
        cabbage: { DEFAULT: '#16A34A', light: '#DCFCE7', dark: '#15803D' },
        basalt: { DEFAULT: '#1E293B', light: '#334155' },
        ivory: '#FAFAF9',
      },
      fontFamily: {
        brush: ['"Nanum Brush Script"', 'cursive'],
        sans: ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'stamp-in': {
          '0%': { transform: 'scale(3) rotate(-25deg)', opacity: '0' },
          '60%': { transform: 'scale(0.9) rotate(-12deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-60px)', opacity: '0' },
        },
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sway: {
          '0%,100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        'stamp-in': 'stamp-in 0.55s cubic-bezier(.2,.8,.3,1.2) forwards',
        'float-up': 'float-up 1s ease-out forwards',
        bob: 'bob 2.4s ease-in-out infinite',
        pop: 'pop 0.25s ease-out',
        sway: 'sway 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
