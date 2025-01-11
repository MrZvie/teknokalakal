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
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1092px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
  
        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
    },
  },
  plugins: [],
};
