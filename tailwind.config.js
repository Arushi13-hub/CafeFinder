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
        // Deep Harbor / Primary Dark: #0A2947
        harbor: {
          950: '#061a2e',
          900: '#0A2947', // Primary Dark
          850: '#0d3257', // Layered surface
          800: '#113c66', // Elevated surface
          750: '#154675',
          700: '#1b5287',
          600: '#2665a3',
        },
        // Cream Linen / Light Accent: #F3E4C9
        linen: {
          DEFAULT: '#F3E4C9',
          50: '#FCF9F3',
          100: '#FAF3E8',
          200: '#F3E4C9', // Brand Cream Linen
          300: '#E8D2AF',
          400: '#DCBE95',
        },
        // Soft Sage / Neutral Tone: #D3D4C0
        sage: {
          DEFAULT: '#D3D4C0',
          50: '#F5F5F0',
          100: '#EAEBE3',
          200: '#D3D4C0', // Brand Soft Sage
          300: '#B8BAA0',
          400: '#9C9F80',
          border: 'rgba(211, 212, 192, 0.2)',
        },
        // Roasted Amber / Artisan Accent: #8B5E3C
        amberArtisan: {
          DEFAULT: '#8B5E3C',
          50: '#F7F3EE',
          100: '#EDE3D8',
          200: '#D6C0AB',
          300: '#BF9C7D',
          400: '#A47953',
          500: '#8B5E3C', // Brand Roasted Amber
          600: '#754D2F',
          700: '#5E3B22',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'harbor-card': '0 8px 30px -4px rgba(4, 16, 28, 0.65), 0 0 0 1px rgba(211, 212, 192, 0.15)',
        'harbor-hover': '0 16px 36px -6px rgba(4, 16, 28, 0.85), 0 0 0 1px rgba(243, 228, 201, 0.4)',
        'amber-glow': '0 0 25px -4px rgba(139, 94, 60, 0.45)',
        'linen-glow': '0 0 25px -4px rgba(243, 228, 201, 0.3)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      }
    },
  },
  plugins: [],
}
