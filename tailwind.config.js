/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'aqua-forest': {
          '50': '#f0f9f2',
          '100': '#dbf0df',
          '200': '#bae0c3',
          '300': '#8dc89f',
          '400': '#64af7d',
          '500': '#3b8e5a',
          '600': '#2a7146',
          '700': '#215b38',
          '800': '#1c492e',
          '900': '#183c27',
          '950': '#0d2116',
        },
        'redz': '#DB4444',
        'bluez': '#1B90D2',
      },
    },
  },
  plugins: [],
};
