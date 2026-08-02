/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#021c08',
          'primary-light': '#0d401b',
          secondary: '#a6bfac',
          'secondary-light': '#e0e0e0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '480px',
      },
      keyframes: {
        'whatsapp-pulse': {
          '0%, 88%, 100%': {
            transform: 'scale(1) translateY(0)',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
          },
          '92%': {
            transform: 'scale(1.08) translateY(-2px)',
            boxShadow: '0 8px 22px rgba(37, 211, 102, 0.55)',
          },
          '96%': {
            transform: 'scale(1) translateY(0)',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
          },
        },
      },
      animation: {
        'whatsapp-pulse': 'whatsapp-pulse 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
