import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1B1F3B',
          50:  '#E8EAF0',
          100: '#C5CAD9',
          200: '#9EA8BE',
          300: '#7786A3',
          400: '#586A8E',
          500: '#394F7A',
          600: '#2D3D66',
          700: '#1B1F3B',
          800: '#131628',
          900: '#0C0D18',
        },
        accent: {
          DEFAULT: '#00C2FF',
          50:  '#E0F8FF',
          100: '#B3EDFF',
          200: '#80E1FF',
          300: '#4DD5FF',
          400: '#1ACBFF',
          500: '#00C2FF',
          600: '#00A3D9',
          700: '#0082AD',
          800: '#006080',
          900: '#003F54',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
        mono:    ['var(--font-mono)',  ...defaultTheme.fontFamily.mono],
      },
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'glass':      '0 4px 24px 0 rgba(0,194,255,0.08)',
        'glass-lg':   '0 8px 40px 0 rgba(0,194,255,0.12)',
        'card':       '0 2px 12px 0 rgba(27,31,59,0.08)',
        'card-hover': '0 8px 32px 0 rgba(27,31,59,0.16)',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'voice-ring': 'voiceRing 1.4s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                              to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)' },  to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' },      to: { opacity: '1', transform: 'scale(1)' } },
        pulseSoft: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        voiceRing: {
          '0%':   { transform: 'scale(1)',   opacity: '0.8' },
          '50%':  { transform: 'scale(1.4)', opacity: '0.3' },
          '100%': { transform: 'scale(1)',   opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};

export default config;