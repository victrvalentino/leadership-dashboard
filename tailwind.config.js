/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0D1B4B', 800: '#1a2a5e', 700: '#243370' },
        brand: {
          green: '#2E7D32', 'green-light': '#f0faf0',
          blue: '#1565C0', 'blue-light': '#e8f0fe',
          purple: '#6A1B9A', 'purple-light': '#f5eeff',
          orange: '#E65100', 'orange-light': '#fff3e0',
          red: '#C62828', 'red-light': '#fde8e8',
          teal: '#00695C', 'teal-light': '#e0f2f1',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
