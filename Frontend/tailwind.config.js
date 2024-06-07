/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ], theme: {
    extend: {
      colors: {
        'midgard-black': '#131313',
        'midgard-white': '#f5f5f5',
        'midgard-blue': '#007bff',
        'midgard-gray': '#202124',
        'midgard-orange': '#f3952f'
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

