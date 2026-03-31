/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B0B0B',
        surface: '#111111',
        'surface-2': '#1A1A1A',
        accent: {
          orange: '#FF4D00',
          red: '#FF2D55',
        },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', 'sans-serif'],
        subheading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-sm': '0 0 12px rgba(255,77,0,0.4)',
        'neon-md': '0 0 24px rgba(255,77,0,0.5)',
        'neon-lg': '0 0 48px rgba(255,77,0,0.4)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #FF4D00, #FF2D55)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
